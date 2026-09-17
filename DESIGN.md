---
name: Sense AI
description: A two-ink descriptive grammar — the product's own glossed output, set as the page.
colors:
  stock: "#E7E8E3"
  ink: "#17181B"
  ink-soft: "#4A4E52"
  overprint: "#1D5B3F"
  overprint-pale: "#BFD3C6"
  rule: "rgba(23, 24, 27, 0.22)"
  rule-hair: "rgba(23, 24, 27, 0.12)"
typography:
  display:
    fontFamily: "Courier Prime, ui-monospace, Courier New, monospace"
    fontSize: "clamp(2rem, 6.2vw, 4.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.04em"
  headline:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "clamp(1.5rem, 3.6vw, 2.6rem)"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "normal"
  body:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  parse:
    fontFamily: "Alegreya, Georgia, serif"
    fontSize: "0.78em"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontFeature: "'smcp' 1"
  label:
    fontFamily: "Courier Prime, ui-monospace, Courier New, monospace"
    fontSize: "0.78rem"
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: "0.12em"
  action:
    fontFamily: "Courier Prime, ui-monospace, Courier New, monospace"
    fontSize: "0.92rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.08em"
  note:
    fontFamily: "Courier Prime, ui-monospace, Courier New, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  edge: "clamp(20px, 5vw, 76px)"
  margin-col: "clamp(180px, 20vw, 260px)"
  section: "clamp(56px, 9vh, 104px)"
  gutter: "clamp(28px, 5vw, 72px)"
  block: "clamp(22px, 3vh, 34px)"
  note-gap: "20px"
  entry: "18px"
  row: "11px"
components:
  action-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    typography: "{typography.action}"
  action-primary-hover:
    backgroundColor: "{colors.overprint}"
    textColor: "{colors.stock}"
  action-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    typography: "{typography.action}"
  action-quiet-hover:
    backgroundColor: "transparent"
    textColor: "{colors.overprint}"
  action-text:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "0 0 3px"
    typography: "{typography.label}"
  action-text-hover:
    textColor: "{colors.overprint}"
  action-on-overprint:
    backgroundColor: "{colors.stock}"
    textColor: "{colors.overprint}"
    rounded: "{rounded.none}"
    padding: "12px 22px"
    typography: "{typography.action}"
  action-on-overprint-hover:
    backgroundColor: "transparent"
    textColor: "{colors.stock}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "6px 0"
  nav-link-hover:
    backgroundColor: "transparent"
    textColor: "{colors.overprint}"
  nav-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "9px 16px"
  nav-action-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "9px 16px"
  nav-action-hover:
    backgroundColor: "{colors.overprint}"
    textColor: "{colors.stock}"
  marginal-note:
    backgroundColor: "transparent"
    textColor: "{colors.overprint}"
    rounded: "{rounded.none}"
    typography: "{typography.note}"
  entry-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "18px 0"
    typography: "{typography.body}"
  overprint-band:
    backgroundColor: "{colors.overprint}"
    textColor: "{colors.stock}"
    rounded: "{rounded.none}"
    padding: "clamp(56px, 9vh, 104px) 0"
---

# Design System: Sense AI

## Overview

**Creative North Star: "The Interlinear Gloss"**

Sense AI's output is already a typographic form with centuries of use behind it:
interlinear glossed text — the signed form on one line, its morpheme parse
directly beneath, the free translation in single quotes below that, every row
hard-aligned on a single left margin. So the interface is not a page *about* a
grammar engine. It is set as a descriptive grammar: numbered examples, section
marks, a paradigm table, hanging entries, and annotations in the margin. The
proof and the form are the same object, which is why the first thing a visitor
meets is example (1) rather than a sales line.

The materials are the mimeographed grammar and the overprinted atlas plate — two
inks laid on cool pale duplicator stock. Printing black does the reading; one
saturated bottle green is the overprint, and it owns the apparatus: section
marks, morpheme parses, entry labels, marginal notes, every hover and focus, and
one full band near the close. Nothing is round, nothing is raised, and nothing
floats. Structure is carried entirely by hairline rules at three declared
weights and by the boundary between the two inks. Alegreya carries prose and
headings because its true small capitals are what the glossing convention
requires; Courier Prime carries every gloss, label, number and measurement,
because a duplicated grammar's examples were typed.

