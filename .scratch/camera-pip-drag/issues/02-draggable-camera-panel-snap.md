# 02 — Draggable camera panel with snap-to-corner (mobile)

**What to build:** On mobile (below the existing 900px breakpoint), with the camera on, the visitor can drag the floating camera panel with a finger or mouse — it follows the pointer freely during the drag. On release, it animates into whichever corner the ticket-01 function selects, using the release point and current viewport/panel dimensions. While actively dragging, the panel shows a brief visual lift (stronger shadow + slight scale-up), which ends once it snaps into place.

The panel's corner always resets to the default top-right position — never remembered — whenever the camera transitions from off to on, and whenever the viewport is resized or rotated while the panel sits in a non-default corner. Desktop's side-by-side grid layout is untouched by this ticket; there is no floating panel there, so no drag behavior applies.

**Blocked by:** 01 (needs the corner-selection function to decide where the panel snaps to on release).

**Status:** ready-for-agent

- [ ] On mobile, dragging the floating camera panel via pointer/touch lets it follow the finger/cursor freely during the drag.
- [ ] Releasing the drag animates the panel into the nearest of the 4 corners, using the pure function from ticket 01.
- [ ] While dragging, the panel shows a visual lift (stronger shadow + slight scale-up); the feedback ends when the drag is released and the panel snaps into place.
- [ ] Turning the camera off and back on resets the panel to the default top-right corner.
- [ ] Resizing or rotating the viewport while the panel sits in a non-default corner resets it to the default top-right corner.
- [ ] Desktop layout (900px and above, side-by-side grid) is unaffected — no drag behavior applies there.
- [ ] Implemented with native Pointer Events; no new dependency is added to the project.
