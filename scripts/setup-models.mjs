/**
 * Copies the MediaPipe WASM runtime out of node_modules and downloads the
 * hand-landmark model into public/. Both are large binaries, so they are
 * gitignored and fetched on install instead of being committed.
 *
 * Runs automatically via `postinstall`; re-run with `npm run setup:models`.
 */
import { mkdir, copyFile, access, writeFile, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

// The package blocks deep `exports` access, so resolve the folder directly.
const WASM_SRC = path.join(root, 'node_modules/@mediapipe/tasks-vision/wasm');
const WASM_DEST = path.join(root, 'public/mediapipe/wasm');

// Only the SIMD build is needed; the nosimd fallback doubles the payload.
const WASM_FILES = ['vision_wasm_internal.js', 'vision_wasm_internal.wasm'];

const MODELS = [
    {
        file: 'hand_landmarker.task',
        url: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
    },
];
const MODEL_DEST = path.join(root, 'public/models');

// COCO-SSD normally streams its weights from Google's CDN on every page load
// (13 requests). Mirroring them locally makes object detection start faster
// and work with no network at all.
const COCO_BASE = 'https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2';
const COCO_DEST = path.join(root, 'public/models/coco-ssd');

const exists = (p) => access(p).then(() => true, () => false);

async function copyWasm() {
    await mkdir(WASM_DEST, { recursive: true });
    for (const f of WASM_FILES) {
        await copyFile(path.join(WASM_SRC, f), path.join(WASM_DEST, f));
        console.log('  wasm  ', f);
    }
}

async function fetchModels() {
    await mkdir(MODEL_DEST, { recursive: true });
    for (const { file, url } of MODELS) {
        const dest = path.join(MODEL_DEST, file);
        if (await exists(dest)) { console.log('  model  ', file, '(cached)'); continue; }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${file}: ${res.status} ${res.statusText}`);
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
        console.log('  model  ', file);
    }
}

async function fetchCocoSsd() {
    await mkdir(COCO_DEST, { recursive: true });

    const manifestPath = path.join(COCO_DEST, 'model.json');
    let manifest;

    if (await exists(manifestPath)) {
        manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
        console.log('  coco   model.json (cached)');
    } else {
        const res = await fetch(`${COCO_BASE}/model.json`);
        if (!res.ok) throw new Error(`coco model.json: ${res.status}`);
        manifest = await res.json();
        await writeFile(manifestPath, JSON.stringify(manifest));
        console.log('  coco   model.json');
    }

    const shards = (manifest.weightsManifest || []).flatMap(w => w.paths);
    for (const shard of shards) {
        const dest = path.join(COCO_DEST, shard);
        if (await exists(dest)) { console.log('  coco  ', shard, '(cached)'); continue; }
        const res = await fetch(`${COCO_BASE}/${shard}`);
        if (!res.ok) throw new Error(`${shard}: ${res.status}`);
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
        console.log('  coco  ', shard);
    }
}

/**
 * Records uncompressed byte sizes. Hosts that serve these compressed (Vercel
 * sends brotli) drop Content-Length, so the browser cannot size the download
 * and a progress bar has nothing to divide by. fetch() decompresses
 * transparently, so these raw sizes are the right denominator.
 */
async function writeManifest() {
    const entries = {
        '/mediapipe/wasm/vision_wasm_internal.wasm': path.join(WASM_DEST, 'vision_wasm_internal.js').replace('.js', '.wasm'),
        '/models/hand_landmarker.task': path.join(MODEL_DEST, 'hand_landmarker.task'),
    };
    const sizes = {};
    for (const [url, file] of Object.entries(entries)) {
        sizes[url] = (await stat(file)).size;
    }
    await writeFile(path.join(MODEL_DEST, 'sizes.json'), JSON.stringify(sizes, null, 2));
    console.log('  sizes  sizes.json');
}

try {
    await copyWasm();
    await fetchModels();
    await fetchCocoSsd();
    await writeManifest();
    console.log('Model assets ready.');
} catch (err) {
    console.error('\nsetup-models failed:', err.message);
    console.error('The app will not detect anything until this succeeds. Re-run: npm run setup:models\n');
    process.exitCode = 1;
}