This world deliberately refuses two things at once. It refuses the centred
hero-with-feature-triplet arrangement this category ships — there is no centred
column anywhere, no icon tile, no card grid, no badge pill, and no gradient. It
also refuses that arrangement's predictable opposite, mono-on-black developer
brutalism. And within its own genre it refuses the softest rendition: cream,
parchment, kraft and lamplight are out, because that is the register every model
reaches for. The stock is cool grey and the green is cold.

**Conversion status.** This is the system's world going forward, but only the
landing page runs it today. The dashboard, practice, detection and auth screens
still run the outgoing "Patient Tutor" world (Inter, blue/violet gradient, pill
buttons, 16px cards, ambient shadow) and are converted in later passes. The new
world's tokens are declared on the `.landing` scope rather than `:root`
precisely so the two can coexist during that conversion; when a screen is
converted, its rules move into this world's vocabulary rather than the scope
widening by default. Nothing from the outgoing world is a precedent for new work.

**Key Characteristics:**
- Two inks only — printing black and one bottle-green overprint — on cool grey duplicator stock
- Zero radius, zero drop shadow, zero gradient: structure is hairline rules and the second ink
- Two families with one job each: Alegreya for what a human wrote, Courier Prime for what the machine produced
- Interlinear examples at display scale, all rows hard-aligned to a single left margin
- Secondary facts live in a right-hand margin column as annotations, never as pills or cards
- Every major rule is printed twice, green out of register with black — two real plates, not a CSS paper texture

## Colors

Two inks and a stock. There is no third hue in the system, and the ratio between
them is doing the work: black reads, green annotates.

### Primary
- **Bottle Green Overprint** (`{colors.overprint}`): The second plate. It owns
  section marks (`§2`), morpheme parses under every gloss, entry labels, marginal
  notes, footer column headings, every hover state, the focus ring, the selection
  highlight, and one full-bleed band near the close of the page. It never sets
  running prose or a heading.
- **Pale Overprint** (`{colors.overprint-pale}`): Exists only inside the green
  band, where the parse row needs to stay subordinate to the gloss without
  reaching for a third ink.

### Neutral
- **Printing Black** (`{colors.ink}`): All reading matter — gloss forms, headings,
  body prose, free translations — and the fill of a primary action. Also the
  structural rule weight (1px solid) under the running head and between sections.
- **Soft Black** (`{colors.ink-soft}`): Apparatus that is present but not
  competing — example numbers, paradigm indices and notes, the colophon, the
  quiet text action, nav links at rest, and all footer copy.
- **Duplicator Stock** (`{colors.stock}`): The ground. Also the text colour on
  the green band and the fill of an action reversed onto it.
- **Structural Rule** (`{colors.rule}`): 22% black. Secondary containment — the
  marginalia's left rule, the quiet action's border, nav button strokes.
- **Hairline Rule** (`{colors.rule-hair}`): 12% black. Row separation only —
  between entries, between paradigm rows, under the scrolled navbar.

### Dark mode

Dark is a true inversion of the same two-plate idea, not a dimming. The stock
becomes `#14161A`, the inks swap (`#E7E8E3` reading, `#A8AEB0` soft), the
overprint brightens to `#5FB98A` to survive a dark ground, and the pale
overprint inverts to a dark green `#24402F`. The green band keeps a light green
field and takes near-black type (`#0F1116`), because inverting the band would
cost the page its one region of solid colour.

### Named Rules

**The Two Ink Rule.** The system has exactly two inks. Every colour decision is
"black or green", never "which green" or "what about a third accent". A gradient,
a tint ramp, or a second accent hue is a violation of the material, not an
enrichment of it.

**The Green Owns The Apparatus Rule.** The overprint carries the grammar's
apparatus — marks, parses, labels, annotations, states — and never the text being
annotated. If green is setting a sentence a reader is meant to read straight
through, it is in the wrong place.

