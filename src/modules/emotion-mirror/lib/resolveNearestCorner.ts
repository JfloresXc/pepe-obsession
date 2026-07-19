export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export function resolveNearestCorner(panelPosition: Point, viewport: Size, panel: Size): Corner {
  const centerX = panelPosition.x + panel.width / 2;
  const centerY = panelPosition.y + panel.height / 2;

  const vertical = centerY < viewport.height / 2 ? "top" : "bottom";
  const horizontal = centerX < viewport.width / 2 ? "left" : "right";

  return `${vertical}-${horizontal}`;
}
