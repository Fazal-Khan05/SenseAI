/**
 * Fetches a URL while reporting download progress.
 *
 * The model payload is ~19MB on a first visit. An indeterminate "Loading…"
 * for twenty seconds reads as a hung page, so every large asset is pulled
 * through here and the real percentage is shown.
 *
 * Falls back to a plain fetch when the response is not streamable or has no
 * declared length (some proxies drop Content-Length on compressed responses).
 */
export async function fetchWithProgress(url, onProgress) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status} ${res.statusText}`);

    const total = Number(res.headers.get('content-length')) || 0;

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
