/**
 * Maps MediaPipe's trained gesture labels onto the handshapes this app signs with.
 *
 * These were previously hand-written templates in a 7-dimensional feature
 * space, with values guessed from anatomy rather than measured. Two of them
 * (FLAT/OPEN) sat closer together than the reject threshold, so an open hand
 * landed on either at random and signs swapped constantly.
 *
 * MediaPipe's canned gesture classifier is trained on exactly these shapes, so
 * the templates are gone and this is now a lookup.
 */
const GESTURE_TO_SHAPE = {
    Open_Palm: 'FLAT',
    Closed_Fist: 'FIST',
    Pointing_Up: 'POINT',
    Victory: 'VEE',
    ILoveYou: 'ILY',
    // Thumb_Up, Thumb_Down and None intentionally map to nothing: no sign in
    // the vocabulary uses them, and mapping them would invent matches.
};

/** Below this the classifier is not confident enough to act on. */
const MIN_SCORE = 0.5;

export const SHAPE_NAMES = [...new Set(Object.values(GESTURE_TO_SHAPE))];

/**
 * `gestures` is the GestureRecognizerResult's per-hand category list.
 * Returns the mapped shape plus the raw label, so the readout can show what
 * the model actually said even when it maps to nothing.
 */
export function shapeFromGesture(gestures) {
    const top = gestures?.[0]?.[0];
    if (!top) return { shape: null, confidence: 0, gesture: null, score: 0 };

    const shape = GESTURE_TO_SHAPE[top.categoryName] ?? null;
    const score = top.score ?? 0;

    return {
        shape: score >= MIN_SCORE ? shape : null,
        confidence: shape ? score : 0,
        gesture: top.categoryName,
        score,
    };
}
