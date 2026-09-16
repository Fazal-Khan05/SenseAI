# Sense AI

Real-time sign-language recognition that builds English sentences, plus object
detection. Everything runs in the browser — video never leaves the device.

## Quick start

```bash
npm install          # also fetches model assets via postinstall
npm run dev
```

Open http://localhost:5173. Camera access requires `localhost` or HTTPS.

If model assets are missing (`Hand-tracking model failed to load`):

```bash
npm run setup:models
```

That copies the MediaPipe WASM runtime out of `node_modules` and downloads the
hand-landmark and COCO-SSD models into `public/` (~37MB total). All of it is
gitignored — large binaries, fetched rather than committed.

Both models are served locally, so detection makes **no network requests at
runtime** and works fully offline. That matters at demo time.

### If loading feels slow

Model init is ~1.5s with the GPU delegate and ~15s if the browser falls back to
CPU. The page says which is happening. A CPU fallback usually means hardware
acceleration is disabled in the browser — worth checking before a demo.

## What works today

| Feature | Status |
|---|---|
| Object detection | **Real.** COCO-SSD, 80 pre-trained classes, live boxes |
| Hand tracking | **Real.** MediaPipe HandLandmarker, 21 landmarks |
| Word signs | **Real.** 8 signs via handshape + motion rules, no training needed |
| Fingerspelling | **Removed.** Spelling letter-by-letter was too slow to build sentences |
| Gloss → English | **Real.** Rule-based, 17 passing tests |
| Speech output | **Real.** Web Speech API |
| Auth (login/signup/OTP) | **Mock.** No backend; any input proceeds |

### How signs are recognised

A sign is **handshape + movement**. Shape alone is not enough: THANK-YOU and
PLEASE are the same flat hand, separated only by how it moves.

```
shapeFromGesture()  ->  FLAT | FIST | POINT | VEE | ILY      (trained model)
classifySince()     ->  static | linear(…) | circular | oscillate   (rules)
matchSign()         ->  gloss, or null
```

The handshape half comes from **MediaPipe's trained gesture classifier**, not
hand-written rules. An earlier version scored poses against templates whose
values were guessed from anatomy rather than measured; two of them overlapped
below the reject threshold, so shapes swapped at random and signs were
unreliable across the board. MediaPipe's canned model is trained on exactly
these handshapes, so the templates are gone.

Movement is still rule-based, and that is the remaining weak half.

**Movement is segmented into strokes, not classified every frame.** Classifying
continuously does not work: after a sign the hand holds still (which looks like
a static sign) and then returns to rest (which looks like a sign in the
opposite direction). A single THANK-YOU used to emit `THANK-YOU`, `STOP`,
`GOOD`. Now a stroke opens when the hand accelerates, closes when it settles,
and is classified exactly once — then a short refractory period requires
stillness before the next sign can fire.

Two signs were dropped for being inseparable from ordinary movement:
`STOP` (flat hand held still) fired on any resting hand, and `GOOD`
(flat hand upward) is exactly the return stroke of THANK-YOU.

Recognised: `HELLO THANK-YOU PLEASE SORRY YES NO I-LOVE-YOU ME`

These 8 were chosen because they stay separable **without a trained model**.
The set shrank from fourteen: signs were dropped whenever two of them could
not be told apart reliably, because an unreliable sign makes its neighbours
unreliable too. The five remaining handshapes sit at least 1.0 apart in
feature space against a 0.75 reject cutoff; the earlier FLAT/OPEN pair sat at
0.52 and swapped at random.
Real ASL also uses location relative to the body (forehead vs chin vs chest)
and two-handed forms. Neither is tracked here, so signs that differ only by
body location are deliberately excluded rather than guessed at.

The matcher returns null when nothing fits — a wrong sign silently corrupts
the sentence, so refusing to guess is the safer failure.

The on-screen readout shows the live shape and motion, so when a sign does not
register you can see which half is wrong.

## Architecture

```
src/
  lib/
    handJoints.js        landmark indices (no MediaPipe import — keeps bundles small)
    handLandmarks.js     MediaPipe GestureRecognizer (landmarks + trained handshape)
    handFeatures.js      scale/rotation-tolerant pose descriptor + normalisation
    handShapes.js        maps MediaPipe's trained gesture labels to handshapes
    motionTracker.js     rolling window -> static / linear / circular / oscillate
    wordSigns.js         shape + motion -> gloss
    signVocabulary.js    single source of truth for glosses
    glossToSentence.js   ASL gloss -> English  <-- the headline feature
    drawBoxes.js         canvas overlay for object boxes
  hooks/
    useCamera.js         getUserMedia + rAF loop, all camera states
    useSignRecognition.js  stability gate, gloss buffer
    useObjectDetection.js  COCO-SSD inference
    useSpeech.js         Web Speech API
```

`glossToSentence.js` is pure and dependency-free:

```bash
node scripts/test-gloss.mjs      # 17 sentence cases
node scripts/test-motion.mjs     # 8 motion-classification cases
node scripts/test-strokes.mjs    # 8 full gesture sequences, incl. the glitch above
```

Neither needs a camera.

ASL is not word-order English — it drops articles and the copula, and marks
questions by moving the WH word. That module is what repairs the difference:

```
['ME','NAME','#J','#O','#H','#N']  ->  "My name is John."
['YOU','NAME','WHAT']              ->  "What is your name?"
['WHERE','SCHOOL']                 ->  "Where is the school?"
```

## Remaining work: training the models

Neither trained model exists yet. Both use **public datasets** — no footage
needs to be recorded.

The rule-based matcher covers 13 signs. Going beyond that — more vocabulary,
body-relative location, two-handed signs — needs a trained model.

- Dataset: [WLASL](https://dxli94.github.io/WLASL/), restricted to the glosses in `signVocabulary.js`
- Landmark sequences (~32 frames) → small GRU → export to `public/models/signs/`
- Swap in behind `matchSign()` — the interface stays the same

**Use `normalizeLandmarks()` from `src/lib/handFeatures.js` when building the
training set.** If training and inference normalise differently, the model sees
a different input distribution than it was fitted on and accuracy collapses.

The **How to sign these** panel also lets you tap a gloss in, so the sentence
builder can be demonstrated without the camera.

## Known limitations

- Auth is a UI mock — every route is reachable directly by URL
- Signs are matched by shape and motion only — body location is not tracked
- Two-handed signs are not supported (one hand is tracked)
- Object detection is capped at ~10 inferences/sec to keep the UI responsive
