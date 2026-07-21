# 03 — Preset image support

**What to build:** When the site owner drops one or more Preset images into an Emotion's folder, the reaction panel shows a real image instead of that Emotion's emoji — choosing one at random each time a folder has more than one image. This wires real artwork into the `resolveReaction` seam introduced in ticket 02, which already supports returning an image path instead of the emoji-fallback `null`.

The set of available images per Emotion is resolved at build time (not via runtime filesystem access, since detection runs in the browser).

**Blocked by:** 02 (the seam and reaction panel must already exist and handle the emoji-fallback case).

**Status:** done

- [x] An Emotion folder with zero images continues to show that Emotion's emoji (no regression from ticket 02).
- [x] An Emotion folder with exactly one image always shows that image when the Emotion is detected.
- [x] An Emotion folder with multiple images shows one of them at random each time the Emotion is (re-)detected.
- [x] Random selection is unit-tested deterministically (inject/seed the randomness source; assert membership in the valid set, not a specific value) for the empty/single/multiple cases.
- [x] Image manifest resolution happens at build time, not through a runtime filesystem read.

## Comments

Real Preset images were added: `public/pepe/{feliz,triste,enojado,asustado,neutral}/`, one image
each, sourced from stills of the movie *Obsession* (see `DESIGN.md`) rather than a Pepe-the-frog
meme — the images were originally dropped under `public/gestures/` with English filenames
(`happy.jpeg`, `sad.jpeg`, `angry.jpg`, `scared.jpeg`, `neutral.jpeg`) and moved into the
per-Emotion folders this ticket's manifest expects. No code change was needed for the manifest
itself (`presetManifest.ts` picked them up automatically on rebuild), but `useEmotionDetector.ts`'s
camera-off idle reaction was separately fixed to resolve through the manifest too (it previously
hardcoded `imageSrc: null`, always showing the neutral emoji even before the camera turned on,
ignoring any real neutral preset). The zero-images case is currently only exercised via the unit
tests, since all five folders now have exactly one image each.
