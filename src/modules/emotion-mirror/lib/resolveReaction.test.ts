import { describe, expect, it } from "vitest";
import { resolveReaction } from "./resolveReaction";

describe("resolveReaction", () => {
  it("classifies a clear smile as feliz", () => {
    const result = resolveReaction({ mouthSmileLeft: 0.9, mouthSmileRight: 0.85 }, {});

    expect(result.emotion).toBe("feliz");
  });

  it("classifies a clear frown with raised inner brows as triste", () => {
    const result = resolveReaction(
      { mouthFrownLeft: 0.8, mouthFrownRight: 0.75, browInnerUp: 0.6 },
      {},
    );

    expect(result.emotion).toBe("triste");
  });

  it("classifies furrowed brows and a nose sneer as enojado", () => {
    const result = resolveReaction(
      { browDownLeft: 0.85, browDownRight: 0.8, noseSneerLeft: 0.7, noseSneerRight: 0.65 },
      {},
    );

    expect(result.emotion).toBe("enojado");
  });

  it("classifies wide eyes and an open jaw as asustado", () => {
    const result = resolveReaction(
      { eyeWideLeft: 0.9, eyeWideRight: 0.85, jawOpen: 0.7, browInnerUp: 0.4 },
      {},
    );

    expect(result.emotion).toBe("asustado");
  });

  it("falls back to neutral when no expression clears the confidence threshold", () => {
    const result = resolveReaction(
      { mouthSmileLeft: 0.2, browDownLeft: 0.15, eyeWideLeft: 0.1 },
      {},
    );

    expect(result.emotion).toBe("neutral");
  });

  it("falls back to neutral for a blank face with no blendshape scores", () => {
    const result = resolveReaction({}, {});

    expect(result.emotion).toBe("neutral");
  });

  it("classifies a real (subtle, single-signal) frown as triste without needing raised brows too", () => {
    // Regression: real webcam frowns rarely also raise the inner brows at the same time —
    // requiring both signals at once (the old averaged formula) under-detected real faces.
    const result = resolveReaction({ mouthFrownLeft: 0.45, mouthFrownRight: 0.4 }, {});

    expect(result.emotion).toBe("triste");
  });

  it("classifies a real (subtle, single-signal) brow furrow as enojado without needing a nose sneer too", () => {
    const result = resolveReaction({ browDownLeft: 0.4, browDownRight: 0.38 }, {});

    expect(result.emotion).toBe("enojado");
  });

  it("classifies a real (subtle, single-signal) open jaw as asustado without needing wide eyes too", () => {
    const result = resolveReaction({ jawOpen: 0.45 }, {});

    expect(result.emotion).toBe("asustado");
  });

  it("returns a null imageSrc (the emoji-fallback signal) when the manifest has no presets for the detected emotion", () => {
    const result = resolveReaction({ mouthSmileLeft: 0.9, mouthSmileRight: 0.85 }, {});

    expect(result.imageSrc).toBeNull();
  });
});

describe("resolveReaction preset selection", () => {
  const smiling = { mouthSmileLeft: 0.9, mouthSmileRight: 0.85 };

  it("returns null when the detected emotion's preset list is empty", () => {
    const result = resolveReaction(smiling, { feliz: [] });

    expect(result.imageSrc).toBeNull();
  });

  it("always returns the only preset when the detected emotion has exactly one", () => {
    const result = resolveReaction(smiling, { feliz: ["/pepe/feliz/a.png"] });

    expect(result.imageSrc).toBe("/pepe/feliz/a.png");
  });

  it("picks one of several presets using the injected random source, not a fixed one", () => {
    const presets = ["/pepe/feliz/a.png", "/pepe/feliz/b.png", "/pepe/feliz/c.png"];

    const result = resolveReaction(smiling, { feliz: presets }, undefined, () => 0.5);

    expect(presets).toContain(result.imageSrc);
    expect(result.imageSrc).toBe(presets[1]);
  });

  it("stays within the valid preset set across different random draws", () => {
    const presets = ["/pepe/feliz/a.png", "/pepe/feliz/b.png", "/pepe/feliz/c.png"];

    for (const draw of [0, 0.33, 0.99]) {
      const result = resolveReaction(smiling, { feliz: presets }, undefined, () => draw);
      expect(presets).toContain(result.imageSrc);
    }
  });
});
