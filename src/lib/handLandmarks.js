import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

/**
 * Wraps MediaPipe's pre-trained HandLandmarker.
 * Assets are served from /public (copied + downloaded by scripts/setup-models.mjs)
 * so detection works offline and does not depend on a CDN at demo time.
 */
let landmarkerPromise = null;

/** Which delegate actually got used — 'GPU' is ~1s to init, 'CPU' ~15s. */
export let activeDelegate = null;

const OPTIONS = (delegate) => ({
    baseOptions: { modelAssetPath: '/models/hand_landmarker.task', delegate },
    runningMode: 'VIDEO',
    numHands: 1,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

export function loadHandLandmarker() {
    if (landmarkerPromise) return landmarkerPromise;

    landmarkerPromise = (async () => {
        const fileset = await FilesetResolver.forVisionTasks('/mediapipe/wasm');

        // The GPU delegate initialises in about a second; the CPU path takes
        // roughly fifteen. Always try GPU, but fall back rather than fail.
        try {
            const l = await HandLandmarker.createFromOptions(fileset, OPTIONS('GPU'));
            activeDelegate = 'GPU';
            return l;
        } catch {
            const l = await HandLandmarker.createFromOptions(fileset, OPTIONS('CPU'));
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
