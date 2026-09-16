/**
 * Tracks hand movement and segments it into discrete gesture strokes.
 *
 * Classifying every frame continuously does not work: holding still after a
 * sign looks like a static sign, and returning your hand to rest looks like a
 * sign in the opposite direction. One deliberate THANK-YOU would emit
 * THANK-YOU, then STOP, then GOOD.
 *
 * So movement is segmented by speed — a stroke starts when the hand
 * accelerates and ends when it settles — and only the completed stroke is
 * classified, exactly once.
 *
 * Coordinates are normalised frame space (0..1), so results are resolution
 * independent. The caller mirrors x before pushing, so 'left'/'right' mean
 * what the signer sees.
 */

const TRAIL_MS = 3000;
const SPEED_WINDOW_MS = 160;

const STATIC_PATH = 0.08;
const LINEAR_RATIO = 0.62;
const MIN_WINDING = 3.2;

export function createMotionTracker() {
    let trail = [];

    const since = (t0) => trail.filter(p => p.t >= t0);

    function classifyPoints(pts) {
        if (pts.length < 6) return { type: 'static', direction: null, magnitude: 0 };

        let path = 0;
        for (let i = 1; i < pts.length; i++) {
            path += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        }

        const dx = pts[pts.length - 1].x - pts[0].x;
        const dy = pts[pts.length - 1].y - pts[0].y;
        const displacement = Math.hypot(dx, dy);

        if (path < STATIC_PATH) return { type: 'static', direction: null, magnitude: path };

        if (displacement / path > LINEAR_RATIO) {
            const direction = Math.abs(dx) > Math.abs(dy)
                ? (dx > 0 ? 'right' : 'left')
                : (dy > 0 ? 'down' : 'up');
            return { type: 'linear', direction, magnitude: displacement };
        }

        // Travelled far but ended near the start: circular or back-and-forth.
        // Accumulated signed turn separates them — a circle keeps turning the
        // same way, an oscillation reverses.
        let winding = 0;
        for (let i = 2; i < pts.length; i++) {
            const ax = pts[i - 1].x - pts[i - 2].x, ay = pts[i - 1].y - pts[i - 2].y;
            const bx = pts[i].x - pts[i - 1].x, by = pts[i].y - pts[i - 1].y;
            const cross = ax * by - ay * bx;
            const dot = ax * bx + ay * by;
            if (ax || ay || bx || by) winding += Math.atan2(cross, dot);
        }

        if (Math.abs(winding) >= MIN_WINDING) {
            return { type: 'circular', direction: null, magnitude: path };
        }

        const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
        const spanX = Math.max(...xs) - Math.min(...xs);
        const spanY = Math.max(...ys) - Math.min(...ys);
        return { type: 'oscillate', direction: spanY > spanX ? 'vertical' : 'horizontal', magnitude: path };
    }

    return {
        push(x, y, t) {
            trail.push({ x, y, t });
            const cutoff = t - TRAIL_MS;
            while (trail.length && trail[0].t < cutoff) trail.shift();
        },

        clear() { trail = []; },

        get samples() { return trail.length; },

        /** Recent speed in normalised units per second. */
        speed(now) {
            const recent = since((now ?? trail.at(-1)?.t ?? 0) - SPEED_WINDOW_MS);
            if (recent.length < 2) return 0;
            let path = 0;
            for (let i = 1; i < recent.length; i++) {
                path += Math.hypot(recent[i].x - recent[i - 1].x, recent[i].y - recent[i - 1].y);
            }
            const dt = (recent.at(-1).t - recent[0].t) / 1000;
            return dt > 0 ? path / dt : 0;
        },

        /** Classify only the samples recorded since `t0` (one stroke). */
        classifySince(t0) { return classifyPoints(since(t0)); },

        /** Classify the whole retained trail. */
        classify() { return classifyPoints(trail); },

        pathSince(t0) {
            const pts = since(t0);
            let path = 0;
            for (let i = 1; i < pts.length; i++) {
                path += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
            }
            return path;
        },
    };
}