**The Cool Stock Rule.** The ground is cool duplicator grey (`{colors.stock}`).
Cream, parchment, kraft and lamplight are this world's softest rendition and are
explicitly out of the system.

## Typography

**Display Font:** Courier Prime (with `ui-monospace`, `Courier New`, monospace) — self-hosted
**Body Font:** Alegreya (with Georgia, serif) — self-hosted variable face, 400–900, roman and italic
**Label/Mono Font:** Courier Prime, the same face as display

**Character:** A division of labour, not a pairing for contrast. Courier Prime is
the typewriter that produced the examples; Alegreya is the linguist who wrote
around them. Alegreya was chosen for one specific reason — it carries true small
capitals, which the glossing convention requires and which faked caps cannot
supply. Both faces are self-hosted from `src/fonts.css` with `font-display: swap`
and the two leading files preloaded, because the product's binding demo condition
is that startup must not depend on a network call.

### Hierarchy
- **Display** (Courier Prime 700, `clamp(2rem, 6.2vw, 4.4rem)`, 1.1, `0.04em`):
  The gloss form of a lead example. Two per page at most — the hero and the band.
- **Headline** (Alegreya italic 400, `clamp(1.5rem, 3.6vw, 2.6rem)`, 1.25): The
  free translation of a lead example, in single quotation marks. It is the
  largest serif on the page and it is always subordinate to the gloss above it.
- **Title** (Alegreya 700, `clamp(1.5rem, 2.8vw, 2.1rem)`, 1.15): Section
  headings, always preceded by a green section mark, and the green band's heading.
- **Body** (Alegreya 400, `1.0625rem`, 1.65): Running prose, capped at a 62ch
  measure. The hero statement runs slightly larger
  (`clamp(1.15rem, 1.7vw, 1.4rem)`, 1.55) at a 34ch measure, because it is one
  sentence doing the work of a subhead.
- **Parse** (Alegreya small caps 500, `0.78em`, `0.06em`): The morpheme row under
  a gloss token, set in the overprint. Uses real small capitals
  (`font-variant-caps: small-caps` plus `'smcp' 1`), with `text-transform:
  lowercase` feeding the feature rather than fighting it.
- **Label** (Courier Prime 700, `0.78rem`, `0.12em`, uppercase): Entry labels,
  marginal-note headings, footer column headings. Never sentence-length. The
  running head and wordmark use the same face at `0.22em` — the widest tracking
  in the system, reserved for page-level identification.
- **Action** (Courier Prime 700, `0.92rem`, `0.08em`, uppercase): Button text only.
- **Note** (Courier Prime 400, `0.78rem`, 1.55): Marginal annotations, the
  paradigm caption, the colophon, and all footer copy — the grammar's own voice
  around the examples.

### Named Rules

**The Typed Example Rule.** Anything the machine produced or that is notation —
glosses, indices, labels, measurements, section marks — is set in Courier Prime.
Anything a human wrote — prose, headings, free translations — is set in Alegreya.
The two faces are a semantic distinction, not decoration; do not mix them for
visual interest.

**The Real Small Caps Rule.** Morpheme parses use Alegreya's true small
capitals. Uppercase text scaled down is not an acceptable substitute: the stroke
weights no longer match the surrounding roman, which is exactly what the
convention exists to preserve.

**The Gloss Over Translation Rule.** In any interlinear unit the order is fixed —
typed gloss form, then parse, then free translation in single quotes — and all
three hang from the same left edge. The order is the notation; it is not a layout
preference.

## Layout

The page is a sheet, not a centred container. `.sheet` is capped at `1320px` with
`margin: 0` and a fluid page margin of `{spacing.edge}`, so the text block hangs
from the left edge of the stock the way a printed grammar's does rather than
floating in the middle of the viewport.

