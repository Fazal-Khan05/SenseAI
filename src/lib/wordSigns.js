/**
 * Word-sign templates: handshape + movement.
 *
 * These signs were chosen because they stay separable without a trained model.
 * Real ASL also uses location relative to the body (forehead vs chin vs chest)
 * and two-handed forms; neither is captured here, so signs that differ ONLY by
 * body location are deliberately excluded rather than guessed at.
 *
 * Each entry: shape + motion type (+ direction where the motion is directional).
 * `null` direction means any direction matches.
 *
 * Signs removed after testing on camera, each for a concrete reason:
 *   STOP     flat hand held still — fired on any resting hand.
 *   GOOD     flat hand upward — exactly the return stroke of THANK-YOU.
 *   GOODBYE  open hand waving — its shape sat 0.52 from FLAT against a 0.70
 *            cutoff, so it swapped with HELLO at random.
 *   HELP     thumb-up — 0.73 from FIST, the same problem.
 *   YOU      pointing forward — only a motion apart from ME, and reaching to
 *            point at yourself reads as that motion.
 * Keeping them made every other sign less reliable. Nine that work beat
 * fourteen that argue with each other.
 */
export const SIGN_TEMPLATES = [
    // Flat hand — separated entirely by movement.
    { gloss: 'HELLO', shape: 'FLAT', motion: 'linear', direction: 'right', hint: 'Flat hand, sweep sideways in one direction' },
    { gloss: 'HELLO', shape: 'FLAT', motion: 'linear', direction: 'left', hint: 'Flat hand, sweep sideways in one direction' },
    { gloss: 'THANK-YOU', shape: 'FLAT', motion: 'linear', direction: 'down', hint: 'Flat hand at chin, move straight down' },
    { gloss: 'PLEASE', shape: 'FLAT', motion: 'circular', direction: null, hint: 'Flat hand, a full circle on your chest (complete the loop)' },

    // Fist — circling versus nodding.
    { gloss: 'SORRY', shape: 'FIST', motion: 'circular', direction: null, hint: 'Fist, a full circle on your chest (complete the loop)' },
    { gloss: 'YES', shape: 'FIST', motion: 'oscillate', direction: 'vertical', hint: 'Fist, nod it up and down' },

    // Distinct shapes, held still or waved.
    { gloss: 'NO', shape: 'VEE', motion: 'oscillate', direction: 'horizontal', hint: 'Index + middle out, wave side to side' },
    { gloss: 'I-LOVE-YOU', shape: 'ILY', motion: 'static', direction: null, hint: 'Thumb, index and pinky out — hold still' },
    { gloss: 'ME', shape: 'POINT', motion: 'static', direction: null, hint: 'Point at yourself, hold still' },
];

/** Deduplicated gloss list, in template order. */
export const SIGN_GLOSSES = [...new Set(SIGN_TEMPLATES.map(t => t.gloss))];

/** One hint per gloss, for the on-screen guide. */
export const SIGN_HINTS = SIGN_GLOSSES.map(
    g => ({ gloss: g, hint: SIGN_TEMPLATES.find(t => t.gloss === g).hint })
);

/**
 * Matches a shape + motion reading against the templates.
 * Returns null when nothing matches — refusing to guess beats emitting the
 * wrong sign, which silently corrupts the sentence.
 */
export function matchSign(shape, motion) {
    if (!shape) return null;

    for (const t of SIGN_TEMPLATES) {
        if (t.shape !== shape.shape) continue;
        if (t.motion !== motion.type) continue;
        if (t.direction && t.direction !== motion.direction) continue;
        return { gloss: t.gloss, confidence: Math.round(shape.confidence * 100) };
    }
    return null;
}
