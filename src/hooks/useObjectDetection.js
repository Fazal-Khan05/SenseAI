import { useCallback, useEffect, useRef, useState } from 'react';
import '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const MIN_SCORE = 0.55;
const INTERVAL_MS = 100;          // ~10 inferences/sec; the model is the bottleneck, not the camera
const PALETTE = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)', 'var(--warning)'];

// Stable colour per class so a given object keeps its colour across frames.
const colorFor = (name) => {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return PALETTE[h % PALETTE.length];
};

/**
 * Runs COCO-SSD (pre-trained, 80 classes) over camera frames.
 *
 * `onSceneChange(count)` fires when the *set* of visible classes changes, so
 * callers can log real events instead of every frame.
 *
 * `latestRef` always holds the newest list — use it for per-frame drawing,
 * where reading React state would lag a frame behind.
 */
export function useObjectDetection(onSceneChange) {
    const modelRef = useRef(null);
    const busyRef = useRef(false);
    const lastRunRef = useRef(0);
    const latestRef = useRef([]);
    const sceneKeyRef = useRef('');
    const sceneCbRef = useRef(onSceneChange);
    const [objects, setObjects] = useState([]);
    const [modelState, setModelState] = useState('loading');

    useEffect(() => { sceneCbRef.current = onSceneChange; }, [onSceneChange]);

    useEffect(() => {
        let cancelled = false;
        // Served from /public (mirrored by scripts/setup-models.mjs) instead of
        // Google's CDN: 13 fewer round-trips, and it works offline.
        cocoSsd.load({ modelUrl: '/models/coco-ssd/model.json' })
            .then(m => { if (!cancelled) { modelRef.current = m; setModelState('ready'); } })
            .catch(() => { if (!cancelled) setModelState('error'); });
        return () => { cancelled = true; };
    }, []);

    const onFrame = useCallback(async (video, ts) => {
        const model = modelRef.current;
        if (!model || busyRef.current || ts - lastRunRef.current < INTERVAL_MS) return;

        busyRef.current = true;
        lastRunRef.current = ts;
        try {
            const raw = await model.detect(video);
            const next = raw
                .filter(p => p.score >= MIN_SCORE)
                .map(p => ({
                    id: `${p.class}-${Math.round(p.bbox[0])}-${Math.round(p.bbox[1])}`,
                    name: p.class.replace(/\b\w/g, c => c.toUpperCase()),
                    confidence: +(p.score * 100).toFixed(1),
                    bbox: p.bbox,
                    color: colorFor(p.class),
                }));

            latestRef.current = next;
            setObjects(next);

            const key = next.map(o => o.name).sort().join('|');
            if (key && key !== sceneKeyRef.current) {
                sceneKeyRef.current = key;
                sceneCbRef.current?.(next.length);
            }
        } catch { /* a dropped frame is not worth surfacing */ }
        finally { busyRef.current = false; }
    }, []);

    const reset = useCallback(() => {
        latestRef.current = [];
        sceneKeyRef.current = '';
        setObjects([]);
    }, []);

    return { objects, latestRef, modelState, onFrame, reset };
}
