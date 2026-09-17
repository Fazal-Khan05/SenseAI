# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: people learning American Sign Language.** A learner practises a sign
in front of their own webcam and wants to know whether they formed it
correctly — not merely to receive a translation. The failure case that matters
is a sign that does not register, so the product's job is to tell the learner
*which part* was wrong (the handshape or the movement), because that is the
feedback a practice tool owes them.

This reframes the live shape/phase readout on the detection screen: for this
user it is core feedback, not developer diagnostics.

Secondary audiences (course evaluators reviewing the work, visitors trying the
deployed site) are real but do not drive product decisions.

## Product Purpose

Recognise sign language from a live webcam in the browser and assemble the
recognised signs into grammatical English sentences. Success is a learner
signing a short phrase and seeing correct English come back, plus enough
feedback to correct themselves when it does not.

A second, equally real feature detects everyday objects from the same camera.

## Positioning

The distinctive mechanism is **gloss-to-English sentence construction**, not the
recognition itself. ASL is not word-order English: it drops articles and the
copula, and marks questions by moving the WH word. Most browser demos stop at
emitting isolated labels. This product repairs the grammar, so `ME NAME J-O-H-N`
becomes "My name is John." and `WHERE SCHOOL` becomes "Where is the school?"

Second: everything runs on-device. No video, frame, or landmark ever leaves the
browser, and no inference server exists to send it to.

## Operating Context

Two settings, both confirmed and both binding:

- **Live demonstration** — shown on a laptop in front of an audience, possibly
  on unreliable or absent wifi. Startup must be fast and must not depend on a
  network call.
- **Deployed site** — hosted at a URL that other people open on their own
  devices and cameras.

Consequences future work must respect:

- `getUserMedia` requires a secure context, so any deployment must be HTTPS
  (`localhost` is exempt during development).
- Model assets (~37MB: MediaPipe WASM runtime, hand-landmark model, COCO-SSD
  weights) live in `public/`, are gitignored, and are fetched by
  `scripts/setup-models.mjs` on install. **A deploy that skips that step ships
  an app that cannot detect anything.**
- Hardware acceleration materially changes the experience: model init is ~1.5s
  on the GPU delegate and ~15s on the CPU fallback.

## Capabilities and Constraints

**Working today**

- Live webcam capture with explicit handling for denied permission, absent
  camera, and insecure context.
- Hand tracking via MediaPipe HandLandmarker (pre-trained, 21 landmarks).
- Recognition of 8 word-level signs — `HELLO THANK-YOU PLEASE SORRY YES NO
  I-LOVE-YOU ME` — from a trained handshape classifier combined with
  rule-based movement segmentation.
- Gloss-to-English sentence construction, and speech output via the Web Speech API.
- Object detection via COCO-SSD (80 pre-trained classes) with drawn boxes.

**Technical constraints**

- React 19 + Vite SPA, JavaScript (not TypeScript). No backend of any kind.
- One hand is tracked. Body position is not tracked, so signs distinguished
  only by location relative to the body (forehead vs chin vs chest) cannot be
  told apart, and two-handed signs are unsupported.
- Recognition is rule-based, not trained: handshape templates plus motion
  segmentation. `STOP` and `GOOD` were deliberately removed because they are
  inseparable from ordinary hand movement — `STOP` fired on any resting hand
  and `GOOD` is the return stroke of `THANK-YOU`.
- Detection routes are lazily loaded; TensorFlow.js must not reach the main bundle.

**Open decisions**

- **Authentication is planned but not built.** The signup, login, and OTP
  screens are UI mockups: any input proceeds, and every route is reachable
  directly by URL. Real accounts and email OTP are intended. Until that exists,
  nothing in the product may describe auth as working or secure.
- Vocabulary beyond 11 signs requires a trained model (WLASL is the identified
  dataset). Not started.
- Fingerspelling was built, then removed as too slow for sentence building. The
  sentence builder still understands `#X` letter tokens if it returns.

## Brand Commitments

Name: **Sense AI** (rendered "Sense" + "AI"). No other identity constraint has
been established.

## Evidence on Hand

Real and citable:

- 8 recognised signs, enumerated in `src/lib/wordSigns.js`.
- Three camera-free test suites: `scripts/test-gloss.mjs` (17 sentence cases),
  `scripts/test-motion.mjs` (8 motion classifications), `scripts/test-strokes.mjs`
  (8 full gesture sequences, including the regression for one sign emitting three).
- Measured performance: model init ~1.5s on GPU, ~15s on CPU fallback; assets
  served locally with zero runtime network requests.

**Absences that must not be papered over.** There is no trained model, no
accuracy benchmark, and no user testing. Any accuracy, latency, or vocabulary-size
figure stated anywhere in the product must be traceable to the code or a real
measurement. Invented metrics were previously present on the dashboard and
landing page and were removed deliberately; they must not return. Both surfaces
are now clean: the landing page states only what the code substantiates, and its
two glossed examples are asserted against `glossToSentence` in the build.

## Product Principles

1. **Diagnose, don't just translate.** The learner needs to know why a sign
   failed. Surfacing the recognised handshape and motion phase is a feature.
2. **Refuse rather than guess.** A wrong sign silently corrupts the sentence,
   so the matcher returns nothing when confidence is low. Silence is the safer
   failure for a practice tool.
3. **Claim only what is measured.** No fabricated accuracy, vocabulary, or
   latency figures — in the UI, the README, or the write-up.
4. **Nothing leaves the device.** On-device inference is a privacy property to
   protect, not an implementation detail to trade away for a better model.
5. **Survive the demo.** Cold start, no network, a blocked camera, and a CPU-only
   machine are all expected conditions, not edge cases.

## Accessibility & Inclusion

The product concerns deaf and hard-of-hearing communication, so its own
accessibility is load-bearing: an inaccessible sign-language tool undercuts its
premise. Already in place and to be preserved — visible focus indicators, a
`prefers-reduced-motion` path, real `aria` semantics on custom controls
(the speech toggle is a `role="switch"`), and live regions on the sentence output.

Camera-based input is inherently exclusionary to some users; the vocabulary
panel allows adding signs without the camera, which should remain available.
