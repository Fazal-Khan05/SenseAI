import { handFeatures } from './handFeatures';

/**
 * Classifies a hand pose into a named shape.
 *
 * Shape alone cannot identify a word sign — THANK-YOU and PLEASE are both a
 * flat hand, separated only by movement. Shape is one half of the signature;
 * motionTracker.js supplies the other.
 */

// [thumb, index, middle, ring, pinky] extension, plus tip-gap features
const SHAPES = [
    { shape: 'FLAT', ext: [0.6, 1.0, 1.0, 1.0, 1.0], thumbIndex: 0.75, indexMiddle: 0.22 },
    { shape: 'FIST', ext: [0.3, 0.0, 0.0, 0.0, 0.0], thumbIndex: 0.45, indexMiddle: 0.22 },
    { shape: 'POINT', ext: [0.3, 1.0, 0.0, 0.0, 0.0], thumbIndex: 0.5, indexMiddle: 0.6 },
    { shape: 'VEE', ext: [0.2, 1.0, 1.0, 0.0, 0.0], thumbIndex: 0.6, indexMiddle: 0.6 },
    { shape: 'ILY', ext: [1.0, 1.0, 0.0, 0.0, 1.0], thumbIndex: 0.95, indexMiddle: 0.6 },
    { shape: 'THUMB_UP', ext: [1.0, 0.0, 0.0, 0.0, 0.0], thumbIndex: 0.7, indexMiddle: 0.22 },
    { shape: 'OPEN', ext: [1.0, 1.0, 1.0, 1.0, 1.0], thumbIndex: 1.1, indexMiddle: 0.4 },
];

const W_EXT = 1.0;
const W_GAP = 0.7;
const REJECT_ABOVE = 0.7;

export function classifyShape(landmarks) {
    const f = handFeatures(landmarks);

    let best = null, bestD = Infinity, runnerUp = Infinity;

    for (const t of SHAPES) {
        let sum = 0;
        for (let i = 0; i < 5; i++) sum += W_EXT * (f.extension[i] - t.ext[i]) ** 2;
        sum += W_GAP * (f.thumbIndex - t.thumbIndex) ** 2;
        sum += W_GAP * (f.indexMiddle - t.indexMiddle) ** 2;
        const d = Math.sqrt(sum);
        if (d < bestD) { runnerUp = bestD; bestD = d; best = t; }
        else if (d < runnerUp) runnerUp = d;
    }

    if (!best || bestD > REJECT_ABOVE) return null;

    const fit = 1 - bestD / REJECT_ABOVE;
    const margin = runnerUp === Infinity ? 1 : Math.min(1, (runnerUp - bestD) / REJECT_ABOVE);
    return { shape: best.shape, confidence: 0.6 * fit + 0.4 * margin };
}

export const SHAPE_NAMES = SHAPES.map(s => s.shape);
