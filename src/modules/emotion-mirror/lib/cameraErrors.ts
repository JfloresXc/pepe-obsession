import { dictionary } from "@/shared/dictionary";

export function getCameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      return dictionary.alerts.permissionDenied;
    }
    if (error.name === "NotFoundError") {
      return dictionary.alerts.noCamera;
    }
    if (error.name === "NotReadableError") {
      return dictionary.alerts.cameraInUse;
    }
  }
  return dictionary.alerts.unknown;
}
