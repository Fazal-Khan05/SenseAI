/**
 * Fetches a URL while reporting download progress.
 *
 * The model payload is ~19MB on a first visit. An indeterminate "Loading…"
 * for twenty seconds reads as a hung page, so every large asset is pulled
 * through here and the real percentage is shown.
 *
 * Hosts that compress these responses (Vercel sends brotli) omit
 * Content-Length, which would leave the bar with nothing to divide by. The
 * sizes recorded at build time in /models/sizes.json cover that case: fetch()
 * decompresses transparently, so the uncompressed size is the right
 * denominator for the bytes actually arriving.
 */
let sizeTable = null;

async function expectedSize(url) {
    if (sizeTable === null) {
        try {
            const res = await fetch('/models/sizes.json');
            sizeTable = res.ok ? await res.json() : {};
        } catch { sizeTable = {}; }
    }
    return sizeTable[url] ?? 0;
}

export async function fetchWithProgress(url, onProgress) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status} ${res.statusText}`);

    const total = Number(res.headers.get('content-length')) || await expectedSize(url);

    if (!res.body || !total) {
        const buf = await res.arrayBuffer();
        onProgress?.(1, buf.byteLength, buf.byteLength);
        return buf;
    }

    const reader = res.body.getReader();
    const chunks = [];
    let loaded = 0;

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        onProgress?.(Math.min(1, loaded / total), loaded, total);
    }

    const out = new Uint8Array(loaded);
    let offset = 0;
    for (const c of chunks) { out.set(c, offset); offset += c.length; }
    return out.buffer;
}

/** Warm the HTTP cache for a URL, reporting progress. */
export async function preloadIntoCache(url, onProgress) {
    await fetchWithProgress(url, onProgress);
}
