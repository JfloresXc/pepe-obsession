import fs from "node:fs";
import path from "node:path";
import type { Emotion, PresetManifest } from "@/modules/emotion-mirror/lib/resolveReaction";

const EMOTIONS: Emotion[] = ["feliz", "triste", "enojado", "asustado", "neutral"];
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const PRESETS_ROOT = path.join(process.cwd(), "public", "pepe");

export function loadPresetManifest(): PresetManifest {
  const manifest: PresetManifest = {};

  for (const emotion of EMOTIONS) {
    const dir = path.join(PRESETS_ROOT, emotion);
    if (!fs.existsSync(dir)) continue;

    const files = fs
      .readdirSync(dir)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort();

    if (files.length > 0) {
      manifest[emotion] = files.map((file) => `/pepe/${emotion}/${file}`);
    }
  }

  return manifest;
}
