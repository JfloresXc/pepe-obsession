# 02 — Emotion detection drives the reaction panel (emoji fallback)

**What to build:** With the camera feed already live (ticket 01), the app loads MediaPipe's `FaceLandmarker` model client-side and continuously reads the camera feed to classify the visitor's facial expression into one of the target Emotions (`feliz`, `triste`, `enojado`, `asustado`) or the `neutral` fallback when confidence is too low. The reaction panel updates in real time to show the emoji matching the detected Emotion. If the model fails to load, a visible alert tells the visitor detection isn't available, instead of the app silently doing nothing.

The classification and reaction-selection logic lives behind a single pure-function seam (`resolveReaction`-style: blendshape scores + a preset manifest in, `{ emotion, imageSrc | null }` out) so it can be unit-tested with blendshape fixtures and a fake manifest, without a real camera or the ML model. In this ticket the manifest is always empty, so the seam always returns the emoji-fallback path (`imageSrc: null`) — real Preset images arrive in ticket 03.

**Blocked by:** 01 (needs the live camera feed to detect against).

- [ ] Smiling at the camera shows Pepe's `feliz` emoji in the reaction panel.
- [ ] A sad expression shows the `triste` emoji.
- [ ] An angry expression shows the `enojado` emoji.
- [ ] A scared/surprised expression shows the `asustado` emoji.
- [ ] An ambiguous or low-confidence expression falls back to the `neutral` emoji rather than guessing.
- [ ] If the face-detection model fails to load, a visible alert explains detection isn't available.
- [ ] The blendshape→Emotion classification and image/emoji selection logic is isolated in one pure function, unit-tested for: each of the four target Emotions being clearly detected, and a low-confidence/ambiguous case falling back to `neutral`.
- [ ] Detection tuning values (confidence threshold, detection tick interval) are defined as constants in `shared/`, not hardcoded inline.
