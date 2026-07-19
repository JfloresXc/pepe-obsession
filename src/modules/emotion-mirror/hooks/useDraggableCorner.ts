"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { resolveNearestCorner, type Corner } from "@/modules/emotion-mirror/lib/resolveNearestCorner";
import { DEFAULT_PIP_CORNER, MOBILE_BREAKPOINT_PX } from "@/shared/constants";

interface DragOrigin {
  pointerId: number;
  startX: number;
  startY: number;
  rect: DOMRect;
}

export function useDraggableCorner(isOn: boolean) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const dragOriginRef = useRef<DragOrigin | null>(null);
  const [corner, setCorner] = useState<Corner>(DEFAULT_PIP_CORNER);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOn) return;
    function handleResize() {
      setCorner(DEFAULT_PIP_CORNER);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOn]);

  function endDrag() {
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    dragOriginRef.current = null;
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT_PX + 1}px)`).matches) return;
    const panel = panelRef.current;
    if (!panel) return;
    panel.setPointerCapture(event.pointerId);
    dragOriginRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      rect: panel.getBoundingClientRect(),
    };
    setIsDragging(true);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const origin = dragOriginRef.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    setDragOffset({ x: event.clientX - origin.startX, y: event.clientY - origin.startY });
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const origin = dragOriginRef.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    const releasedPosition = {
      x: origin.rect.left + (event.clientX - origin.startX),
      y: origin.rect.top + (event.clientY - origin.startY),
    };
    const nextCorner = resolveNearestCorner(
      releasedPosition,
      { width: window.innerWidth, height: window.innerHeight },
      { width: origin.rect.width, height: origin.rect.height },
    );
    setCorner(nextCorner);
    endDrag();
  }

  function onPointerCancel(event: PointerEvent<HTMLDivElement>) {
    const origin = dragOriginRef.current;
    if (!origin || origin.pointerId !== event.pointerId) return;
    endDrag();
  }

  return {
    panelRef,
    corner,
    isDragging,
    dragOffset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}