The recurring structure is two columns: a text column (`minmax(0, 1fr)`) and a
fixed-ish margin column (`{spacing.margin-col}`), separated by `{spacing.gutter}`.
The text column carries examples, prose, entries and the paradigm; the margin
column carries annotations. Sections are divided by a 1px `{colors.ink}` rule and
padded `{spacing.section}` vertically. Within the text column, rhythm is
`{spacing.block}` between a body and the list beneath it, `{spacing.entry}`
vertical padding per hanging entry, `{spacing.row}` per paradigm row, and
`{spacing.note-gap}` between marginal notes.

Interlinear examples are their own grid: a hanging example number in an `auto`
column, the gloss lines in `1fr`. Gloss tokens are a wrapping flex row with a
fluid `clamp(20px, 3.2vw, 52px)` column gap, so a long gloss line breaks between
tokens and never between a form and its parse.

Two breakpoints, both structural rather than cosmetic. At **900px** the two
columns collapse to one and the margin column folds under the text it annotates,
exchanging its left rule for a top rule and laying its notes out as an auto-fit
row (`minmax(min(180px, 100%), 1fr)`). At **560px** the example number moves
above its gloss instead of beside it, and the paradigm drops to two columns with
its note wrapping to the second.

### Named Rules

**The One Left Margin Rule.** Every row of an interlinear unit, and every block
in the text column, aligns to a single left margin. Nothing in this world is
centred — not a heading, not a hero, not a call to action, not the page block
itself.

**The Margin Is Not A Card Rule.** Secondary facts go in the margin column as
annotations. When the layout narrows they fold under the text they annotate and
stay annotations. They never acquire a background, a border box, an icon or a
radius on the way down.

**The Action Closes The Line Rule.** The primary action sits inline at the end of
the sentence that explains the product, on its baseline, rather than in a
detached button row. Buttons in this world are set as grammar, not as chrome.

## Elevation & Depth

This system is flat by construction and carries **zero drop shadows**. The
outgoing world's ambient shadow vocabulary is gone, and the landing scope
explicitly cancels the inherited ones (`box-shadow: none` on the scrolled navbar
and on every nav action). Depth comes from three things and nothing else: the
declared hairline rule weights, the boundary between the two inks, and one full
region where the second ink owns the ground outright.

The single `box-shadow` in the world is not a shadow at all — it is an inset
plate line at the top edge of the green band (`inset 0 2px 0 rgba(23,24,27,0.16)`)
that reads as ink bite where the second plate meets the stock.

The other depth device is registration, and it is built as two plates that
disagree rather than as one nudged element. Every major rule — the running head,
the hero, each section, the paradigm — is printed twice: the black plate as the
element's own `border-bottom`, and the green plate as an `::after` line at
`bottom: -2px`, `left: -1px`, `right: 3px`, `height: 1px`, `opacity: .55`. The
green therefore overhangs the black at one end and falls short at the other,
which is a sheet fed slightly off-axis rather than a uniform offset. Nudging a
lone coloured element is not misregistration: with nothing printed beneath it,
there is no second plate to be out of register with.

### Named Rules

**The No Shadow Rule.** Nothing in this world casts a shadow, at rest or on
hover. If a surface needs to separate from what is behind it, it takes a rule or
it takes the other ink.

**The Two Plates Rule.** Misregistration requires two plates that disagree. It is
built by printing a rule twice — black from the element's border, green from its
`::after` — never by offsetting a single coloured element, which moves it without
misregistering anything. Paper texture, grain overlays, noise filters,
scanned-paper images and simulated toner speckle are not part of this system and
must not be added to "sell" the material.

**The Three Weights Rule.** Rules come in exactly three weights: 1px
`{colors.ink}` for structural division, 1px `{colors.rule}` for secondary
containment, 1px `{colors.rule-hair}` for row separation. A fourth weight, or a
rule thicker than 1px, is drift.

## Shapes

Radius is `{rounded.none}` everywhere, without exception, and the landing scope
reasserts it on every element that inherits a radius from the outgoing world —
nav links, nav buttons, the theme toggle, the mobile toggle, footer social links,
and the focus ring itself. There is no pill, no rounded card, no icon tile and no
clipped shape in this world.

