import { JOINTS, FINGERS } from './handJoints';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Interior angle at `b` for the chain a-b-c, in radians. */
function angleAt(a, b, c) {
    const v1x = a.x - b.x, v1y = a.y - b.y;
    const v2x = c.x - b.x, v2y = c.y - b.y;
    const dot = v1x * v2x + v1y * v2y;
    const mag = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y);
    if (!mag) return Math.PI;
    return Math.acos(Math.max(-1, Math.min(1, dot / mag)));
}

/**
 * Scale-and-rotation tolerant descriptor of a hand pose.
 *
 * - `extension[i]`  0 = fully curled, 1 = straight, per finger
 * - `thumbIndex`    thumb-tip to index-tip gap, in palm widths
 * - `indexMiddle`   spread between index and middle tips, in palm widths
 *
 * Everything is divided by palm size so it does not matter how close to the
 * camera the hand is.
 */
export function handFeatures(landmarks) {
    const wrist = landmarks[JOINTS.WRIST];
    const palm = dist(wrist, landmarks[JOINTS.MIDDLE[0]]) || 1;

    const extension = FINGERS.map((name) => {
        const [mcp, pip, dip, tip] = JOINTS[name];
        // Average the two joint angles so a single noisy joint cannot flip the reading.
        const a = (angleAt(landmarks[mcp], landmarks[pip], landmarks[tip])
            + angleAt(landmarks[pip], landmarks[dip], landmarks[tip])) / 2;
        // ~100deg (curled) .. ~175deg (straight) mapped onto 0..1
        return clamp01((a - 1.75) / (3.05 - 1.75));
    });

    return {
        extension,
        thumbIndex: dist(landmarks[JOINTS.THUMB[3]], landmarks[JOINTS.INDEX[3]]) / palm,
        indexMiddle: dist(landmarks[JOINTS.INDEX[3]], landmarks[JOINTS.MIDDLE[3]]) / palm,
    };
}

const clamp01 = (n) => Math.max(0, Math.min(1, n));

/**
 * Flat 42-float vector (wrist-centred, palm-scaled) for the trained model.
 * Training and inference must use this same function or the model will see
 * a different input distribution than it was fitted on.
 */
export function normalizeLandmarks(landmarks) {
    const wrist = landmarks[JOINTS.WRIST];
    const palm = dist(wrist, landmarks[JOINTS.MIDDLE[0]]) || 1;
    const out = new Float32Array(42);
    for (let i = 0; i < 21; i++) {
        out[i * 2] = (landmarks[i].x - wrist.x) / palm;
        out[i * 2 + 1] = (landmarks[i].y - wrist.y) / palm;
    }
    return out;
}
