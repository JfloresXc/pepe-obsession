Status: ready-for-agent

# Pepe Obsession — Emotion Mirror

## Problem Statement

The user wants a playful, single-purpose web app: someone turns on their webcam, makes a facial expression (smile, sad face, angry face, scared face), and instantly sees a matching "Pepe" reaction image appear next to their own live camera feed — as if Pepe is mirroring their emotion back at them. Today there is no app, and none of the reaction images exist yet either.

## Solution

A two-panel page: the left panel shows the user's live camera feed (mirrored, like a real mirror), the right panel shows Pepe's reaction. A client-side face-landmark model continuously classifies the user's facial expression into one of four target Emotions (`feliz`, `triste`, `enojado`, `asustado`) or a `neutral` fallback, and the right panel updates to show a Preset image for that Emotion. Until real Preset images are supplied, the right panel shows a fixed emoji per Emotion instead. Everything runs locally in the browser — no video or image data is ever uploaded.

## User Stories

1. As a visitor, I want to see a clear "turn on camera" call-to-action before anything activates, so that I understand the app requires camera access up front.
2. As a visitor, I want to grant camera permission and immediately see my own live video feed, so that I know the camera is working.
3. As a visitor, I want the video feed mirrored (like a real mirror), so that my movements feel natural instead of reversed.
4. As a visitor, I want to smile at the camera and see Pepe's "feliz" reaction appear, so that I feel the app is responding to me.
5. As a visitor, I want to make a sad face and see Pepe's "triste" reaction appear.
6. As a visitor, I want to make an angry face and see Pepe's "enojado" reaction appear.
7. As a visitor, I want to make a scared/surprised face and see Pepe's "asustado" reaction appear.
8. As a visitor, I want Pepe to show a neutral reaction when my expression doesn't clearly match any of the four target Emotions, so that the app doesn't guess wildly at low confidence.
9. As a visitor, I want to see an emoji reaction in place of a real image when no Preset image has been supplied yet for the detected Emotion, so that the app still feels complete before real artwork is added.
10. As a visitor, if multiple Preset images exist for the same Emotion, I want to see a varied (randomly chosen) one each time, so that repeated visits/detections don't feel repetitive.
11. As a visitor, if I deny camera permission, I want a clear, visible alert explaining that camera access was denied, so that I understand why nothing is happening.
12. As a visitor, if my device has no camera or the camera is in use by another app, I want a clear, visible alert describing the specific problem.
13. As a visitor, if the face-detection model fails to load, I want a visible alert telling me detection isn't available, rather than the app silently doing nothing.
14. As a visitor, I want the whole experience on a single page with no extra navigation, so that I can start immediately.
15. As a visitor using a phone, I want the layout to adapt to a mobile-first, responsive design, so that the experience works well on a small screen.
16. As the site owner, I want a small footer on the page, per the project's UI conventions.
17. As a developer, I want the blendshape→Emotion classification and Preset-image selection logic isolated in a single pure function, so that the core behavior can be tested without a real camera, browser APIs, or the ML model.
18. As a developer, I want all Spanish UI copy centralized in one shared dictionary, so that strings aren't scattered across components.
19. As a developer, I want detection tuning values (confidence threshold, detection interval) defined as constants in `shared/`, not hardcoded inline, so they can be adjusted in one place.
20. As a developer, I want the feature organized under a single `emotion-mirror` module following the project's screaming-architecture convention (`modules/`, `shared/`, `core/`), so the codebase stays consistent with `AGENTS.md`.

## Implementation Decisions

- **Detection library**: `@mediapipe/tasks-vision`, using `FaceLandmarker` configured to output blendshapes. Chosen over `face-api.js` (used only in the design mockup) for active maintenance and clean npm/Next.js integration. See ADR-0001.
- **Domain terminology**: "Emotion" (`emotion`) is the technical/domain term used in all code, folder names, and the domain model. "Gesto" is reserved for user-facing Spanish copy only (e.g. header/button text) and never appears in identifiers.
- **Emotion set**: exactly `feliz`, `triste`, `enojado`, `asustado`, plus `neutral` as the fallback when no Emotion clears the detection confidence threshold.
- **Core seam**: a single pure function, `resolveReaction(blendshapeScores, presetManifest) => { emotion, imageSrc | null }`, contains all the business logic — classifying blendshapes into an Emotion, then selecting a Preset image (or `null`, meaning "show the emoji fallback") from the manifest for that Emotion. This function has no dependency on the camera, DOM, React, or MediaPipe's runtime — it's pure data in, data out. Everything else (camera access, the MediaPipe detection loop, rendering) is thin glue around it.
- **Preset image storage**: `public/pepe/<emotion>/`, one subfolder per Emotion (`feliz/`, `triste/`, `enojado/`, `asustado/`, `neutral/`). A folder may contain zero, one, or several images.
  - Zero images → the module's emoji fallback is shown in the same panel position.
  - One image → always shown for that Emotion.
  - Multiple images → one is picked at random on each detection.
  - The manifest of available images per Emotion is resolved at build time (not via runtime filesystem access, since this runs in the browser).