The form language is rectangular and open. Containment is done by a single edge
rather than a closed box: the marginalia is bounded by one left rule, the
paradigm by one rule above and one below, an entry list by a hairline above each
row. Borders are always 1px; the only filled rectangles in the system are the
primary action, the reversed action on the band, and the green band itself.

**The Square Rule.** Radius is zero on every element in this world, including
focus rings and including anything inherited from an unconverted component. A
rounded corner here is not a style choice, it is a foreign body from the world
this one replaced.

## Components

Actions and text are set in the same grammar, so components here are mostly
typographic arrangements rather than containers. Nothing has a chrome layer.

### Buttons
- **Shape:** Square (`0` radius), 1px border, `12px 22px` padding, action
  typography (Courier Prime 700, `0.92rem`, `0.08em`, uppercase).
- **Primary:** Solid `{colors.ink}` fill with `{colors.stock}` text and a matching
  `{colors.ink}` border. In the hero it sits inline at the end of the reading
  line, nudged `1px` down so its cap height sits on the prose baseline.
- **Hover / Focus:** The fill and border become `{colors.overprint}` — the second
  ink is what a hover means in this world. Transitions run `160ms ease` on
  background, colour and border-colour only. Nothing lifts, scales or glows.
- **Quiet:** Transparent fill, `{colors.ink}` text, `{colors.rule}` border;
  on hover the text and border take the overprint and the fill stays transparent.
- **Text action:** No box at all — label typography in `{colors.ink-soft}` over a
  1px `{colors.rule}` underline with `3px` of descender clearance. The underline
  and text both take the overprint on hover. This is the secondary route out of
  the hero.
- **Reversed (on the green band):** `{colors.stock}` fill with `{colors.overprint}`
  text; on hover it empties to transparent with a stock border and stock text.

### Interlinear Example (signature)
The system's atom and its proof. A hanging example number in Courier Prime
`{colors.ink-soft}` with tabular figures, then a wrapping row of gloss tokens —
each token a typed form in `{colors.ink}` with its small-caps morpheme parse in
`{colors.overprint}` directly beneath — and a free translation in Alegreya italic
inside single quotation marks below. At lead scale the gloss runs to
`clamp(2rem, 6.2vw, 4.4rem)`. Inside the green band the whole unit reverses:
stock-coloured gloss and translation, pale-overprint parse, and an example number
at 72% stock.

### Marginal Annotation
Replaces the badge pills the outgoing world used. A block of Courier Prime note
text in `{colors.overprint}`, opened by an uppercase `0.12em` heading on its own
line, in a column bounded by a single `{colors.rule}` left rule and
`clamp(14px, 1.6vw, 22px)` of padding. No background, no box, no icon.

### Hanging Entry
Replaces the icon-tile grid. A two-column hanging indent — an uppercase overprint
label in the `auto` column, body text in the `1fr` column — with `18px` vertical
padding and a `{colors.rule-hair}` rule above each row plus one below the last.
Used both for claims (`HANDSHAPE / MOVEMENT / GRAMMAR`) and for ordered steps
(`01 · OPEN`), where the number is carried in the label rather than in a circle.

### Paradigm Table
A three-column listing (`2.2rem` index, `8rem` form, `1.6fr` note) bounded top and
bottom by 1px `{colors.ink}` rules, with `{colors.rule-hair}` between rows and
`11px` of vertical padding. Indices are zero-padded tabular figures in
`{colors.ink-soft}`; forms are typed and bold in `{colors.ink}`; notes are
Alegreya in `{colors.ink-soft}`. Below 560px it becomes two columns with the note
wrapping under the form.

### Overprint Band
The one region where the second ink owns the ground: a full-bleed
`{colors.overprint}` field at `{spacing.section}` vertical padding, carrying a
stock-coloured Alegreya heading capped at a 22ch measure, a reversed interlinear
example, and one reversed action. There is exactly one of these per page — its
rarity is what makes it read as an overprint rather than a colour scheme.

