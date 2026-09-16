/**
 * Downloads the hand-pose and object-detection models into public/. They are
 * large binaries, so they are gitignored and fetched on install rather than
 * committed.
 *
 * Runs automatically via `postinstall`; re-run with `npm run setup:models`.
 */
import { mkdir, access, writeFile, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

// The package blocks deep `exports` access, so resolve the folder directly.

const MODEL_DEST = path.join(root, 'public/models');

// MediaPipe Hands, TFJS runtime, "lite" weights. Mirrored locally so the app
// makes no runtime network calls and works offline.
// These replaced the MediaPipe WASM build: 4.1MB of weights instead of an
// 11.2MB WASM runtime plus a 7.5MB .task model.
// "full" rather than "lite": the lite detector missed hands outright in
// testing. Recall matters more here than the extra few MB.
const HAND_MODELS = [
    { name: 'hand-detector', url: 'https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1' },
    { name: 'hand-landmark', url: 'https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1' },
];

// COCO-SSD normally streams its weights from Google's CDN on every page load
// (13 requests). Mirroring them locally makes object detection start faster
// and work with no network at all.
const COCO_BASE = 'https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2';
const COCO_DEST = path.join(root, 'public/models/coco-ssd');

const exists = (p) => access(p).then(() => true, () => false);

/** Downloads a TFJS graph model (model.json plus its weight shards). */
async function fetchTfjsModel({ name, url }) {
    const dir = path.join(MODEL_DEST, name);
    await mkdir(dir, { recursive: true });

    const manifestPath = path.join(dir, 'model.json');
    let manifest;

    if (await exists(manifestPath)) {
        manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
        console.log('  hand  ', `${name}/model.json (cached)`);
    } else {
        const res = await fetch(`${url}/model.json?tfjs-format=file`);
        if (!res.ok) throw new Error(`${name} model.json: ${res.status}`);
        manifest = await res.json();
        await writeFile(manifestPath, JSON.stringify(manifest));
        console.log('  hand  ', `${name}/model.json`);
    }

    for (const shard of (manifest.weightsManifest || []).flatMap(w => w.paths)) {
        const dest = path.join(dir, shard);
        if (await exists(dest)) { console.log('  hand  ', `${name}/${shard} (cached)`); continue; }
        const res = await fetch(`${url}/${shard}?tfjs-format=file`);
        if (!res.ok) throw new Error(`${name}/${shard}: ${res.status}`);
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
        console.log('  hand  ', `${name}/${shard}`);
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
    const sizes = {};
    for (const { name } of HAND_MODELS) {
        const dir = path.join(MODEL_DEST, name);
        const manifest = JSON.parse(await readFile(path.join(dir, 'model.json'), 'utf8'));
        for (const shard of (manifest.weightsManifest || []).flatMap(w => w.paths)) {
            sizes[`/models/${name}/${shard}`] = (await stat(path.join(dir, shard))).size;
        }
    }
    await writeFile(path.join(MODEL_DEST, 'sizes.json'), JSON.stringify(sizes, null, 2));
    console.log('  sizes  sizes.json');
}

try {
    await mkdir(MODEL_DEST, { recursive: true });
    for (const m of HAND_MODELS) await fetchTfjsModel(m);
    await fetchCocoSsd();
    await writeManifest();
    console.log('Model assets ready.');
} catch (err) {
    console.error('\nsetup-models failed:', err.message);
    console.error('The app will not detect anything until this succeeds. Re-run: npm run setup:models\n');
    process.exitCode = 1;
}
