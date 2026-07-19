# Pepe Obsession

A web app that reads the user's facial expression from their webcam and mirrors it back as a preset reaction image (or emoji placeholder) of "Pepe".

## Language

**Emotion**:
The technical/domain term for a classified facial expression. One of `feliz`, `triste`, `enojado`, `asustado`, or the `neutral` fallback when no expression clears the detection threshold.
_Avoid_: "Gesture"/"gesto" in code, folder names, or the domain model — reserve "gesto" strictly for user-facing Spanish copy (buttons, headers) where it reads more naturally; it never refers to hand/body gestures here, only facial expression.

**Preset image**:
A user-supplied reaction image for one Emotion, stored under `public/pepe/<emotion>/`. An Emotion's folder may hold zero (falls back to that Emotion's emoji), one, or several Preset images (several → one is picked at random on each detection).
