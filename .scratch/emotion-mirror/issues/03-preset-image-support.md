# 03 — Preset image support

**What to build:** When the site owner drops one or more Preset images into an Emotion's folder, the reaction panel shows a real image instead of that Emotion's emoji — choosing one at random each time a folder has more than one image. This wires real artwork into the `resolveReaction` seam introduced in ticket 02, which already supports returning an image path instead of the emoji-fallback `null`.

The set of available images per Emotion is resolved at build time (not via runtime filesystem access, since detection runs in the browser).

**Blocked by:** 02 (the seam and reaction panel must already exist and handle the emoji-fallback case).

- [ ] An Emotion folder with zero images continues to show that Emotion's emoji (no regression from ticket 02).
- [ ] An Emotion folder with exactly one image always shows that image when the Emotion is detected.
- [ ] An Emotion folder with multiple images shows one of them at random each time the Emotion is (re-)detected.
- [ ] Random selection is unit-tested deterministically (inject/seed the randomness source; assert membership in the valid set, not a specific value) for the empty/single/multiple cases.
- [ ] Image manifest resolution happens at build time, not through a runtime filesystem read.
