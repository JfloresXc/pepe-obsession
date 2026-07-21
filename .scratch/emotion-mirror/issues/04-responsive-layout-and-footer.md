# 04 — Responsive layout polish + footer

**What to build:** The finished page shape: a mobile-first, responsive two-panel layout (camera panel + reaction panel) that adapts down to a compact "camera corner" arrangement on small screens, matching the visual language of the design reference in `references/`. A small footer appears on the page per the project's UI conventions.

This is a layout/visual pass — it needs both panels to exist (from ticket 02) but does not depend on real Preset images being present.

**Blocked by:** 02 (both panels must exist to arrange responsively).

**Status:** done

- [x] On wide viewports, the camera panel and reaction panel are laid out side by side.
- [x] On narrow (mobile) viewports, the layout adapts to a compact arrangement (e.g. camera shrinks to a corner element) rather than simply stacking awkwardly or overflowing.
- [x] The page includes a small footer, styled consistently with the rest of the page.
- [x] Layout and footer work correctly whether or not any Preset images have been added yet.

## Comments

The desktop two-panel width (`app/page.tsx`'s container `max-w`) went through several live
iterations — 1024px → 1600px → 1280px → settled on `max-w-[1180px]`, user-confirmed. Later in a
follow-up session, the panels' `min-h-[min(56vh,540px)]` was found to be a floor only, not a
ceiling — on a tall desktop viewport `flex-1` could stretch the boxes taller than intended. Added
`min-[900px]:max-h-[min(56vh,540px)]` to both `CameraPanel.tsx` and `ReactionPanel.tsx` so desktop
height is genuinely fixed/capped, not just floored; mobile's own height overrides were left
untouched. The "camera shrinks to a corner element" mobile arrangement later grew its own feature
— see `camera-pip-drag` — adding drag-to-any-corner on top of the fixed top-right corner this
ticket shipped.
