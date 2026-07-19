export const dictionary = {
  nav: {
    title: "Pepe Obsession",
  },
  header: {
    detectorBadge: "DETECTOR",
    liveBadge: "EN VIVO · CÁMARA",
    title: "Hazle un gesto a la cámara",
    subtitle:
      "Sonríe, pon cara triste, enójate o asústate. Pepe reacciona a cada emoción con su propia imagen.",
  },
  camera: {
    off: "La cámara está apagada",
    privacyNote: "acceso local · nada se sube · solo tú lo ves",
    turnOn: "Encender cámara",
    turningOn: "Encendiendo…",
    live: "EN VIVO",
    footerLabel: "01 — TÚ",
    detectingPrefix: "detectando: ",
  },
  models: {
    loading: "cargando modelos…",
    ready: "modelos listos ✓",
    error: "error cargando modelos",
  },
  reaction: {
    footerLabel: "02 — PEPE ESTÁ",
  },
  alerts: {
    permissionDenied: "No se pudo acceder a la cámara. Revisa los permisos.",
    noCamera: "No se encontró ninguna cámara en este dispositivo.",
    cameraInUse: "La cámara está en uso por otra aplicación.",
    unknown: "No se pudo acceder a la cámara.",
    modelLoadFailed: "No se pudo cargar el modelo de detección.",
  },
  footer: {
    text: "pepe obsession · © 2026",
  },
} as const;
