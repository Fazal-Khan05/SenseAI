---
name: Sense AI
description: A calm, on-device sign-language practice tool that shows a learner what it sees.
colors:
  clarity-blue: "#4F9CF9"
  clarity-blue-light: "#7BB8FB"
  clarity-blue-dark: "#3A7FD5"
  focus-violet: "#A084E8"
  focus-violet-light: "#BFA8F0"
  attention-coral: "#FF6B81"
  attention-coral-light: "#FF8FA0"
  page: "#F9FAFC"
  page-alt: "#F1F3F8"
  card: "#FFFFFF"
  ink: "#2D2D2D"
  ink-secondary: "#6B7280"
  ink-muted: "#9CA3AF"
  border: "#E5E7EB"
  confirm-green: "#10B981"
  error-red: "#EF4444"
  caution-amber: "#F59E0B"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-1px"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.clarity-blue}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "12px 28px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.clarity-blue-dark}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.clarity-blue}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  button-outline-hover:
    backgroundColor: "{colors.clarity-blue}"
    textColor: "#FFFFFF"
  button-accent:
    backgroundColor: "{colors.attention-coral}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: "32px"
  card-glass:
    rounded: "{rounded.lg}"
    padding: "40px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
  input-focus:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
---

# Design System: Sense AI

## Overview

**Creative North Star: "The Patient Tutor"**

Sense AI watches a learner practise American Sign Language and tells them what it
saw. That job sets the entire visual temperature: the interface is a practice
partner, never an examiner. A sign that does not register is the most common
event in the product, so every surface is built so that outcome reads as *try
again* rather than *you failed*. There are no red error states in the detection
flow, no buzzers, no score. When the recogniser is unsure it simply says so, in
the same calm voice it uses when it succeeds.

The palette is soft and cool — a blue-to-violet gradient does the signalling
work, with a single warm coral reserved for genuine attention. Surfaces are
light, generously padded and gently rounded; nothing is sharp enough to read as
a warning. Depth comes from soft ambient shadow rather than hard edges or
outlines, so panels feel like stacked paper on a bright desk. Type is a single
family, Inter, working across a wide weight range: heavy and tightly tracked for
display, light and airy for body, so hierarchy is unmistakable without a second
typeface.

Four things this is deliberately not. Not **clinical medical software** — no
sterile greys, dense grids, or the coldness of a machine assessing you. Not
**consumer AI hype** — no neon-on-black, no glowing orbs, no spectacle made of
the technology. Not a **generic dashboard template** — no boxed widget grid with
a camera bolted into one cell. Not a **childish learning app** — no mascots, no
bouncy motion, no gamified badges; learners are adults and the tone stays
respectful. All four were confirmed as anti-references.

**Key Characteristics:**
- Cool blue-violet gradient as the signal; one warm coral held in reserve
- Fully rounded (pill) actions and 16px surfaces — nothing sharp
- Soft ambient shadow for depth; no hard borders carrying structure
- One typeface, wide weight range, tight display tracking
- Light and dark are equal citizens, driven entirely by tokens
- The interface explains what it measured rather than only what it concluded

## Colors

A cool, low-saturation palette where blue and violet carry the product's signal
and a single warm coral is the only heat on screen.

### Primary
- **Clarity Blue** (`{colors.clarity-blue}`): The product's voice. Primary
  actions, focus rings, active navigation, confidence fills, and the left end of
  every gradient. It marks the thing the learner should look at or act on.
- **Clarity Blue Dark** (`{colors.clarity-blue-dark}`): Pressed and hovered
  states of primary actions only.

### Secondary
- **Focus Violet** (`{colors.focus-violet}`): Never appears alone. It is the
  right end of the primary gradient, giving flat blue depth and motion across a
  button or a progress fill.

### Tertiary
- **Attention Coral** (`{colors.attention-coral}`): The only warm colour in the
  system. Object detection's accent, and the threshold marker on the motion
  meter. Its scarcity is what makes it work.

### Neutral
- **Ink** (`{colors.ink}`): Body and heading text. Doubles as the footer surface
  in light mode.
- **Ink Secondary** (`{colors.ink-secondary}`): Supporting copy, inactive
  navigation, ghost-button text.
- **Ink Muted** (`{colors.ink-muted}`): Metadata, hints, measured values, and
  resting form labels — text that is present but not competing.
- **Page** / **Page Alt** (`{colors.page}`, `{colors.page-alt}`): The ground and
  its alternating section band.
- **Card** (`{colors.card}`): Every raised surface.
- **Border** (`{colors.border}`): Input strokes and dividers.

### Named Rules

**The Warm-Once Rule.** Coral is the only warm hue in the system, and no screen
carries more than one coral element. If a second thing needs emphasis, it takes
Clarity Blue.

