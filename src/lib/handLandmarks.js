import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';
import { fetchWithProgress, preloadIntoCache } from './fetchWithProgress';

const WASM_URL = '/mediapipe/wasm/vision_wasm_internal.wasm';
const MODEL_URL = '/models/gesture_recognizer.task';

// Rough share of the total bytes, used to blend two downloads into one bar.
const WASM_SHARE = 0.6;

/**
 * Wraps MediaPipe's pre-trained GestureRecognizer.
 *
 * This model returns hand landmarks AND a trained handshape classification in
 * one pass. The handshape half replaces hand-written templates whose values
 * were guessed rather than measured, and which overlapped badly enough that
 * shapes swapped at random.
 * Assets are served from /public (copied + downloaded by scripts/setup-models.mjs)
 * so detection works offline and does not depend on a CDN at demo time.
 */
let landmarkerPromise = null;

/** Which delegate actually got used — 'GPU' is ~1s to init, 'CPU' ~15s. */
export let activeDelegate = null;

const OPTIONS = (delegate, modelAssetBuffer) => ({
    baseOptions: { modelAssetBuffer, delegate },
    runningMode: 'VIDEO',
    numHands: 1,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

export function loadHandLandmarker(onProgress) {
    if (landmarkerPromise) return landmarkerPromise;

    landmarkerPromise = (async () => {
        // Pull both assets ourselves so the download has a real percentage.
        // FilesetResolver then finds the wasm already in the HTTP cache, and
        // the model is handed over as a buffer instead of being re-fetched.
        await preloadIntoCache(WASM_URL, (p) => onProgress?.(p * WASM_SHARE));
        const modelBuffer = await fetchWithProgress(MODEL_URL,
            (p) => onProgress?.(WASM_SHARE + p * (1 - WASM_SHARE)));
        onProgress?.(1);

        const fileset = await FilesetResolver.forVisionTasks('/mediapipe/wasm');

        // The GPU delegate initialises in about a second; the CPU path takes
        // roughly fifteen. Always try GPU, but fall back rather than fail.
        try {
            const l = await GestureRecognizer.createFromOptions(fileset, OPTIONS('GPU', new Uint8Array(modelBuffer)));
            activeDelegate = 'GPU';
            return l;
        } catch {
            const l = await GestureRecognizer.createFromOptions(fileset, OPTIONS('CPU', new Uint8Array(modelBuffer)));
            activeDelegate = 'CPU';
            return l;
        }
    })().catch((err) => {
        landmarkerPromise = null;   // allow a retry after a transient failure
        throw err;
    });

    return landmarkerPromise;
}

/** Warm the model before the user reaches the page (called on hover/idle). */
export function prefetchHandLandmarker() {
    loadHandLandmarker().catch(() => { /* prefetch is best-effort */ });
}

export { JOINTS, FINGERS } from './handJoints';
