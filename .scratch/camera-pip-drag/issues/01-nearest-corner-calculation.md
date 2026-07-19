# 01 — Nearest-corner calculation

**What to build:** A pure function that, given the point where the visitor released a drag (plus the viewport dimensions and the floating panel's dimensions), determines which of the four screen corners — top-left, top-right, bottom-left, or bottom-right — the floating camera panel should snap to. No UI or pointer-event wiring yet; this ticket only produces the decision logic behind the eventual snap behavior, verifiable through its own tests.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Function signature takes the release point, viewport size, and panel size, and returns one of four corner identifiers (`top-left` | `top-right` | `bottom-left` | `bottom-right`).
- [ ] Unit tests cover a clear case for each of the four quadrants of the viewport.
- [ ] Unit tests cover a boundary/near-center case (release point roughly equidistant between two corners) with a deterministic expected result.
- [ ] The function is pure — no DOM/browser APIs, no side effects — so it's testable with plain numeric inputs and no jsdom.
