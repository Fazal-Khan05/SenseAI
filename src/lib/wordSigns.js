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
 * Two signs were removed after testing on camera, not for lack of effort:
 *   STOP (flat hand, held still) fired on any resting hand.
 *   GOOD (flat hand, upward)     is exactly the return stroke of THANK-YOU.
 * Neither is separable from ordinary hand movement with one hand and no body
 * reference, so they are excluded rather than left firing at random.
 */
export const SIGN_TEMPLATES = [
    // Flat hand — separated entirely by movement.
    { gloss: 'HELLO', shape: 'FLAT', motion: 'linear', direction: 'right', hint: 'Flat hand, sweep sideways (salute outward)' },
    { gloss: 'HELLO', shape: 'FLAT', motion: 'linear', direction: 'left', hint: 'Flat hand, sweep sideways' },
    { gloss: 'THANK-YOU', shape: 'FLAT', motion: 'linear', direction: 'down', hint: 'Flat hand at chin, move down and forward' },
    { gloss: 'PLEASE', shape: 'FLAT', motion: 'circular', direction: null, hint: 'Flat hand, circle on your chest' },

    // Fist — circular vs nodding.
    { gloss: 'SORRY', shape: 'FIST', motion: 'circular', direction: null, hint: 'Fist, circle on your chest' },
    { gloss: 'YES', shape: 'FIST', motion: 'oscillate', direction: 'vertical', hint: 'Fist, nod it up and down' },

    // Distinctive static shapes.
    { gloss: 'I-LOVE-YOU', shape: 'ILY', motion: 'static', direction: null, hint: 'Thumb, index and pinky out — hold still' },
    { gloss: 'ME', shape: 'POINT', motion: 'static', direction: null, hint: 'Point at yourself, hold still' },
    { gloss: 'YOU', shape: 'POINT', motion: 'linear', direction: 'up', hint: 'Point forward (push the point away)' },
    { gloss: 'NO', shape: 'VEE', motion: 'oscillate', direction: 'horizontal', hint: 'Index + middle out, wave side to side' },
    { gloss: 'HELP', shape: 'THUMB_UP', motion: 'linear', direction: 'up', hint: 'Thumb up, lift it upward' },
    { gloss: 'GOODBYE', shape: 'OPEN', motion: 'oscillate', direction: 'horizontal', hint: 'Open hand, wave' },
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
