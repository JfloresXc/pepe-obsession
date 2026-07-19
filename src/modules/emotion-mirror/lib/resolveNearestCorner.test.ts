import { describe, expect, it } from "vitest";
import { resolveNearestCorner } from "./resolveNearestCorner";

describe("resolveNearestCorner", () => {
  const viewport = { width: 400, height: 800 };
  const panel = { width: 100, height: 140 };

  it("snaps to top-left when released in the top-left quadrant", () => {
    const corner = resolveNearestCorner({ x: 10, y: 20 }, viewport, panel);

    expect(corner).toBe("top-left");
  });

  it("snaps to top-right when released in the top-right quadrant", () => {
    const corner = resolveNearestCorner({ x: 280, y: 20 }, viewport, panel);

    expect(corner).toBe("top-right");
  });

  it("snaps to bottom-left when released in the bottom-left quadrant", () => {
    const corner = resolveNearestCorner({ x: 10, y: 620 }, viewport, panel);

    expect(corner).toBe("bottom-left");
  });

  it("snaps to bottom-right when released in the bottom-right quadrant", () => {
    const corner = resolveNearestCorner({ x: 280, y: 620 }, viewport, panel);

    expect(corner).toBe("bottom-right");
  });

  it("resolves deterministically when the panel's center lands exactly on the viewport's center", () => {
    const corner = resolveNearestCorner({ x: 150, y: 330 }, viewport, panel);

    expect(corner).toBe("bottom-right");
  });
});
