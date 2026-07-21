# 02 — Emotion detection drives the reaction panel (emoji fallback)

**What to build:** With the camera feed already live (ticket 01), the app loads MediaPipe's `FaceLandmarker` model client-side and continuously reads the camera feed to classify the visitor's facial expression into one of the target Emotions (`feliz`, `triste`, `enojado`, `asustado`) or the `neutral` fallback when confidence is too low. The reaction panel updates in real time to show the emoji matching the detected Emotion. If the model fails to load, a visible alert tells the visitor detection isn't available, instead of the app silently doing nothing.

The classification and reaction-selection logic lives behind a single pure-function seam (`resolveReaction`-style: blendshape scores + a preset manifest in, `{ emotion, imageSrc | null }` out) so it can be unit-tested with blendshape fixtures and a fake manifest, without a real camera or the ML model. In this ticket the manifest is always empty, so the seam always returns the emoji-fallback path (`imageSrc: null`) — real Preset images arrive in ticket 03.

**Blocked by:** 01 (needs the live camera feed to detect against).

**Status:** done

- [x] Smiling at the camera shows Pepe's `feliz` emoji in the reaction panel.
- [x] A sad expression shows the `triste` emoji.
- [x] An angry expression shows the `enojado` emoji.
- [x] A scared/surprised expression shows the `asustado` emoji.
- [x] An ambiguous or low-confidence expression falls back to the `neutral` emoji rather than guessing.
- [x] If the face-detection model fails to load, a visible alert explains detection isn't available.
- [x] The blendshape→Emotion classification and image/emoji selection logic is isolated in one pure function, unit-tested for: each of the four target Emotions being clearly detected, and a low-confidence/ambiguous case falling back to `neutral`.
- [x] Detection tuning values (confidence threshold, detection tick interval) are defined as constants in `shared/`, not hardcoded inline.

## Comments

Two rounds of live-camera tuning on `classifyEmotion` in `resolveReaction.ts`, both driven by
real user feedback rather than guesswork (the original weights were reasoned from typical
blendshape magnitudes, not measured):

1. **First pass**: the original scoring averaged each Emotion's contributing blendshape signals
   together (e.g. `triste = frown*0.7 + browInnerUp*0.3`), which under-detected real faces — only
   `feliz` reliably cleared the threshold in practice. Fixed by taking the **max** of each
   candidate's contributing signals instead of a weighted average, and lowering
   `DETECTION_CONFIDENCE_THRESHOLD` from 0.5 to 0.35. Added 3 regression tests for single-signal
   (subtle, realistic) expressions.
2. **Second pass**: even with the max-based scoring, `triste`/`enojado` flickered on and off in
   practice (appeared then immediately reverted to neutral), and `triste` specifically was harder
   to trigger at all. Root cause: `feliz`/`asustado` rest on strong blendshapes (mouth smile,
   eye-wide) that clear the threshold with a comfortable margin, while `triste`/`enojado` rest on
   inherently weaker ones (mouth frown, brow-down), so ordinary per-frame webcam noise bounced them
   across a shared threshold. Fixed two ways: (a) `classifyEmotion` now uses a **per-emotion
   threshold** (`triste` −0.10, `enojado` −0.05 off the base `DETECTION_CONFIDENCE_THRESHOLD`,
   `feliz`/`asustado` unchanged), with 2 new regression tests; (b) `useEmotionDetector` now **holds**
   the last detected non-neutral reaction on screen for `NEUTRAL_HOLD_MS` (900ms) before reverting
   to neutral, so a single noisy tick reading neutral doesn't flicker the display — a genuinely
   different strong Emotion signal still overrides immediately, only the neutral-revert is damped.
   This hold logic lives in the hook (not unit-tested, per this project's convention that only the
   pure `resolveReaction` seam gets tests); confirm live-camera feel if it needs further iteration.
