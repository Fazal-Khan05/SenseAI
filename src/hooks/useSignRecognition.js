import { useCallback, useEffect, useRef, useState } from 'react';
import { loadHandLandmarker, JOINTS } from '../lib/handLandmarks';
import { shapeFromGesture } from '../lib/handShapes';
import { handFeatures } from '../lib/handFeatures';
import { createMotionTracker } from '../lib/motionTracker';
import { matchSign } from '../lib/wordSigns';

const DETECT_INTERVAL = 40;     // ~25fps

// Speeds are normalised frame-widths per second.
// Frame-widths per second. These were originally set against synthetic test
// paths that moved ~3x faster than real signing, so a deliberate sign never
// crossed the start threshold and the recogniser sat in 'idle' forever.
// Landmark jitter on a still hand measures well under 0.05, so 0.15 clears
// noise while staying reachable at a natural signing pace.
const STROKE_START = 0.15;      // hand accelerating = a sign is starting
const STROKE_END = 0.10;        // hand settling = the sign is finishing
const STILL_SPEED = 0.10;

const SETTLE_FRAMES = 5;        // frames below STROKE_END that close a stroke
const MIN_STROKE_MS = 180;      // shorter than this is a twitch
const MIN_STROKE_PATH = 0.10;
const HOLD_MS = 700;            // stillness needed to commit a static sign
const REARM_MS = 400;           // stillness needed before another sign can fire
const MIN_CONFIDENCE = 0.4;

// A recognisable shape held this long without any sign completing counts as an
// attempt: the learner is trying something and it is not landing.
const ATTEMPT_MS = 3500;

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
export function useSignRecognition({ onCommit, onAttempt } = {}) {
    const landmarkerRef = useRef(null);
    const motionRef = useRef(createMotionTracker());
    const lastRunRef = useRef(0);
    const errorsRef = useRef(0);

    const phaseRef = useRef('idle');
    const strokeStartRef = useRef(0);
    const strokeShapesRef = useRef([]);
    const settleRef = useRef(0);
    const stillSinceRef = useRef(0);
    const holdShapeRef = useRef(null);
    const holdSinceRef = useRef(0);

    const shapeHeldSinceRef = useRef(0);
    const heldShapeRef = useRef(null);
    const attemptFiredRef = useRef(false);
    const commitCbRef = useRef(onCommit);
    const attemptCbRef = useRef(onAttempt);

    const [modelState, setModelState] = useState('loading');
    const [progress, setProgress] = useState(0);
    const [glosses, setGlosses] = useState([]);
    const [live, setLive] = useState({ hand: false, shape: null, phase: 'idle', progress: 0 });

    useEffect(() => { commitCbRef.current = onCommit; }, [onCommit]);
    useEffect(() => { attemptCbRef.current = onAttempt; }, [onAttempt]);

    useEffect(() => {
        let cancelled = false;
        loadHandLandmarker(p => { if (!cancelled) setProgress(p); })
            .then(l => { if (!cancelled) { landmarkerRef.current = l; setModelState('ready'); } })
            .catch(() => { if (!cancelled) setModelState('error'); });
        return () => { cancelled = true; };
    }, []);

    const commit = useCallback((gloss, ts) => {
        setGlosses(g => [...g, gloss]);
        commitCbRef.current?.(gloss);
        // A completed sign ends any struggle in progress.
        shapeHeldSinceRef.current = 0;
        heldShapeRef.current = null;
        attemptFiredRef.current = false;
        phaseRef.current = 'refractory';
        stillSinceRef.current = ts;
        holdShapeRef.current = null;
        strokeShapesRef.current = [];
        motionRef.current.clear();
    }, []);

    const onFrame = useCallback((video, ts) => {
        const recognizer = landmarkerRef.current;
        if (!recognizer || ts - lastRunRef.current < DETECT_INTERVAL) return;
        lastRunRef.current = ts;

        let result;
        try {
            result = recognizer.recognizeForVideo(video, ts);
        } catch (err) {
            // MediaPipe rejects out-of-order timestamps, which is routine and
            // recoverable. Anything else is logged: discarding errors silently
            // once made a broken detector look exactly like an empty frame.
            errorsRef.current += 1;
            if (errorsRef.current <= 3) console.error('[sign-detection] inference failed:', err);
            return;
        }

        const hand = result?.landmarks?.[0];

        if (!hand) {
            phaseRef.current = 'idle';
            strokeShapesRef.current = [];
            holdShapeRef.current = null;
            motionRef.current.clear();
            setLive({ hand: false, shape: null, phase: 'idle', progress: 0, speed: 0 });
            return;
        }

        // Track the palm centre, not a fingertip: far steadier while the
        // fingers are changing shape. Mirror x so directions match the preview.
        const palm = hand[JOINTS.MIDDLE[0]];
        motionRef.current.push(1 - palm.x, palm.y, ts);

        const speed = motionRef.current.speed(ts);
        // Handshape now comes from MediaPipe's trained classifier rather than
        // hand-written templates. handFeatures is still computed for the
        // on-screen readout, which is useful feedback for a learner.
        const gesture = shapeFromGesture(result?.gestures);
        const reading = { ...gesture, features: handFeatures(hand) };
        const shape = gesture.shape ? gesture : null;
        const phase = phaseRef.current;

        // Track how long one recognisable shape has been held. If it never
        // turns into a sign, credit an attempt so the UI can coach it.
        const heldShape = shape?.shape ?? null;
        if (heldShape && heldShape === heldShapeRef.current) {
            if (!attemptFiredRef.current && ts - shapeHeldSinceRef.current >= ATTEMPT_MS) {
                attemptFiredRef.current = true;
                attemptCbRef.current?.(heldShape);
            }
        } else {
            heldShapeRef.current = heldShape;
            shapeHeldSinceRef.current = ts;
            attemptFiredRef.current = false;
        }

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
            speed,
            reading,
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

    return { glosses, live, modelState, progress, onFrame, reset, undo, pushGloss, STROKE_START };
}

/**
 * Most frequent shape across a stroke — steadier than any single frame.
 * Returns null unless that shape held a clear majority: a stroke whose shape
 * flickered between templates is exactly the ambiguous case that produces
 * confident, wrong signs.
 */
function modalShape(shapes) {
    if (!shapes.length) return null;
    const counts = new Map();
    for (const s of shapes) counts.set(s, (counts.get(s) ?? 0) + 1);
    const [top, count] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return count / shapes.length >= 0.6 ? top : null;
}
