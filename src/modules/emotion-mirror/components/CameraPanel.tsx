"use client";

import type { CSSProperties, RefObject } from "react";
import type { Emotion } from "@/modules/emotion-mirror/lib/resolveReaction";
import { useDraggableCorner } from "@/modules/emotion-mirror/hooks/useDraggableCorner";
import { dictionary } from "@/shared/dictionary";
import { EMOTION_LABEL, PIP_CORNER_POSITION_CLASS } from "@/shared/constants";
import { Alert } from "@/shared/Alert";

interface CameraPanelProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: "idle" | "loading" | "on";
  errorMessage: string | null;
  onStart: () => void;
  modelStatusMessage: string;
  detectedEmotion: Emotion;
}

export function CameraPanel({
  videoRef,
  status,
  errorMessage,
  onStart,
  modelStatusMessage,
  detectedEmotion,
}: CameraPanelProps) {
  const isOn = status === "on";
  const {
    panelRef,
    corner,
    isDragging,
    dragOffset,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  } = useDraggableCorner(isOn);

  const pipStyle: CSSProperties | undefined = isOn
    ? {
        transition: isDragging
          ? "none"
          : "top 300ms ease-out, right 300ms ease-out, bottom 300ms ease-out, left 300ms ease-out, transform 300ms ease-out",
        transform: isDragging
          ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(1.05)`
          : undefined,
        touchAction: "none",
      }
    : undefined;

  return (
    <div
      ref={panelRef}
      style={pipStyle}
      onPointerDown={isOn ? onPointerDown : undefined}
      onPointerMove={isOn ? onPointerMove : undefined}
      onPointerUp={isOn ? onPointerUp : undefined}
      onPointerCancel={isOn ? onPointerCancel : undefined}
      className={`flex flex-col gap-3 rounded-3xl border border-[#C87C58]/35 bg-linear-to-b from-[#FFFDF9] to-[#FBF1E7] p-3.5 shadow-[0_24px_60px_rgba(80,50,25,0.1)] ${
        isOn
          ? `max-[899px]:fixed ${PIP_CORNER_POSITION_CLASS[corner]} max-[899px]:z-20 max-[899px]:w-28 max-[899px]:gap-0 max-[899px]:p-1.5${
              isDragging ? " max-[899px]:shadow-[0_30px_70px_rgba(80,50,25,0.35)]" : ""
            }`
          : ""
      }`}
    >
      <div
        className={`relative min-h-[min(56vh,540px)] min-[900px]:max-h-[min(56vh,540px)] flex-1 overflow-hidden rounded-2xl bg-[#211D18] ${
          isOn ? "max-[899px]:h-37 max-[899px]:min-h-37 max-[899px]:flex-none max-[899px]:rounded-xl" : ""
        }`}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover transform-[scaleX(-1)]"
          style={{ display: isOn ? "block" : "none" }}
        />
        {!isOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 bg-linear-to-b from-[#FBF5EC] to-[#F6E9DB] p-6 text-center">
            <div className="text-xl font-extrabold tracking-tight">{dictionary.camera.off}</div>
            <div className="font-mono text-xs text-[#8A8375]">{dictionary.camera.privacyNote}</div>
            <button
              onClick={onStart}
              disabled={status === "loading"}
              className="mt-1.5 rounded-full bg-[#57534B] px-6 py-3 text-sm font-semibold text-[#FBF7EF] hover:bg-[#3E3B35] disabled:opacity-60"
            >
              {status === "loading" ? dictionary.camera.turningOn : dictionary.camera.turnOn}
            </button>
          </div>
        )}
        {isOn && (
          <>
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[11px] tracking-wider text-[#FBF7EF] max-[899px]:left-1.5 max-[899px]:top-1.5 max-[899px]:gap-1 max-[899px]:px-1.5 max-[899px]:py-0.5 max-[899px]:text-[8px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#141210]" />
              {dictionary.camera.live}
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/70 px-4 py-1.5 font-mono text-xs text-[#FBF7EF] max-[899px]:hidden">
              {dictionary.camera.detectingPrefix}
              {EMOTION_LABEL[detectedEmotion].toLowerCase()}
            </div>
          </>
        )}
      </div>
      <div
        className={`flex items-center justify-between px-2 pb-1 pt-0.5 ${isOn ? "max-[899px]:hidden" : ""}`}
      >
        <span className="font-mono text-[11px] tracking-wider text-[#8A8375]">
          {dictionary.camera.footerLabel}
        </span>
        <span className="font-mono text-[11px] text-[#8A8375]">{modelStatusMessage}</span>
      </div>
      {errorMessage && <Alert message={errorMessage} />}
    </div>
  );
}