**The Theme-Token Rule.** Every surface, border and shadow reads from a
theme-aware token. Hardcoding a literal colour in a component is how dark mode
breaks: the value cannot follow the theme, so it needs a hand-written
`[data-theme="dark"]` patch, and the next component needs another one. There are
zero such patches in this system and there must stay zero.

**The No-Alarm Rule.** `{colors.error-red}` is reserved for form validation and
load failures. Detection never uses it: an unrecognised sign is an ordinary
outcome of practice, not an error.

## Typography

**Display Font:** Inter (with `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif)
**Body Font:** Inter — the same family throughout
**Label/Mono Font:** Inter for labels; a system monospace stack (`ui-monospace`,
`SFMono-Regular`, Menlo) is used only for the raw ASL gloss line, where it marks
machine output against human-readable English.

**Character:** Confident and editorial. One family carries everything, so
hierarchy comes entirely from weight and tracking: 800 with `-1px` tracking for
display gives headings real presence, and the drop to 400 at a 1.6 line-height
for body makes the contrast the point.

### Hierarchy
- **Display** (800, 3rem, 1.15, `-1px`): Hero headline. One per page, never
  repeated below the fold.
- **Headline** (700, 1.875rem, 1.3): Section titles and page-level headings.
- **Title** (700, 1.25rem, 1.4): Card and panel headings.
- **Body** (400, 1rem, 1.6): All running copy. Section subtitles run at 1.125rem
  with a 1.7 line-height and a 600px measure.
- **Label** (600, 0.75rem, `0.04em`): Shape tags, metadata, measured values, and
  chips. Never sentence-length.

### Named Rules

**The One Family Rule.** Inter does every job. A second typeface is not a
missing feature — hierarchy is weight and size, and adding a display face would
break the calm this system depends on.

**The Tight-Display Rule.** Negative tracking (`-1px`) applies only at display
size. Applied to body text it reads as cramped rather than confident.

## Layout

A single centred column, `1200px` maximum, with `24px` gutters that tighten to
`16px` below 768px. Sections breathe at `80px` vertical padding, dropping to
`48px` on small screens. Content alternates between the page ground and
`{colors.page-alt}` to separate sections without drawing a rule between them.

Detection screens use a two-column grid — camera left, output right — that
stacks to a single column below 968px so the camera never gets too small to
frame a hand. Spacing follows an 8px rhythm (`8 / 12 / 16 / 24 / 32 / 48 / 80`);
cards sit at `32px` internal padding and glass panels at `40px`.

Breakpoints are `968px` (detection grid collapse), `768px` (primary mobile
switch: navigation becomes a full-screen overlay, type scale steps down), and
`480px` (final type reduction).

**The Generous-Padding Rule.** Interior padding never drops below `20px` on a
surface that holds text. Tight padding is what makes an interface feel like an
admin panel.

## Elevation & Depth

Soft ambient layering. Depth is atmospheric rather than functional: shadows
establish a gentle sense of stacked paper on a bright ground, and they are
present at rest rather than appearing only on interaction. Borders are
deliberately faint — a translucent hairline at most — because the shadow already
does the separating. Nothing in this system uses a hard outline to carry
structure.

Interactive surfaces deepen and rise slightly on hover (a 2–4px lift), but that
motion reinforces the layering rather than introducing it.

### Shadow Vocabulary
- **Ambient subtle** (`box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)`): Small
  surfaces — sentence panels, inline containers.
- **Ambient standard** (`box-shadow: 0 4px 12px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)`): The
  default for cards and the camera frame.
- **Ambient raised** (`box-shadow: 0 10px 30px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)`): Glass
  panels, and cards under the cursor.
- **Ambient deep** (`box-shadow: 0 20px 50px rgba(0,0,0,0.1)`): Reserved for
  full-attention surfaces.
- **Signal glow** (`box-shadow: 0 4px 14px rgba(79,156,249,0.3)`): Coloured
  shadow beneath primary actions — the only shadow that carries hue.

### Named Rules

**The Softer-In-Dark Rule.** Dark mode does not reuse light-mode shadows. Every
step deepens (0.06 → 0.2 alpha and up) because a shadow tuned for a white ground
disappears on a dark one.

## Shapes

Rounded throughout, and the radius scales with the surface: `8px` for small
inline elements, `12px` for inputs and icon buttons, `16px` for cards and the
camera frame, `24px` for the largest panels. Actions are the exception — every
button is a full pill (`9999px`), which is the system's most recognisable
signature.

Borders are hairlines and mostly translucent, sitting at 50% opacity over the
token colour so they read as an edge rather than a line. The only solid, visible
stroke in the system is the 2px input border, which needs the weight to show
focus state clearly.

**The No-Sharp-Corners Rule.** Nothing in this interface has a square corner. A
right angle reads as a warning or a system dialog, and neither belongs in a
practice tool.

## Components

### Buttons
- **Shape:** Full pill (`9999px`), with `12px 28px` padding at default size,
  `16px 36px` large, `8px 20px` small.
- **Primary:** The blue-to-violet gradient
  (`linear-gradient(135deg, #4F9CF9, #A084E8)`) with white text and a coloured
  signal glow beneath. The gradient, not flat blue, is what makes a primary
  action feel like the system's own voice.
- **Hover / Focus:** Rises 2px, glow deepens; returns flat on `:active`.
  Transitions run at 250ms ease.
- **Outline:** 2px Clarity Blue stroke on transparent, inverting to a solid blue
  fill on hover. Used for the secondary action beside a primary.
- **Accent:** Solid Attention Coral. Object detection's primary action only.
- **Ghost:** Text-only in Ink Secondary, picking up a faint blue wash on hover.
  Navigation and toolbar actions.
- **Disabled:** 50% opacity, no lift, no shadow, `not-allowed` cursor. Disabled
  buttons still read as buttons — they are dimmed, never hidden.

### Cards / Containers
- **Corner Style:** `16px`.
- **Background:** Card white on the page ground.
- **Shadow Strategy:** Ambient standard at rest, ambient raised on hover with a
  4px lift.
- **Border:** A translucent hairline at 50% opacity — present, but doing less
  work than the shadow.
- **Internal Padding:** `32px`, reducing to `24px` below 768px.

### Glass Panels
- **Style:** Semi-opaque card surface at 70% with a 20px backdrop blur and a
  white hairline at 30%. Used for auth screens and any panel floating over the
  decorative background shapes.
- **Padding:** `40px`, the most generous in the system.

### Inputs / Fields
- **Style:** 2px solid border, `12px` radius, `16px 18px` padding, on the
  theme's input surface.
- **Focus:** Border becomes Clarity Blue with a 4px soft blue halo
  (`0 0 0 4px rgba(79,156,249,0.1)`) — a glow, never a hard ring.
- **Label:** Floats from centre to the top edge on focus or fill, shrinking to
  label size and taking Clarity Blue. The label sits on the card colour so it
  cleanly interrupts the border it crosses.
- **Error:** A soft red-tinted alert band above the form. The field takes
  `aria-invalid`; it does not turn red.

### Navigation
- **Style:** Pill-shaped ghost links at label size (0.875rem, weight 500) in Ink
  Secondary, taking Clarity Blue with a faint blue wash on hover. The active
  route is blue and carries `aria-current`.
- **Bar:** Transparent over the hero, transitioning to a translucent blurred
  surface once scrolled past 30px.
- **Mobile:** Below 768px the links become a full-screen blurred overlay that
  fades in; the theme toggle and close control stay pinned above it.

### Confidence Bar (signature)
The system's most characteristic element: a `6px` full-radius track filled with
the primary gradient, animating its width over 500ms. It appears wherever the
product reports a measurement — detection confidence, model download progress,
sign hold progress, and live hand speed. One visual idea, reused every time a
number needs to be felt rather than read. The motion meter is its one variant,
adding a coral threshold marker at the point where a value becomes actionable.

### Live Readout (signature)
A horizontal strip beneath the camera carrying pill-shaped label tags for what
the classifier currently measures — handshape, phase, speed. This is the
Patient Tutor made literal: the interface shows its working, so a learner can
see *why* a sign did not register rather than only *that* it did not.

## Do's and Don'ts

### Do:
- **Do** read every colour, surface, border and shadow from a theme token. The
  system has zero `[data-theme="dark"]` component patches; keep it that way.
- **Do** use the primary gradient for primary actions and every measurement
  fill. Flat blue is for strokes and text, not for filled actions.
- **Do** keep actions fully rounded (`9999px`) and surfaces at `16px`.
- **Do** express depth with ambient shadow and let borders stay faint hairlines.
- **Do** give text-bearing surfaces at least `20px` of interior padding.
- **Do** show what was measured, not only what was concluded — confidence,
  phase, and live readings are features, not debug output.
- **Do** keep a visible focus indicator on every interactive element; the base
  reset removes outlines, so `:focus-visible` restores them deliberately.
- **Do** honour `prefers-reduced-motion`: animations collapse to near-zero and
  no content is left stranded at `opacity: 0`.

### Don't:
- **Don't** hardcode a literal colour, surface or border value in a component.
- **Don't** introduce a second typeface. Hierarchy is weight and size.
- **Don't** use a square corner anywhere.
- **Don't** put more than one coral element on a screen, or use coral for
  anything that is not genuine attention.
- **Don't** colour detection failure red. An unrecognised sign is a normal
  outcome of practice.
- **Don't** apply display tracking (`-1px`) below display size.
- **Don't** reuse light-mode shadow values in dark mode.
- **Don't** state a metric the code cannot substantiate — accuracy, latency,
  vocabulary size or user counts. Every number on screen must trace to a real
  measurement.
