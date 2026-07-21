Status: done

# Camera PiP drag-to-corner

## Problem Statement

On mobile, once the camera is on, the app shows a small floating "picture-in-picture" camera
panel fixed to the top-right corner (shipped in `emotion-mirror` ticket 04). The user liked this,
but wanted it draggable to any of the 4 screen corners — the way a WhatsApp video-call PiP window
can be dragged and snapped around the screen.

## Solution

A pure function decides which of the 4 corners a released drag should snap to; a hook wires native
Pointer Events to that function and to the existing floating panel. Desktop is unaffected — there
is no floating panel there.

## Decisions (from the grilling session)

1. **Snap-to-corner, not free position** — on release, the panel animates to the nearest of the 4
   corners, matching the WhatsApp reference. No arbitrary/free resting positions.
2. **Never persisted** — the corner always resets to the default (top-right) whenever the camera
   turns on, and on viewport resize/rotation. Simpler than remembering the user's last choice.
3. **Native Pointer Events, no new dependency** — the interaction is narrow enough (one element,
   4 target positions, no multi-touch gestures) that a small hand-written hook was preferred over
   `react-draggable`/`@use-gesture/react`.
4. **The corner-selection logic is a tested pure seam** — `resolveNearestCorner` (position +
   viewport + panel size → corner) is unit-tested, following this project's established
   `resolveReaction`-style seam pattern. The pointer-event wiring itself is UI glue and untested,
   also per project convention.
5. **Visual feedback while dragging** — a slight shadow + scale lift while the finger/cursor holds
   the panel, with a smooth transition back to the rest position on release.
6. No ADR was written for this feature — the native-vs-library choice is a real trade-off, but it's
   easy to reverse and not particularly surprising, so it didn't clear the bar for one.

## Implementation Decisions

- **Corner-selection seam**: `resolveNearestCorner(panelPosition, viewport, panel) => Corner` in
  `src/modules/emotion-mirror/lib/resolveNearestCorner.ts` — pure, no DOM/browser APIs.
- **Drag hook**: `useDraggableCorner` in `src/modules/emotion-mirror/hooks/useDraggableCorner.ts` —
  `setPointerCapture`-based drag tracking, gated to only activate below the mobile breakpoint via
  `matchMedia`, plus a `resize` listener that resets to the default corner.
- **New constants** (`src/shared/constants.ts`): `MOBILE_BREAKPOINT_PX` (899, mirrors the existing
  Tailwind `max-[899px]` breakpoint already used throughout `CameraPanel.tsx`), `DEFAULT_PIP_CORNER`
  (`"top-right"`), `PIP_CORNER_POSITION_CLASS` (a `Corner → Tailwind classes` dictionary, margins
  mirrored from the already-tuned top-right offsets).
- **Wired into** `CameraPanel.tsx`: the drag transform and lift are applied via inline `style`
  (not Tailwind transform utility classes, to avoid inline-style/class conflicts while dragging
  every pointermove tick), while the resting corner position still uses Tailwind position classes.

## Testing Decisions

- `resolveNearestCorner` is the only unit-tested module: 5 tests (one per quadrant, plus a
  deterministic center-boundary case).
- `useDraggableCorner` (pointer capture, `matchMedia` gating, resize handling) is UI/timing glue
  and is not unit-tested, matching how `useCamera`/`useEmotionDetector` are also untested — verified
  via lint, `tsc --noEmit`, and `next build` only.
- No browser/screenshot tool is available in this environment, so the actual drag feel on a real
  touch device is still pending live confirmation from the user.

## Out of Scope / Notes

- **"Turn camera off and back on" never actually happens in this app** — `useCamera.ts` has no
  function to stop the camera once it's on (`status` only ever moves idle/loading → on). The
  reset-on-toggle acceptance criterion is satisfied by construction (the `corner` state's initial
  value), not by watching a transition — see ticket 02's Comments for why an explicit
  transition-watching implementation was tried and reverted (this repo's ESLint config enforces
  React Compiler rules that reject both the "ref-compare in render" and "setState in an effect"
  patterns for it). If a stop/restart-camera feature is ever added, this will need revisiting.
- Desktop (≥900px, side-by-side grid) was intentionally left untouched — no floating panel exists
  there, so dragging doesn't apply.

## Further Notes

- Relevant prior work: `emotion-mirror` ticket 04 shipped the original fixed top-right PiP corner
  this feature makes draggable. See [`../emotion-mirror/issues/04-responsive-layout-and-footer.md`](../emotion-mirror/issues/04-responsive-layout-and-footer.md).
