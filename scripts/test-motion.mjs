import { createMotionTracker } from '../src/lib/motionTracker.js';

const feed = (pts) => {
    const t = createMotionTracker();
    pts.forEach((p, i) => t.push(p[0], p[1], i * 40));
    return t.classify();
};

// Synthetic paths standing in for real gestures.
const still = Array.from({ length: 20 }, () => [0.5, 0.5]);
const jitter = Array.from({ length: 20 }, (_, i) => [0.5 + Math.sin(i) * 0.002, 0.5]);
const sweepRight = Array.from({ length: 20 }, (_, i) => [0.25 + i * 0.02, 0.5]);
const down = Array.from({ length: 20 }, (_, i) => [0.5, 0.25 + i * 0.02]);
const up = Array.from({ length: 20 }, (_, i) => [0.5, 0.75 - i * 0.02]);
const circle = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    return [0.5 + Math.cos(a) * 0.12, 0.5 + Math.sin(a) * 0.12];
});
const nod = Array.from({ length: 20 }, (_, i) => [0.5, 0.5 + Math.sin(i * 0.9) * 0.1]);
const wave = Array.from({ length: 20 }, (_, i) => [0.5 + Math.sin(i * 0.9) * 0.1, 0.5]);

// A partial arc is a curved sweep, not a circle. These read as circular under
// the old winding threshold, which made HELLO come out as PLEASE.
const arc = (deg, n) => Array.from({ length: n }, (_, i) => {
    const a = (i / (n - 1)) * (deg * Math.PI / 180);
    return [0.5 + Math.cos(a) * 0.14, 0.5 + Math.sin(a) * 0.14];
});
const sweepArc = (deg, n) => Array.from({ length: n }, (_, i) => {
    const a = Math.PI - (i / (n - 1)) * (deg * Math.PI / 180);
    return [0.5 + Math.cos(a) * 0.22, 0.45 + Math.sin(a) * 0.10];
});

const CASES = [
    ['held still', still, 'static', null],
    ['tiny jitter', jitter, 'static', null],
    ['sweep right (HELLO)', sweepRight, 'linear', 'right'],
    ['move down (THANK-YOU)', down, 'linear', 'down'],
    ['move up (GOOD/HELP)', up, 'linear', 'up'],
    ['circle (PLEASE/SORRY)', circle, 'circular', null],
    ['vertical nod (YES)', nod, 'oscillate', 'vertical'],
    ['side wave (NO)', wave, 'oscillate', 'horizontal'],

    // Regressions for HELLO being read as PLEASE.
    ['curved sweep 90 (HELLO)', sweepArc(90, 20), 'linear', null],
    ['curved sweep 160 (HELLO)', sweepArc(160, 20), 'linear', null],
    ['arc 200 - NOT a circle', arc(200, 22), 'oscillate', null],
    ['arc 270 - NOT a circle', arc(270, 22), 'oscillate', null],
    ['full circle (PLEASE)', arc(360, 24), 'circular', null],
];

let pass = 0, fail = 0;
for (const [name, pts, type, dir] of CASES) {
    const got = feed(pts);
    const ok = got.type === type && (dir === null || got.direction === dir);
    ok ? pass++ : fail++;
    console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name.padEnd(24)} -> ${got.type}${got.direction ? '/' + got.direction : ''}`
        + (ok ? '' : `   expected ${type}${dir ? '/' + dir : ''}`));
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exitCode = fail ? 1 : 0;
