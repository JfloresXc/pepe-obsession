# 01 — Camera activation panel

**What to build:** A visitor lands on the page and sees a clear call-to-action to turn on their camera. After clicking it and granting permission, they see their own live video feed, mirrored like a real mirror. If they deny permission, have no camera, or their camera is in use by another app, they see a specific, visible alert explaining the problem instead of the app silently doing nothing.

This ticket also introduces the minimal shared infrastructure this slice needs: the `emotion-mirror` / `shared` / `core` module skeleton (screaming architecture per `AGENTS.md`), a shared `Alert` component, and a shared Spanish copy dictionary — introduced here because this is the first ticket that needs them.

**Blocked by:** None — can start immediately.

**Status:** done

- [x] The page shows a "turn on camera" call-to-action before anything activates.
- [x] Granting permission shows the visitor's own live video feed, mirrored (not reversed).
- [x] Denying permission shows a visible alert with a specific, human-readable message (not a silent failure or console-only error).
- [x] No camera present, or camera already in use by another app, each show their own specific alert message.
- [x] All UI copy (button label, alert messages) comes from the shared copy dictionary, not inline strings.
- [ ] `emotion-mirror`, `shared`, and `core` module folders exist per the project's screaming-architecture convention.

## Comments

`src/core/` was intentionally never created — per the spec's module-structure decision, it's
created lazily only once something app-wide is actually needed beyond `app/layout.tsx`. Nothing
has needed it through tickets 01–04 or the later `camera-pip-drag` feature. `emotion-mirror` and
`shared` exist and are in active use.
