# Pepe Obsession

A web app that reads the visitor's facial expression from their webcam and mirrors it back as a
Preset reaction image (or an emoji placeholder) of "Pepe". Client-side only — no camera frame,
image, or detection result is ever sent to a server. Spanish UI.

See [`CONTEXT.md`](./CONTEXT.md) for the domain glossary (`Emotion`, `Preset image`) and
[`DESIGN.md`](./DESIGN.md) for the visual/brand notes.

## Getting started

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
bun run test    # Vitest — unit tests for the pure resolveReaction / resolveNearestCorner seams
bun run lint    # ESLint
bun run build   # production build (also runs the TypeScript check)
```

## How it works

- The visitor turns on their camera (`emotion-mirror` module's `CameraPanel`).
- `@mediapipe/tasks-vision`'s `FaceLandmarker` classifies facial blendshapes client-side, every
  400ms, into one of the four target Emotions (`feliz`, `triste`, `enojado`, `asustado`) or the
  `neutral` fallback — see ADR [0001](./docs/adr/0001-mediapipe-for-gesture-detection.md) for why
  MediaPipe was chosen over the design mockup's `face-api.js`.
- The reaction panel shows a Preset image for the detected Emotion if the site owner has supplied
  one under `public/pepe/<emotion>/`, otherwise an emoji fallback.

## Project structure

Screaming architecture per [`AGENTS.md`](./AGENTS.md):

- `src/modules/emotion-mirror/` — the feature: components, hooks (camera access, detection loop,
  drag-to-corner), and the pure `lib/` seams (`resolveReaction`, `resolveNearestCorner`).
- `src/shared/` — cross-cutting: the Spanish copy dictionary, tuning/UI constants, `Alert`, `Nav`,
  `Footer`.
- `src/core/` — reserved for app-wide concerns; not created yet, since nothing beyond
  `app/layout.tsx` has needed it so far.

## Docs and process

- **Domain glossary + ADRs**: [`CONTEXT.md`](./CONTEXT.md), [`docs/adr/`](./docs/adr/) — see
  [`docs/agents/domain.md`](./docs/agents/domain.md).
- **Issue tracker**: local markdown tickets under [`.scratch/`](./.scratch/), one directory per
  feature (`emotion-mirror/`, `camera-pip-drag/`), each with a `spec.md` and numbered `issues/`.
  See [`docs/agents/issue-tracker.md`](./docs/agents/issue-tracker.md).
- **Design notes**: [`DESIGN.md`](./DESIGN.md).
