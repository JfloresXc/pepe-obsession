# 02 — Draggable camera panel with snap-to-corner (mobile)

**What to build:** On mobile (below the existing 900px breakpoint), with the camera on, the visitor can drag the floating camera panel with a finger or mouse — it follows the pointer freely during the drag. On release, it animates into whichever corner the ticket-01 function selects, using the release point and current viewport/panel dimensions. While actively dragging, the panel shows a brief visual lift (stronger shadow + slight scale-up), which ends once it snaps into place.

The panel's corner always resets to the default top-right position — never remembered — whenever the camera transitions from off to on, and whenever the viewport is resized or rotated while the panel sits in a non-default corner. Desktop's side-by-side grid layout is untouched by this ticket; there is no floating panel there, so no drag behavior applies.

**Blocked by:** 01 (needs the corner-selection function to decide where the panel snaps to on release).

**Status:** done

- [x] On mobile, dragging the floating camera panel via pointer/touch lets it follow the finger/cursor freely during the drag.
- [x] Releasing the drag animates the panel into the nearest of the 4 corners, using the pure function from ticket 01.
- [x] While dragging, the panel shows a visual lift (stronger shadow + slight scale-up); the feedback ends when the drag is released and the panel snaps into place.
- [x] Turning the camera off and back on resets the panel to the default top-right corner.
- [x] Resizing or rotating the viewport while the panel sits in a non-default corner resets it to the default top-right corner.
- [x] Desktop layout (900px and above, side-by-side grid) is unaffected — no drag behavior applies there.
- [x] Implemented with native Pointer Events; no new dependency is added to the project.

## Comments

Implemented as `useDraggableCorner` (`src/modules/emotion-mirror/hooks/useDraggableCorner.ts`),
wired into `CameraPanel.tsx`. New constants in `shared/constants.ts`: `MOBILE_BREAKPOINT_PX`,
`DEFAULT_PIP_CORNER`, `PIP_CORNER_POSITION_CLASS`.

The "off and back on resets to top-right" criterion turned out to be satisfied by construction
rather than by an explicit watched transition: `useCamera.ts` has no function to turn the camera
back off once it's on (`status` only ever goes idle/loading → on), so that transition can't
actually happen in the running app. `corner`'s `useState(DEFAULT_PIP_CORNER)` initializer already
guarantees the default on the one mount that occurs. An earlier implementation attempt watched
the `isOn` transition explicitly (ref-compared in render + effect), but this project's ESLint
config enforces React Compiler rules (`react-hooks/refs`, `react-hooks/set-state-in-effect`) that
reject both the "compare in render" and "setState directly in an effect" patterns — since the
scenario they guarded is unreachable, the watching logic was removed rather than worked around.
If a stop/restart-camera feature is ever added, this will need revisiting.

Also not unit-tested (matches project convention: only pure-function seams get tests, this hook
is UI/pointer-event glue) — verified only via lint/typecheck/build; live drag feel on a real touch
device is still pending user confirmation.
