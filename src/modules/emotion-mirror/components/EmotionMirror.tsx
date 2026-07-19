"use client";

import { useCamera } from "@/modules/emotion-mirror/hooks/useCamera";
import { useEmotionDetector } from "@/modules/emotion-mirror/hooks/useEmotionDetector";
import { CameraPanel } from "@/modules/emotion-mirror/components/CameraPanel";
import { ReactionPanel } from "@/modules/emotion-mirror/components/ReactionPanel";
import type { PresetManifest } from "@/modules/emotion-mirror/lib/resolveReaction";
import { Alert } from "@/shared/Alert";
import { dictionary } from "@/shared/dictionary";

const MODEL_STATUS_MESSAGE = {
  loading: dictionary.models.loading,
  ready: dictionary.models.ready,
  error: dictionary.models.error,
};

export function EmotionMirror({ presetManifest }: { presetManifest: PresetManifest }) {
  const camera = useCamera();
  const {
    reaction,
    modelStatus,
    errorMessage: modelErrorMessage,
  } = useEmotionDetector(camera.videoRef, camera.status === "on", presetManifest);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid w-full gap-5 min-[900px]:grid-cols-2">
        <CameraPanel
          videoRef={camera.videoRef}
          status={camera.status}
          errorMessage={camera.errorMessage}
          onStart={camera.start}
          modelStatusMessage={MODEL_STATUS_MESSAGE[modelStatus]}
          detectedEmotion={reaction.emotion}
        />
        <ReactionPanel reaction={reaction} expanded={camera.status === "on"} />
      </div>
      {modelErrorMessage && <Alert message={modelErrorMessage} />}
    </div>
  );
}
