import { createMotionTracker } from '../src/lib/motionTracker.js';
import { matchSign } from '../src/lib/wordSigns.js';

/**
 * Replays whole gesture sequences through the same stroke state machine the
 * hook uses, and asserts on the glosses committed. This is the regression test
 * for the "one sign emits three glosses" bug.
 */
const STROKE_START = 0.30, STROKE_END = 0.12, STILL_SPEED = 0.10;
const SETTLE_FRAMES = 5, MIN_STROKE_MS = 180, MIN_STROKE_PATH = 0.10;
const HOLD_MS = 700, REARM_MS = 400, DT = 40;

function run(frames) {
    const m = createMotionTracker();
    const out = [];
    let phase = 'idle', strokeStart = 0, shapes = [], settle = 0;
    let stillSince = 0, holdShape = null, holdSince = 0, ts = 0;

    for (const [x, y, shape] of frames) {
        m.push(x, y, ts);
        const speed = m.speed(ts);
        if (shape) shapes.push(shape);

        if (phase === 'refractory') {
            if (speed > STILL_SPEED) stillSince = ts;
            else if (ts - stillSince >= REARM_MS) phase = 'idle';
        } else if (phase === 'idle') {
            if (speed >= STROKE_START) { phase = 'stroke'; strokeStart = ts; shapes = shape ? [shape] : []; settle = 0; holdShape = null; }
            else if (speed <= STILL_SPEED && shape) {
                if (holdShape !== shape) { holdShape = shape; holdSince = ts; }
                if (ts - holdSince >= HOLD_MS) {
                    const hit = matchSign({ shape, confidence: 1 }, { type: 'static', direction: null });
                    if (hit) { out.push(hit.gloss); phase = 'refractory'; stillSince = ts; holdShape = null; shapes = []; m.clear(); }
                    else holdSince = ts;
                }
            } else holdShape = null;
        } else if (phase === 'stroke') {
            settle = speed <= STROKE_END ? settle + 1 : 0;
            if (settle >= SETTLE_FRAMES) {
                const dur = ts - strokeStart, path = m.pathSince(strokeStart);
                let done = false;
                if (dur >= MIN_STROKE_MS && path >= MIN_STROKE_PATH) {
                    const motion = m.classifySince(strokeStart);
                    const modal = [...shapes.reduce((a, s) => a.set(s, (a.get(s) ?? 0) + 1), new Map())]
                        .sort((a, b) => b[1] - a[1])[0]?.[0];
                    const hit = modal ? matchSign({ shape: modal, confidence: 1 }, motion) : null;
                    if (hit) { out.push(hit.gloss); phase = 'refractory'; stillSince = ts; shapes = []; m.clear(); done = true; }
                }
                if (!done) { phase = 'refractory'; stillSince = ts; shapes = []; }
            }
        }
        ts += DT;
    }
    return out;
}

const hold = (x, y, shape, n) => Array.from({ length: n }, () => [x, y, shape]);
const move = (x0, y0, x1, y1, shape, n) =>
    Array.from({ length: n }, (_, i) => [x0 + (x1 - x0) * (i / (n - 1)), y0 + (y1 - y0) * (i / (n - 1)), shape]);
const circle = (cx, cy, r, shape, n) =>
    Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, shape];
    });
const oscY = (x, cy, amp, shape, n) =>
    Array.from({ length: n }, (_, i) => [x, cy + Math.sin(i * 0.9) * amp, shape]);

const CASES = [
    {
        name: 'THANK-YOU, hold, then hand returns up  (the reported glitch)',
        frames: [...hold(0.5, 0.3, 'FLAT', 12), ...move(0.5, 0.3, 0.5, 0.68, 'FLAT', 12),
                 ...hold(0.5, 0.68, 'FLAT', 20), ...move(0.5, 0.68, 0.5, 0.3, 'FLAT', 12),
                 ...hold(0.5, 0.3, 'FLAT', 12)],
        expect: ['THANK-YOU'],
    },
    {
        name: 'HELLO sweep, then rest',
        frames: [...hold(0.3, 0.4, 'FLAT', 12), ...move(0.3, 0.4, 0.72, 0.4, 'FLAT', 12), ...hold(0.72, 0.4, 'FLAT', 25)],
        expect: ['HELLO'],
    },
    {
        name: 'SORRY (fist circle)',
        frames: [...hold(0.62, 0.5, 'FIST', 12), ...circle(0.5, 0.5, 0.12, 'FIST', 22), ...hold(0.62, 0.5, 'FIST', 25)],
        expect: ['SORRY'],
    },
    {
        name: 'PLEASE (flat circle) — same motion as SORRY, different shape',
        frames: [...hold(0.62, 0.5, 'FLAT', 12), ...circle(0.5, 0.5, 0.12, 'FLAT', 22), ...hold(0.62, 0.5, 'FLAT', 25)],
        expect: ['PLEASE'],
    },
    {
        name: 'I-LOVE-YOU held still',
        frames: [...hold(0.5, 0.5, 'ILY', 30)],
        expect: ['I-LOVE-YOU'],
    },
    {
        name: 'Idle flat hand resting — must emit nothing',
        frames: hold(0.5, 0.5, 'FLAT', 60),
        expect: [],
    },
    {
        name: 'Random drift with no recognisable shape — must emit nothing',
        frames: move(0.4, 0.4, 0.6, 0.45, null, 30),
        expect: [],
    },
    {
        name: 'YES (fist nod)',
        frames: [...hold(0.5, 0.5, 'FIST', 12), ...oscY(0.5, 0.5, 0.1, 'FIST', 22), ...hold(0.5, 0.5, 'FIST', 8)],
        expect: ['YES'],
    },
];

let pass = 0, fail = 0;
for (const c of CASES) {
    const got = run(c.frames);
    const ok = JSON.stringify(got) === JSON.stringify(c.expect);
    ok ? pass++ : fail++;
    console.log(`${ok ? 'ok  ' : 'FAIL'}  ${c.name}`);
    if (!ok) console.log(`        got ${JSON.stringify(got)}  expected ${JSON.stringify(c.expect)}`);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
