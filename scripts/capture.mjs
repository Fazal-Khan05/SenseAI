/**
 * Screenshot capture with real device emulation, over the Chrome DevTools
 * Protocol. Plain `--headless --window-size` lays the page out at desktop
 * width whatever the window size, so media queries never fire and a mobile
 * capture comes back clipped rather than responsive — evidence that looks
 * like a page defect but is a capture defect.
 *
 * Usage: node scripts/capture.mjs <url> <out.png> <width> <height> [theme]
 */
import { spawn } from 'node:child_process';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const [url, out, w, h, theme = 'light'] = process.argv.slice(2);
const width = Number(w), height = Number(h);
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333 + (Math.floor(Math.random() * 300));

const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
    `--remote-debugging-port=${PORT}`, '--user-data-dir=/tmp/impeccable-capture',
    'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function target() {
    for (let i = 0; i < 40; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
            const list = await res.json();
            const page = list.find(t => t.type === 'page');
            if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
        } catch { /* not up yet */ }
        await sleep(250);
    }
    throw new Error('Chrome devtools endpoint never came up');
}

const ws = new WebSocket(await target());
await new Promise(r => ws.addEventListener('open', r, { once: true }));

let id = 0;
const pending = new Map();
ws.addEventListener('message', e => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
});
const send = (method, params = {}) => new Promise(res => {
    const mid = ++id;
    pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
});

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
    width, height, deviceScaleFactor: 2, mobile: width < 768,
});
await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-color-scheme', value: theme }],
});
await send('Page.navigate', { url });
await sleep(5000);

// Settle entrance motion: an element mid-animation reads as a missing element.
await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('[class*=animate-]').forEach(e=>{
        e.style.animation='none'; e.style.opacity='1'; e.style.transform='none';});
        localStorage.setItem('senseai-theme','${theme}');
        document.documentElement.setAttribute('data-theme','${theme}');
        window.scrollTo(0,0); true;`,
});
await sleep(700);

const { data } = await send('Page.captureScreenshot', {
    format: 'png', captureBeyondViewport: true,
});

await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, Buffer.from(data, 'base64'));

const probe = await send('Runtime.evaluate', {
    expression: `JSON.stringify({vw:innerWidth, doc:document.documentElement.scrollWidth,
        scroll:document.documentElement.scrollWidth>innerWidth,
        theme:document.documentElement.getAttribute('data-theme')})`,
    returnByValue: true,
});
console.log(`${path.basename(out)}  ${probe.result.value}`);

ws.close();
chrome.kill();
