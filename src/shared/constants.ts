import type { Emotion } from "@/modules/emotion-mirror/lib/resolveReaction";
import type { Corner } from "@/modules/emotion-mirror/lib/resolveNearestCorner";

export const DETECTION_CONFIDENCE_THRESHOLD = 0.35;
export const DETECTION_INTERVAL_MS = 400;

export const MOBILE_BREAKPOINT_PX = 899;
export const DEFAULT_PIP_CORNER: Corner = "top-right";

export const PIP_CORNER_POSITION_CLASS: Record<Corner, string> = {
  "top-right": "max-[899px]:top-11 max-[899px]:right-8",
  "top-left": "max-[899px]:top-11 max-[899px]:left-8",
  "bottom-right": "max-[899px]:bottom-20 max-[899px]:right-8",
  "bottom-left": "max-[899px]:bottom-20 max-[899px]:left-8",
};

export const EMOJI_BY_EMOTION: Record<Emotion, string> = {
  feliz: "😄",
  triste: "😢",
  enojado: "😠",
  asustado: "😱",
  neutral: "😐",
};

export const EMOTION_LABEL: Record<Emotion, string> = {
  feliz: "Feliz",
  triste: "Triste",
  enojado: "Enojado",
  asustado: "Asustado",
  neutral: "Neutral",
};

// Face-icon path data (paired with a circle) for each emotion, used in the nav chip.
export const EMOTION_FACE_ICON_PATH: Record<Exclude<Emotion, "neutral">, string> = {
  feliz: "M8 14s1.5 2 4 2 4-2 4-2 M9 9.5h.01 M15 9.5h.01",
  triste: "M16 16s-1.5-2-4-2-4 2-4 2 M9 10h.01 M15 10h.01",
  enojado: "M16 16.5s-1.5-2-4-2-4 2-4 2 M7.5 8l2.5 1 M16.5 8L14 9 M9 12h.01 M15 12h.01",
  asustado: "M9 9.5h.01 M15 9.5h.01 M10 15.2a2 1.9 0 1 0 4 0a2 1.9 0 1 0 -4 0",
};

export const NAV_CHIP_EMOTIONS: Exclude<Emotion, "neutral">[] = [
  "feliz",
  "triste",
  "enojado",
  "asustado",
];

export const NAV_CHIP_INTERVAL_MS = 2500;
