/**
 * Paints detection boxes onto the overlay canvas.
 * The canvas is CSS-mirrored to match the video, so labels are drawn
 * un-mirrored via a local transform to stay readable.
 */
export function drawBoxes(canvas, video, objects) {
    if (!canvas || !video?.videoWidth) return;
    const { videoWidth: w, videoHeight: h } = video;
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, w, h);

    const css = getComputedStyle(document.documentElement);
    const resolve = (c) => c.startsWith('var(')
        ? css.getPropertyValue(c.slice(4, -1)).trim() || '#4F9CF9'
        : c;

    ctx.lineWidth = 2;
    ctx.font = '600 14px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'bottom';

    for (const o of objects) {
        const [x, y, bw, bh] = o.bbox;
        const color = resolve(o.color);

        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, bw, bh);

        const label = `${o.name} ${o.confidence}%`;
        ctx.save();
        ctx.translate(x + bw, y);       // flip the label back the right way round
        ctx.scale(-1, 1);
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = color;
        ctx.fillRect(0, -22, tw + 12, 22);
        ctx.fillStyle = '#fff';
        ctx.fillText(label, 6, -4);
        ctx.restore();
    }
}
