import { DETECTION_CONFIDENCE_THRESHOLD } from "@/shared/constants";

export type Emotion = "feliz" | "triste" | "enojado" | "asustado" | "neutral";

export type BlendshapeScores = Partial<Record<string, number>>;

export type PresetManifest = Partial<Record<Emotion, string[]>>;

export interface Reaction {
  emotion: Emotion;
  imageSrc: string | null;
}

function score(scores: BlendshapeScores, ...keys: string[]): number {
  return keys.reduce((sum, key) => sum + (scores[key] ?? 0), 0) / keys.length;
}

function classifyEmotion(scores_: BlendshapeScores, threshold: number): Emotion {
  // Each candidate takes the strongest of its contributing signals (not an average) — real
  // blendshape scores for triste/enojado/asustado rarely spike on every signal at once the way
  // mouthSmile does for feliz, so averaging them together under-detects real expressions.
  const candidates: Record<Exclude<Emotion, "neutral">, number> = {
    feliz: score(scores_, "mouthSmileLeft", "mouthSmileRight"),
    triste: Math.max(
      score(scores_, "mouthFrownLeft", "mouthFrownRight"),
      score(scores_, "browInnerUp") * 0.9,
    ),
    enojado: Math.max(
      score(scores_, "browDownLeft", "browDownRight"),
      score(scores_, "noseSneerLeft", "noseSneerRight") * 0.9,
    ),
    asustado: Math.max(
      score(scores_, "eyeWideLeft", "eyeWideRight"),
      score(scores_, "jawOpen") * 0.85,
      score(scores_, "browInnerUp") * 0.7,
    ),
  };

  let best: Emotion = "neutral";
  let bestScore = threshold;
  for (const [emotion, value] of Object.entries(candidates) as [Emotion, number][]) {
    if (value > bestScore) {
      best = emotion;
      bestScore = value;
    }
  }
  return best;
}

function pickPreset(
  emotion: Emotion,
  manifest: PresetManifest,
  random: () => number,
): string | null {
  const options = manifest[emotion];
  if (!options || options.length === 0) return null;
  if (options.length === 1) return options[0];
  return options[Math.floor(random() * options.length)];
}

export function resolveReaction(
  blendshapeScores: BlendshapeScores,
  presetManifest: PresetManifest,
  threshold: number = DETECTION_CONFIDENCE_THRESHOLD,
  random: () => number = Math.random,
): Reaction {
  const emotion = classifyEmotion(blendshapeScores, threshold);
  const imageSrc = pickPreset(emotion, presetManifest, random);
  return { emotion, imageSrc };
}
