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

  // triste/enojado lean on weaker blendshapes (mouth frown, brow-down) than feliz/asustado's
  // strong ones (mouth smile, eye-wide) — a shared threshold leaves them flickering near the
  // line under normal webcam noise, so they get a lower bar.
  const candidateThreshold: Record<Exclude<Emotion, "neutral">, number> = {
    feliz: threshold,
    triste: threshold - 0.1,
    enojado: threshold - 0.05,
    asustado: threshold,
  };

  let best: Emotion = "neutral";
  let bestScore = -Infinity;
  for (const [emotion, value] of Object.entries(candidates) as [Exclude<Emotion, "neutral">, number][]) {
    if (value <= candidateThreshold[emotion]) continue;
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
