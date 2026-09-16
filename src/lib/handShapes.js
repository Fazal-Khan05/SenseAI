import { handFeatures } from './handFeatures';

/**
 * Classifies a hand pose into a named shape.
 *
 * Shape alone cannot identify a word sign — THANK-YOU and PLEASE are both a
 * flat hand, separated only by movement. Shape is one half of the signature;
 * motionTracker.js supplies the other.
 *
 * The template set is deliberately small. An earlier version carried seven
 * shapes, but FLAT and OPEN sat 0.52 apart against a 0.70 reject cutoff, so an
 * open hand landed on either at random and HELLO/GOODBYE swapped constantly.
 * Every pair below is now separated by at least one whole finger.
 */

// [thumb, index, middle, ring, pinky] extension, plus the two tip gaps.
const SHAPES = [
    { shape: 'FLAT', ext: [0.5, 1.0, 1.0, 1.0, 1.0], thumbIndex: 0.75, indexMiddle: 0.25 },
    { shape: 'FIST', ext: [0.2, 0.0, 0.0, 0.0, 0.0], thumbIndex: 0.45, indexMiddle: 0.20 },
    { shape: 'POINT', ext: [0.2, 1.0, 0.0, 0.0, 0.0], thumbIndex: 0.50, indexMiddle: 0.55 },
    { shape: 'VEE', ext: [0.2, 1.0, 1.0, 0.0, 0.0], thumbIndex: 0.60, indexMiddle: 0.60 },
    { shape: 'ILY', ext: [1.0, 1.0, 0.0, 0.0, 1.0], thumbIndex: 0.95, indexMiddle: 0.55 },
];

// The thumb's landmarks are the noisiest and it is the least reliable
// discriminator, so it carries less weight than the fingers. The tip gaps are
// a tie-breaker only: the four finger extensions already separate every shape.
const W_FINGER = 1.0;
const W_THUMB = 0.35;
const W_GAP = 0.15;

const REJECT_ABOVE = 0.75;

// An ambiguous reading is worse than no reading: a wrong sign silently
// corrupts the sentence. Require the best match to beat the next by a margin.
const MIN_MARGIN = 0.18;

export function classifyShape(landmarks) {
    const f = handFeatures(landmarks);

    const scored = SHAPES.map(t => {
        let sum = W_THUMB * (f.extension[0] - t.ext[0]) ** 2;
        for (let i = 1; i < 5; i++) sum += W_FINGER * (f.extension[i] - t.ext[i]) ** 2;
        sum += W_GAP * (f.thumbIndex - t.thumbIndex) ** 2;
        sum += W_GAP * (f.indexMiddle - t.indexMiddle) ** 2;
        return { shape: t.shape, distance: Math.sqrt(sum) };
    }).sort((a, b) => a.distance - b.distance);

    const [best, next] = scored;
    const margin = next ? next.distance - best.distance : Infinity;

    // Reported even on a reject, so the UI can show what was measured.
    const detail = {
        features: f,
        nearest: best.shape,
        distance: best.distance,
        runnerUp: next?.shape ?? null,
        runnerUpDistance: next?.distance ?? null,
    };

    if (best.distance > REJECT_ABOVE || margin < MIN_MARGIN) {
        return { shape: null, confidence: 0, ...detail };
    }

    const fit = 1 - best.distance / REJECT_ABOVE;
    const clarity = Math.min(1, margin / REJECT_ABOVE);
    return { shape: best.shape, confidence: 0.6 * fit + 0.4 * clarity, ...detail };
}

export const SHAPE_NAMES = SHAPES.map(s => s.shape);
