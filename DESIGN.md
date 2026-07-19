# Design notes

## Reference: "Obsession" (Blumhouse / Focus Features)

The Preset images under `public/pepe/<emotion>/` are stills from the movie *Obsession*
(teaser poster: bold red background, black condensed wordmark, "Only in theaters May 15").
The app's accent colors were nudged toward that poster.

## Color mapping

Only the two accent colors were swapped — everything else (cream backgrounds, card
gradients, muted/dark text tones) was left untouched on purpose, to keep the existing
layout's legibility and warmth.

| Role      | Before    | After     | Source                              |
| --------- | --------- | --------- | ------------------------------------ |
| Principal | `#B44A2B` | `#E2231A` | Poster's red                         |
| Secundario| `#E0562E` | `#141210` | Poster's black wordmark              |

**Principal** (`#E2231A`) is used for: the nav logo mark + its shadow, the nav emotion
chip border/text, the header detector badge border/text, the reaction panel's detected-
emotion label, and the `Alert` component's border/text.

**Secundario** (`#141210`) is used for: the pulsing dot in the "EN VIVO" camera badge.

Not touched: `#C87C58` (card border) and `#F9E1D7` (chip/alert background tint) — these
read as tints of the principal color rather than distinct colors, and swapping them
wasn't part of the agreed scope.

## Files touched

- `src/shared/Nav.tsx`
- `src/shared/Alert.tsx`
- `src/modules/emotion-mirror/components/Header.tsx`
- `src/modules/emotion-mirror/components/ReactionPanel.tsx`
- `src/modules/emotion-mirror/components/CameraPanel.tsx`
