# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # also runs setup:models via postinstall
npm run dev          # Vite dev server on :5173
npm run build        # production build
npm run lint         # eslint, must stay at zero errors
npm run setup:models # re-fetch model assets if detection stops working
```

**Tests are plain Node scripts, not a framework.** Each is run directly and each
needs no camera and no browser:

```bash
node scripts/test-gloss.mjs     # 17 cases — gloss sequence to English sentence
node scripts/test-motion.mjs    # 13 cases — motion classification from a path
node scripts/test-strokes.mjs   # 10 cases — whole gesture sequences through the state machine
node scripts/test-progress.mjs  # 17 cases — practice coverage model
```

There is no test runner and no watch mode; to run a single case, edit that
script's `CASES` array. Each exits non-zero on failure.

`node scripts/capture.mjs <url> <out.png> <width> <height> [light|dark]` drives
Chrome over CDP with real device emulation. Use it rather than
`chrome --headless --screenshot`: plain headless lays the page out at desktop
width whatever window size you pass, so media queries never fire and a "mobile"
capture comes back clipped — which looks like a page defect but is a capture
defect.

## Architecture

### The recognition pipeline

This is the part that needs several files read together. A camera frame becomes
an English sentence through a fixed chain, and each stage lives in its own file:

```
useCamera            getUserMedia + rAF loop, calls onFrame(video, timestamp)
  └─ useSignRecognition        the state machine; owns the whole chain below
       ├─ handLandmarks.js     MediaPipe GestureRecognizer → 21 landmarks + a
       │                       trained handshape label, in one pass
       ├─ handShapes.js        maps the trained gesture label to a shape name
       │                       (FLAT FIST POINT VEE ILY). A lookup, not a classifier
       ├─ motionTracker.js     rolling landmark trail → static | linear(dir) |
       │                       circular | oscillate(axis)
       └─ wordSigns.js         (shape + motion) → gloss, or null
  └─ glossToSentence.js        gloss sequence → English, repairing ASL grammar
```

**A sign is handshape *plus* movement.** THANK-YOU and PLEASE are the same flat
hand; only the motion separates them. Changing one half without the other is
usually wrong.

**Handshape is trained; movement is rules.** MediaPipe's gesture classifier
supplies the shape, so that half is reliable. Everything in `motionTracker.js`
and the stroke state machine is hand-written, and it is where misreads come
from. Earlier hand-written shape templates were removed because two of them
overlapped below the reject threshold and signs swapped at random.

### Two things the state machine exists to prevent

Both were real bugs; the regression tests in `test-strokes.mjs` lock them out.

1. **Continuous classification emits phantom signs.** Classifying every frame
   made one THANK-YOU produce THANK-YOU, then STOP while the hand rested, then
   GOOD as it returned to neutral. Gestures are therefore segmented into
   discrete *strokes* — a stroke opens when speed crosses `STROKE_START`, closes
   when it settles, and is classified exactly once, followed by a refractory
   period.

2. **Thresholds tuned against synthetic paths pass tests while the feature is
   broken.** The original `STROKE_START` was set against test paths that moved
   ~3x faster than real signing, so nothing ever triggered on camera. When you
   touch a numeric threshold, add a case that fails on the old value.

### Vocabulary is deliberately small

`src/lib/wordSigns.js` holds 8 signs, and its header records *why* each removed
sign was removed (STOP fired on any resting hand; GOOD is the return stroke of
THANK-YOU; GOODBYE and HELP needed handshapes too close to their neighbours).
Read that before adding a sign — the set shrank on purpose, because an
unreliable sign makes its neighbours unreliable too.

`matchSign` returns `null` rather than guessing. A wrong sign silently corrupts
a sentence, so refusing is the safer failure.

### Model assets

~37MB of MediaPipe and COCO-SSD assets live in `public/models` and
`public/mediapipe`, are **gitignored**, and are fetched by
`scripts/setup-models.mjs`. `vercel.json` therefore runs
`npm run setup:models && npm run build` explicitly rather than relying on
`postinstall`, because a cached `node_modules` skips it and ships an app that
loads but detects nothing. Everything is served locally: detection makes zero
runtime network requests.

`public/models/sizes.json` records uncompressed byte sizes. Hosts that compress
these responses drop `Content-Length`, so the download progress bar has nothing
to divide by; `fetchWithProgress.js` falls back to that table.

### Bundle boundaries

The detection routes are `React.lazy` in `App.jsx` so TensorFlow.js and
MediaPipe stay out of the main bundle. `handJoints.js` exists solely to hold
landmark index constants *without* importing the MediaPipe runtime — importing
them from `handLandmarks.js` instead drags ~150KB into every page. Check the
build output if you add an import to `src/lib`.

### Import extensions in `src/lib`

Modules reachable from the Node test scripts must use explicit `.js` extensions
on relative imports (`from './wordSigns.js'`). Vite resolves extensionless
imports; bare `node` does not, and the test fails at load.

## Project conventions

- JavaScript, not TypeScript. React 19 + Vite. **No backend of any kind.**
- `eslint.config.js` widens `no-unused-vars` with `varsIgnorePattern` and
  `argsIgnorePattern: '^[A-Z_]'` because there is no `eslint-plugin-react`, so
  JSX usage does not mark a binding as used. Capitalised names are components.
- Auth (signup, login, OTP) is a **UI mockup**. Any input proceeds and every
  route is reachable directly by URL. Do not describe it as working or secure.
- Never state an accuracy, latency, or vocabulary figure that the code cannot
  substantiate. Invented metrics were removed from the landing page and
  dashboard deliberately; the landing page's two glossed examples are asserted
  against `glossToSentence` so they cannot drift back into fiction.

## Two visual worlds coexist

The app is mid-conversion and this will look like an inconsistency if you do not
know it is deliberate:

- **`src/pages/Landing.jsx` + `Landing.css`** run the current world — "The
  Interlinear Gloss": two inks on cool duplicator stock, Alegreya and Courier
  Prime, zero radius, zero gradient, zero shadow. Its tokens are declared on the
  `.landing` scope rather than `:root` so the two worlds can coexist.
- **Every other screen** still runs the outgoing world (Inter, a blue/violet
  gradient, pill buttons, 16px cards) and is converted in later passes. Nothing
  in it is a precedent for new work.

`DESIGN.md` documents the new world and is normative for visual decisions;
`PRODUCT.md` documents product truth, users, and constraints. Read the relevant
one before design or product changes rather than inferring intent from whichever
screen you happen to open. `.impeccable/surfaces/` holds per-surface direction
contracts.