### Navigation
Transparent over the sheet at `18px` vertical padding; once scrolled it takes the
stock as a solid fill with a `{colors.rule-hair}` bottom rule and tightens to
`12px`, with the inherited blur and shadow explicitly removed. The wordmark is
set as a running head — Courier Prime 700 at `0.22em` uppercase, with "AI" in the
overprint — and the outgoing world's gradient logo tile is hidden rather than
restyled. Links are uppercase Courier Prime `0.76rem` at `0.12em` in
`{colors.ink-soft}`, square, taking the overprint plus a 1px bottom rule on
hover. Nav actions use the page's action grammar at a smaller size (`9px 16px`),
with the inherited `translateY` lift cancelled.

### Footer
Set entirely in Courier Prime note typography in `{colors.ink-soft}` on the
stock, opened by a 1px `{colors.ink}` rule. Column headings are uppercase
overprint at `0.14em`. Social links are stripped of their circular chips to bare
strokes with a `22px` right margin, taking the overprint and a bottom rule on
hover. Everything is left-aligned, including the bottom bar, which the outgoing
world centred.

### Focus and selection
`:focus-visible` draws a 2px `{colors.overprint}` outline at `3px` offset with
`0` radius, and text selection paints `{colors.overprint}` with `{colors.stock}`
text. Both are scoped deliberately: unscoped, the global theme repaints them from
the removed blue the moment anyone tabs or selects text.

### Inputs (not yet expressed)
The landing page has no form fields, so this world has no input tokens yet.
Provisional guidance for the pass that converts auth and practice: square, 1px
`{colors.rule}` stroke on the stock, Courier Prime label above the field rather
than floating inside it, and the standard focus ring. Do not carry the outgoing
world's `12px` radius, 2px blue border or floating label across.

## Do's and Don'ts

### Do:
- **Do** set anything the machine produced — glosses, indices, labels,
  measurements — in Courier Prime, and anything a human wrote in Alegreya.
- **Do** use real small capitals (`font-variant-caps: small-caps`) for morpheme
  parses.
- **Do** align every row of an interlinear unit to one left margin, in the fixed
  order: gloss form, parse, free translation in single quotes.
- **Do** give the overprint the apparatus — section marks, labels, annotations,
  hover, focus, selection — and keep it off running prose.
- **Do** keep radius at `0` on every element, including focus rings and anything
  inherited from an unconverted component.
- **Do** carry structure on the three declared rule weights: 1px `{colors.ink}`,
  1px `{colors.rule}`, 1px `{colors.rule-hair}`.
- **Do** put secondary facts in the margin column as annotations, and let them
  fold under the text they annotate on narrow screens.
- **Do** self-host any face this world uses; a render-blocking font CDN breaks
  the product's binding no-network startup condition.
- **Do** keep a visible focus indicator on every interactive element — the base
  reset removes outlines, so `:focus-visible` restores them deliberately.
- **Do** scope a converted screen's tokens explicitly until the whole app has
  moved, so the two worlds can coexist without leaking into each other.

### Don't:
- **Don't** introduce a gradient, a pill, an icon tile, a card grid or a centred
  column. All five were removed on purpose and none may return.
- **Don't** add a third ink or an accent hue. The palette is black, green, stock.
- **Don't** add a drop shadow, a hover lift, a scale or a glow. Depth is rules and
  ink.
- **Don't** fake the material with paper textures, grain overlays, noise filters
  or scanned-paper images. The two-plate rule offset is the only material effect
  in the system and it is real geometry. The one material still owed — a
  duplicator-ink raster carrying ink-density variation and stencil fringe —
  is a produced asset, not a filter, and stays undone until it can be produced.
- **Don't** soften this world toward cream, parchment, kraft or lamplight. The
  stock is cool grey.
- **Don't** substitute scaled-down uppercase for small capitals.
- **Don't** set a rule thicker than 1px or invent a fourth rule weight.
- **Don't** treat any device from the outgoing "Patient Tutor" world as a
  precedent when converting a screen — it is the world being replaced, not a
  fallback.
- **Don't** state a metric the code cannot substantiate. Every number on screen —
  vocabulary size, object classes — must trace to the source, and no accuracy or
  latency figure exists to cite.
