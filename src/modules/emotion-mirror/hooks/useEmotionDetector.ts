"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import {
  resolveReaction,
  type BlendshapeScores,
  type PresetManifest,
  type Reaction,
} from "@/modules/emotion-mirror/lib/resolveReaction";
import { DETECTION_INTERVAL_MS, NEUTRAL_HOLD_MS } from "@/shared/constants";
import { dictionary } from "@/shared/dictionary";

const WASM_BASE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";
const MODEL_ASSET_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

type ModelStatus = "loading" | "ready" | "error";

export function useEmotionDetector(
  videoRef: RefObject<HTMLVideoElement | null>,
  isCameraOn: boolean,
  presetManifest: PresetManifest = {},
) {
  const [modelStatus, setModelStatus] = useState<ModelStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const idleReaction = useMemo(() => resolveReaction({}, presetManifest), [presetManifest]);
  const [reaction, setReaction] = useState<Reaction>(idleReaction);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const lastNonNeutralRef = useRef<{ reaction: Reaction; at: number } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadModel() {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: { modelAssetPath: MODEL_ASSET_URL, delegate: "GPU" },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        });
        if (cancelled) {
          landmarker.close();
          return;
        }
        landmarkerRef.current = landmarker;
        setModelStatus("ready");
      } catch {
        if (!cancelled) {
          setModelStatus("error");
          setErrorMessage(dictionary.alerts.modelLoadFailed);
        }
      }
    }

    loadModel();
    return () => {
      cancelled = true;
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isCameraOn || modelStatus !== "ready") return;

    const tick = () => {
      const video = videoRef.current;
      const landmarker = landmarkerRef.current;
      if (!video || !landmarker || video.readyState < 2) return;

      const now = performance.now();
      const result = landmarker.detectForVideo(video, now);
      const categories = result.faceBlendshapes?.[0]?.categories ?? [];
      const scores: BlendshapeScores = {};
      for (const category of categories) {
        scores[category.categoryName] = category.score;
      }

      const nextReaction = resolveReaction(scores, presetManifest);
      if (nextReaction.emotion !== "neutral") {
        lastNonNeutralRef.current = { reaction: nextReaction, at: now };
        setReaction(nextReaction);
        return;
      }

      const held = lastNonNeutralRef.current;
      if (held && now - held.at < NEUTRAL_HOLD_MS) return;
      setReaction(nextReaction);
    };

    const interval = setInterval(tick, DETECTION_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isCameraOn, modelStatus, videoRef, presetManifest]);

  return { modelStatus, errorMessage, reaction: isCameraOn ? reaction : idleReaction };
}
