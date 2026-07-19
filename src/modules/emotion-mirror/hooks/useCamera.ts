"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getCameraErrorMessage } from "@/modules/emotion-mirror/lib/cameraErrors";

type CameraStatus = "idle" | "loading" | "on";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const start = useCallback(async () => {
    if (status === "loading" || status === "on") return;
    setStatus("loading");
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("on");
    } catch (error) {
      setStatus("idle");
      setErrorMessage(getCameraErrorMessage(error));
    }
  }, [status]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { videoRef, status, errorMessage, start };
}