- **Emoji fallback set**: `feliz` → 😄, `triste` → 😢, `enojado` → 😠, `asustado` → 😱, `neutral` → 😐.
- **Module structure** (screaming architecture per `AGENTS.md`):
  - `src/modules/emotion-mirror/` — feature-specific code: `components/` (camera panel, reaction panel), `hooks/` (camera access, detection loop wiring), `lib/` (the `resolveReaction` seam and its helpers).
  - `src/shared/` — cross-cutting concerns: a shared `Alert` component, the UI copy dictionary, and tuning constants (confidence threshold, detection tick interval, emoji map).
  - `src/core/` — app-wide setup (layout-level concerns), used only if/when something app-wide is actually needed beyond what `app/layout.tsx` already provides.
- **Alert integration** (`AGENTS.md` "service alert" rule): the shared `Alert` component is triggered for (1) camera permission denied/unavailable/in-use errors, and (2) MediaPipe model load failure. Both cases previously produced silent or console-only failures in the design mockup; the real app must surface them visibly to the user.
- **Copy dictionary** (`AGENTS.md` "dictionaries" rule): all Spanish UI strings (headers, button labels, status/alert messages) live in one dictionary object in `shared/`, referenced by key from components — no literal UI strings inline in component JSX.
- **No user-facing settings**: mirror is always on, confidence score is never displayed, and the detection confidence threshold / tick interval are fixed constants — there is no settings panel, unlike the design tool's editable props.
- **Routing**: `app/page.tsx` is the entire experience (two-panel camera + reaction layout), replacing the current Next.js starter content. No additional routes/pages.
- **Camera**: requested with `facingMode: 'user'` (front-facing), video mirrored via CSS transform, consistent with the design mockup.
- **Privacy**: all video processing and Emotion detection happens client-side; no frame, image, or detection result is ever sent to a server.

## Testing Decisions

- Good tests here exercise `resolveReaction` purely through its input/output contract — feed it fixture blendshape score objects (representing "clearly smiling," "ambiguous/low-confidence," "clearly angry," etc.) and fake preset manifests (empty, single-image, multi-image), and assert on the returned `{ emotion, imageSrc }` — never on internal implementation details like which blendshape keys were summed.
- Cases to cover: each of the four target Emotions being clearly detected; a low-confidence/ambiguous case falling back to `neutral`; an Emotion with zero presets returning `imageSrc: null` (emoji fallback path); an Emotion with one preset always returning that preset; an Emotion with multiple presets returning one of the valid options (random selection — assert membership, not a specific value, and inject/seed the randomness source so the test is deterministic).
- `resolveReaction` and its helpers in `src/modules/emotion-mirror/lib/` are the only modules under direct test. The camera hook, MediaPipe wiring, and rendered components are thin glue and are not unit-tested directly.
- No prior test setup exists in this repo yet (fresh `create-next-app` scaffold with no test runner configured) — this feature will introduce the first tests, so use whatever the `/tdd` skill's conventions call for.

## Out of Scope

- Uploading, cropping, or managing Preset images through the UI — images are added manually to `public/pepe/<emotion>/` by the site owner.
- Any settings/configuration panel for the end user.
- Server-side or backend processing of any kind — this is a fully client-side app.
- Support for Emotions beyond the four target ones plus neutral (e.g. no "disgusted," "surprised" as a distinct category — "asustado" already folds in surprise-like expressions).
- Internationalization/multi-language support (the copy dictionary centralizes strings for maintainability, but only Spanish copy is written now).
- Recording, saving, or sharing snapshots/reactions.

## Further Notes

- The `references/` folder (a design-tool export: `Pepe Obsession.dc.html`, `support.js`, `image-slot.js`, `.image-slots.state.json`, plus sample images under `references/uploads/`) is a visual/behavioral design reference only — it is not production code and should not be imported or reused directly. It fixed the visual design (warm color palette, two-panel grid, Spanish copy tone, IBM Plex Mono accents) and the rough behavioral shape (live badge, detection caption, per-Emotion reaction slot), which the real implementation should match visually without reusing its `face-api.js`-based logic or its `x-dc`/`image-slot` custom elements.
- `AGENTS.md` also carries a top-level instruction to read `node_modules/next/dist/docs/` before writing Next.js code, since this project's Next.js version has breaking changes versus training-data assumptions — the implementer should do this before scaffolding `app/page.tsx` and any client-component boundaries needed for camera/MediaPipe access.
- Relevant prior decisions: [ADR-0001](../../docs/adr/0001-mediapipe-for-gesture-detection.md) (MediaPipe over face-api.js), and the domain glossary in [CONTEXT.md](../../CONTEXT.md) (Emotion, Preset image terms).
