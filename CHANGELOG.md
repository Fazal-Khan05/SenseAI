# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

Nothing has been released yet. Everything below is the state of the project
since work began, and the version history will start at the first tagged
release.

### Added

- Live webcam sign-language recognition for 8 ASL word signs — `HELLO`,
  `THANK-YOU`, `PLEASE`, `SORRY`, `YES`, `NO`, `I-LOVE-YOU`, `ME` — identified
  from handshape and movement together. All inference runs on-device; no video,
  frame or landmark leaves the browser.
- Gloss-to-English sentence construction. ASL drops articles and the copula and
  fronts question words, so recognised glosses are repaired into English rather
  than emitted as a pile of labels: `ME SORRY` becomes "I am sorry."
- Object detection from the same camera via COCO-SSD, 80 pre-trained classes,
  with boxes drawn on an overlay canvas.
- Speech output for the built sentence, through the Web Speech API.
- Practice coverage. Each sign carries one of four states — untried, attempted,
  landed, confident — so a learner can see which signs they can actually
  produce. Progress is coverage, never a score, and persists locally so practice
  needs no account and survives a demo with no network.
- Inline coaching for a sign that will not land. A recognisable handshape held
  without any sign completing is credited as an attempt against every sign using
  that shape, which is what surfaces the correction.
- A live classifier readout under the camera showing the handshape it currently
  reads, the motion phase, and hand speed against the speed a sign needs. For a
  learner this is the feedback the product owes them, not developer diagnostics.
- Real download progress for the model assets, reported as a true percentage
  rather than an indeterminate spinner.
- Four camera-free test suites, 57 cases total, run directly with `node`:
  `test-gloss.mjs` (17), `test-motion.mjs` (13), `test-strokes.mjs` (10),
  `test-progress.mjs` (17).
- `scripts/capture.mjs`, which drives Chrome over CDP with real device
  emulation. Plain headless Chrome lays a page out at desktop width whatever
  window size it is given, so its "mobile" screenshots come back clipped.
- `PRODUCT.md`, `DESIGN.md` with `.impeccable/design.json`, and `CLAUDE.md`.

### Changed

- **Handshape classification moved from hand-written templates to MediaPipe's
  trained gesture classifier.** The templates were scored from anatomical
  guesswork rather than measurement, and `gesture_recognizer.task` replaces
  `hand_landmarker.task` at 8.0MB against 7.5MB — it bundles landmark detection,
  so nothing is added. Movement classification remains rule-based and is now the
  weaker half.
- **The landing page was rebuilt in a new visual world**, "The Interlinear
  Gloss": two inks on cool duplicator stock, Alegreya and Courier Prime
  self-hosted, zero radius, zero gradient, zero shadow. The page is set as a
  descriptive grammar of the product, because the product's output already is
  one. The rest of the app still runs the outgoing world and is converted in
  later passes.
- Vocabulary reduced from 11 signs to 8. Eight that work beat eleven that argue
  with each other — see *Removed*.
- The stroke-start threshold lowered from 0.30 to 0.15 frame-widths per second,
  which is reachable at an unhurried signing pace.
- Circular motion now requires roughly a full revolution (5.0 rad, up from 3.2)
  **and** an endpoint near the origin, because a circle is a loop that returns
  to where it started.
- Model assets are fetched at install by `scripts/setup-models.mjs` rather than
  committed. `vercel.json` runs `setup:models` explicitly, because a cached
  `node_modules` skips `postinstall` and ships an app that loads but detects
  nothing.
- Detection routes are lazily loaded so TensorFlow.js and MediaPipe stay out of
  the main bundle.
- Dashboard statistics now read real capability figures from the vocabulary
  instead of invented session metrics.

### Fixed

- **One sign emitting three glosses.** Classifying every frame made a single
  `THANK-YOU` produce `THANK-YOU`, then `STOP` while the hand rested, then
  `GOOD` as it returned to neutral. Gestures are now segmented into discrete
  strokes and classified exactly once, followed by a refractory period.
- **Signing at a natural pace never registered.** The stroke threshold had been
  set against synthetic test paths that moved roughly three times faster than
  real signing, so the tests passed while the feature did not work on camera. A
  slow-sweep case that fails on the old value now guards it.
- **`HELLO` was recognised as `PLEASE`.** The two share the flat handshape and
  are separated only by movement, and the circular test accepted half a
  revolution, so a curved sweep crossed it. Measured across arc angles: 200°,
  240° and 270° all read circular before, and only 360° does now.
- **Signs swapped across the whole vocabulary.** Two handshape templates sat
  0.52 apart against a 0.70 reject cutoff, so an open hand matched either at
  random. Minimum pairwise separation is now 1.00 against a 0.75 cutoff, an
  ambiguous reading within 0.18 of its runner-up is rejected outright, and a
  stroke whose shape flickered commits nothing.
- **Download progress silently disabled on hosts that compress.** Brotli
  responses omit `Content-Length`, leaving the reader nothing to divide by.
  Uncompressed sizes are recorded at build time in `public/models/sizes.json`.
- **Inference errors were caught and discarded**, which made a broken detector
  indistinguishable from an empty frame and cost a long detour to diagnose. They
  now log and surface a visible error state.
- Colour contrast, all measured: `--text-muted` was 2.54:1 on white — well under
  the 4.5 floor and applied app-wide — and is now 4.83:1. Coaching text went
  2.05:1 → 5.38:1 and the landed chip 2.82:1 → 5.36:1.
- Mobile overflow on the detection screen. A grid track's implicit minimum is
  `min-content`, so long text pushed the panel past the viewport until the
  columns became `minmax(0, …)`.
- The sentence-builder header truncated "Clear" below 420px.
- The footer re-centred at phone width on the rebuilt landing page. `text-align`
  could not reach it: the container is a flex column whose items were centred on
  the cross axis.
- Camera permission denial, an absent camera and an insecure context are
  reported plainly instead of leaving the interface on a spinner.
- Several dead or broken interactions from the original UI shell, including a
  Clear button that could not clear and a speech toggle that was not keyboard
  reachable.

### Removed

- **Every fabricated metric.** The landing page and dashboard claimed 99%
  accuracy, sub-50ms latency, 100+ signs and "thousands of users"; none had been
  measured. The landing page's two glossed examples are now asserted against
  `glossToSentence` in the build so they cannot drift back into fiction.
- Five signs, each for a stated reason: `STOP` fired on any resting hand;
  `GOOD` is the return stroke of `THANK-YOU`; `GOODBYE` and `HELP` needed
  handshapes too close to their neighbours; `YOU` was only a movement apart from
  `ME`, and reaching out to point produces that movement.
- Fingerspelling, which was built and then removed as too slow to build
  sentences with. The sentence builder still understands `#X` letter tokens if
  it returns.
- The blue/violet gradient, badge pills, icon-tile cards and centred layout, on
  the landing page.

### Security

- Nothing here is authenticated. The signup, login and OTP screens are UI
  mockups: any input proceeds and every route is reachable directly by URL. No
  backend exists. Until one does, nothing in this project should be described as
  working or secure authentication.

---

**A note on the history.** Between `7d2d0a1` and `ff40960` the hand-tracking
runtime was swapped to TensorFlow.js to cut the download from 18.7MB to 3.9MB,
and then reverted because it never detected a hand on a real camera with either
the lite or the full models. The net effect on the shipped project is nil, so it
is not listed as a change — but it explains the dependency churn in that range.
The streaming download progress and the inference error logging were kept from
that attempt and are listed above on their own merits.
