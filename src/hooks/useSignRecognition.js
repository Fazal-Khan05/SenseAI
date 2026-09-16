import { useCallback, useEffect, useRef, useState } from 'react';
import { loadHandLandmarker, JOINTS } from '../lib/handLandmarks';
import { classifyShape } from '../lib/handShapes';
import { createMotionTracker } from '../lib/motionTracker';
import { matchSign } from '../lib/wordSigns';

const DETECT_INTERVAL = 40;     // ~25fps

// Speeds are normalised frame-widths per second.
const STROKE_START = 0.30;      // hand accelerating = a sign is starting
const STROKE_END = 0.12;        // hand settling = the sign is finishing
const STILL_SPEED = 0.10;

const SETTLE_FRAMES = 5;        // frames below STROKE_END that close a stroke
const MIN_STROKE_MS = 180;      // shorter than this is a twitch
const MIN_STROKE_PATH = 0.10;
const HOLD_MS = 700;            // stillness needed to commit a static sign
const REARM_MS = 400;           // stillness needed before another sign can fire
const MIN_CONFIDENCE = 0.4;

/**
 * Camera frames -> word glosses.
 *
 * Gestures are segmented into discrete strokes rather than classified every
 * frame. Continuous classification emits a sign, then a second one while the
 * hand rests, then a third as it returns to neutral — one THANK-YOU became
 * THANK-YOU + STOP + GOOD.
 *
 * States: idle -> stroke -> (commit) -> refractory -> idle
 */
export function useSignRecognition() {
    const landmarkerRef = useRef(null);
    const motionRef = useRef(createMotionTracker());
    const lastRunRef = useRef(0);

    const phaseRef = useRef('idle');
    const strokeStartRef = useRef(0);
    const strokeShapesRef = useRef([]);
    const settleRef = useRef(0);
    const stillSinceRef = useRef(0);
    const holdShapeRef = useRef(null);
    const holdSinceRef = useRef(0);

    const [modelState, setModelState] = useState('loading');
    const [progress, setProgress] = useState(0);
    const [glosses, setGlosses] = useState([]);
    const [live, setLive] = useState({ hand: false, shape: null, phase: 'idle', progress: 0 });

    useEffect(() => {
        let cancelled = false;
        loadHandLandmarker(p => { if (!cancelled) setProgress(p); })
            .then(l => { if (!cancelled) { landmarkerRef.current = l; setModelState('ready'); } })
            .catch(() => { if (!cancelled) setModelState('error'); });
        return () => { cancelled = true; };
    }, []);

    const commit = useCallback((gloss, ts) => {
        setGlosses(g => [...g, gloss]);
        phaseRef.current = 'refractory';
        stillSinceRef.current = ts;
        holdShapeRef.current = null;
        strokeShapesRef.current = [];
        motionRef.current.clear();
    }, []);

    const onFrame = useCallback((video, ts) => {
        const landmarker = landmarkerRef.current;
        if (!landmarker || ts - lastRunRef.current < DETECT_INTERVAL) return;
        lastRunRef.current = ts;

        let result;
        try {
            result = landmarker.detectForVideo(video, ts);
        } catch {
            return;   // MediaPipe rejects out-of-order timestamps
        }

        const hand = result?.landmarks?.[0];

        if (!hand) {
            phaseRef.current = 'idle';
            strokeShapesRef.current = [];
            holdShapeRef.current = null;
            motionRef.current.clear();
            setLive({ hand: false, shape: null, phase: 'idle', progress: 0 });
            return;
        }

        // Track the palm centre, not a fingertip: far steadier while the
        // fingers are changing shape. Mirror x so directions match the preview.
        const palm = hand[JOINTS.MIDDLE[0]];
        motionRef.current.push(1 - palm.x, palm.y, ts);

        const speed = motionRef.current.speed(ts);
        const shape = classifyShape(hand);
        const phase = phaseRef.current;

        if (shape && shape.confidence >= MIN_CONFIDENCE) strokeShapesRef.current.push(shape.shape);
        if (strokeShapesRef.current.length > 60) strokeShapesRef.current.shift();

        let progress = 0;

        if (phase === 'refractory') {
            if (speed > STILL_SPEED) stillSinceRef.current = ts;
            else if (ts - stillSinceRef.current >= REARM_MS) phaseRef.current = 'idle';

        } else if (phase === 'idle') {
            if (speed >= STROKE_START) {
                phaseRef.current = 'stroke';
                strokeStartRef.current = ts;
                strokeShapesRef.current = shape ? [shape.shape] : [];
                settleRef.current = 0;
                holdShapeRef.current = null;
            } else if (speed <= STILL_SPEED && shape && shape.confidence >= MIN_CONFIDENCE) {
                // Static sign: a stable shape held still, committed once.
                if (holdShapeRef.current !== shape.shape) {
                    holdShapeRef.current = shape.shape;
                    holdSinceRef.current = ts;
                }
                const held = ts - holdSinceRef.current;
                progress = Math.min(1, held / HOLD_MS);
                if (held >= HOLD_MS) {
                    const hit = matchSign(shape, { type: 'static', direction: null });
                    if (hit) commit(hit.gloss, ts);
                    else holdSinceRef.current = ts;   // nothing matches; do not re-check every frame
                }
            } else {
                holdShapeRef.current = null;
            }

        } else if (phase === 'stroke') {
            progress = 0.5;
            settleRef.current = speed <= STROKE_END ? settleRef.current + 1 : 0;

            if (settleRef.current >= SETTLE_FRAMES) {
                const duration = ts - strokeStartRef.current;
                const path = motionRef.current.pathSince(strokeStartRef.current);

                if (duration >= MIN_STROKE_MS && path >= MIN_STROKE_PATH) {
                    const motion = motionRef.current.classifySince(strokeStartRef.current);
                    const modal = modalShape(strokeShapesRef.current);
                    const hit = modal ? matchSign({ shape: modal, confidence: 1 }, motion) : null;
                    if (hit) { commit(hit.gloss, ts); return; }
                }

                phaseRef.current = 'refractory';
                stillSinceRef.current = ts;
                strokeShapesRef.current = [];
            }
        }

        setLive({
            hand: true,
            shape: shape?.shape ?? null,
            phase: phaseRef.current,
            progress,
        });
    }, [commit]);

    const reset = useCallback(() => {
        motionRef.current.clear();
        phaseRef.current = 'idle';
        strokeShapesRef.current = [];
        holdShapeRef.current = null;
        setGlosses([]);
        setLive({ hand: false, shape: null, phase: 'idle', progress: 0 });
    }, []);

    const undo = useCallback(() => setGlosses(g => g.slice(0, -1)), []);
    const pushGloss = useCallback((gloss) => setGlosses(g => [...g, gloss]), []);

    return { glosses, live, modelState, progress, onFrame, reset, undo, pushGloss };
}

/** Most frequent shape across a stroke — steadier than any single frame. */
function modalShape(shapes) {
    if (!shapes.length) return null;
    const counts = new Map();
    for (const s of shapes) counts.set(s, (counts.get(s) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
