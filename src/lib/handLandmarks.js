import '@tensorflow/tfjs';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import { fetchWithProgress } from './fetchWithProgress';

export { JOINTS, FINGERS } from './handJoints';

/**
 * Hand tracking via MediaPipe Hands on the TensorFlow.js runtime.
 *
 * The MediaPipe WASM build was replaced with this: it needed an 11.2MB WASM
 * runtime plus a 7.5MB model, against 3.9MB of weights here, and it reuses the
 * TensorFlow.js already loaded for object detection. Same 21-keypoint output,
 * so everything downstream is unchanged.
 *
 * Models are served from /public (mirrored by scripts/setup-models.mjs), so
 * there are no runtime network calls and it works offline.
 */

const DETECTOR_URL = '/models/hand-detector/model.json';
const LANDMARK_URL = '/models/hand-landmark/model.json';

// Weight shards, pulled first so the download reports real progress; TFJS then
// finds them in the HTTP cache. Shares are the two files' relative sizes.
const WEIGHTS = [
    { url: '/models/hand-detector/group1-shard1of1.bin', share: 0.49 },
    { url: '/models/hand-landmark/group1-shard1of1.bin', share: 0.51 },
];

let detectorPromise = null;

/** Which backend TFJS settled on — 'webgl' is fast, 'cpu' is not. */
export let activeBackend = null;

export function loadHandLandmarker(onProgress) {
    if (detectorPromise) return detectorPromise;

    detectorPromise = (async () => {
        let done = 0;
        for (const { url, share } of WEIGHTS) {
            await fetchWithProgress(url, p => onProgress?.(done + p * share));
            done += share;
        }
        onProgress?.(1);

        const detector = await handPoseDetection.createDetector(
            handPoseDetection.SupportedModels.MediaPipeHands,
            {
                runtime: 'tfjs',
                modelType: 'lite',
                maxHands: 1,
                detectorModelUrl: DETECTOR_URL,
                landmarkModelUrl: LANDMARK_URL,
            }
        );

        const tf = await import('@tensorflow/tfjs');
        activeBackend = tf.getBackend();

        // TensorFlow.js compiles its WebGL shaders on the first inference,
        // which costs seconds. Spend that here, behind the loading indicator,
        // rather than stalling the user's first camera frame.
        await warmUp(detector);

        return detector;
    })().catch((err) => {
        detectorPromise = null;   // allow a retry after a transient failure
        throw err;
    });

    return detectorPromise;
}

/** Runs one throwaway inference so shader compilation happens during load. */
async function warmUp(detector) {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await detector.estimateHands(canvas, { flipHorizontal: false });
    } catch { /* warm-up is best-effort; a failure here is not fatal */ }
}

/**
 * Runs the detector and returns 21 landmarks in normalised frame space
 * (0..1), matching what the rest of the pipeline expects.
 */
export async function detectHand(detector, video) {
    const hands = await detector.estimateHands(video, { flipHorizontal: false });
    const hand = hands?.[0];
    if (!hand?.keypoints?.length) return null;

    const w = video.videoWidth || 1;
    const h = video.videoHeight || 1;
    return hand.keypoints.map(k => ({ x: k.x / w, y: k.y / h }));
}

/** Warm the model before the user reaches the page. */
export function prefetchHandLandmarker() {
    loadHandLandmarker().catch(() => { /* prefetch is best-effort */ });
}
