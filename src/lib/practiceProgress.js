import { SIGN_GLOSSES, SIGN_TEMPLATES } from './wordSigns.js';

/**
 * Tracks which signs a learner can actually produce.
 *
 * Progress is coverage, never a score: the question is *which signs can you
 * make*, not how well you rank. There is no percentage, grade or streak here
 * on purpose.
 *
 * Storage is local so practice survives an offline demo and needs no account.
 * Everything goes through `load`/`save`, so a server-backed store can replace
 * the browser one without touching callers.
 */

const STORAGE_KEY = 'senseai-progress-v1';

export const LANDED_AT = 1;      // committed once: you have produced it
export const CONFIDENT_AT = 3;   // committed three times: it was not luck

/** An attempt is the shape held without the sign ever completing. */
export const STATES = ['untried', 'attempted', 'landed', 'confident'];

export function stateFor(record) {
    if (!record) return 'untried';
    if (record.commits >= CONFIDENT_AT) return 'confident';
    if (record.commits >= LANDED_AT) return 'landed';
    if (record.attempts > 0) return 'attempted';
    return 'untried';
}

export function emptyProgress() {
    return Object.fromEntries(SIGN_GLOSSES.map(g => [g, { commits: 0, attempts: 0, lastAt: null }]));
}

/** Signs that use a given handshape — used to credit an attempt. */
const SHAPE_TO_GLOSSES = SIGN_TEMPLATES.reduce((acc, t) => {
    (acc[t.shape] ??= new Set()).add(t.gloss);
    return acc;
}, {});

export function glossesForShape(shape) {
    return [...(SHAPE_TO_GLOSSES[shape] ?? [])];
}

export function recordCommit(progress, gloss, now = Date.now()) {
    const prev = progress[gloss] ?? { commits: 0, attempts: 0, lastAt: null };
    return { ...progress, [gloss]: { ...prev, commits: prev.commits + 1, lastAt: now } };
}

/**
 * Credit an attempt to every sign that uses this handshape. In free practice
 * the app cannot know which sign was intended, but holding a flat hand without
 * completing anything means HELLO, THANK-YOU and PLEASE were all plausibly
 * being tried — and all three deserve a coaching nudge.
 */
export function recordAttempt(progress, shape, now = Date.now()) {
    const glosses = glossesForShape(shape);
    if (!glosses.length) return progress;

    const next = { ...progress };
    for (const g of glosses) {
        const prev = next[g] ?? { commits: 0, attempts: 0, lastAt: null };
        if (prev.commits >= LANDED_AT) continue;   // already produced; not a struggle
        next[g] = { ...prev, attempts: prev.attempts + 1, lastAt: now };
    }
    return next;
}

export function summarise(progress) {
    const entries = SIGN_GLOSSES.map(g => ({ gloss: g, state: stateFor(progress[g]), ...progress[g] }));
    return {
        entries,
        total: SIGN_GLOSSES.length,
        landed: entries.filter(e => e.state === 'landed' || e.state === 'confident').length,
        confident: entries.filter(e => e.state === 'confident').length,
        /** Struggling with it: tried repeatedly, never produced. */
        stuck: entries.filter(e => e.state === 'attempted' && e.attempts >= 3).map(e => e.gloss),
        /** What to suggest next: never attempted at all. */
        untried: entries.filter(e => e.state === 'untried').map(e => e.gloss),
        complete: entries.every(e => e.state === 'confident'),
    };
}

export function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return emptyProgress();
        const parsed = JSON.parse(raw);
        // Merge onto the current vocabulary so a changed sign list cannot
        // strand old keys or leave new signs missing.
        return { ...emptyProgress(), ...pickKnown(parsed) };
    } catch {
        return emptyProgress();
    }
}

export function save(progress) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch { /* private mode or blocked storage: practice still works this session */ }
}

export function clear() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* nothing to recover */ }
}

function pickKnown(parsed) {
    if (!parsed || typeof parsed !== 'object') return {};
    const out = {};
    for (const g of SIGN_GLOSSES) {
        const r = parsed[g];
        if (r && typeof r.commits === 'number' && typeof r.attempts === 'number') out[g] = r;
    }
    return out;
}
