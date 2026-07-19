"use client";

import { useEffect, useState } from "react";
import {
  EMOTION_FACE_ICON_PATH,
  EMOTION_LABEL,
  NAV_CHIP_EMOTIONS,
  NAV_CHIP_INTERVAL_MS,
} from "@/shared/constants";
import { dictionary } from "@/shared/dictionary";

export function Nav() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % NAV_CHIP_EMOTIONS.length);
    }, NAV_CHIP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const emotion = NAV_CHIP_EMOTIONS[index];

  return (
    <nav className="flex items-center justify-between px-8 py-4.5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#B44A2B] shadow-[0_4px_12px_rgba(180,74,43,0.35)]">
          <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FBEFE7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9.2" />
            <path d={EMOTION_FACE_ICON_PATH.triste} />
          </svg>
        </div>
        <div className="text-lg font-extrabold tracking-tight">{dictionary.nav.title}</div>
      </div>
      <div className="flex min-w-[132px] justify-end">
        <span
          key={emotion}
          className="inline-flex w-[132px] animate-[pp-chip-in_0.45s_ease] items-center justify-center gap-2 rounded-full border border-[#B44A2B]/32 bg-[#F9E1D7] py-1.5 text-sm font-semibold text-[#B44A2B]"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="9.2" />
            <path d={EMOTION_FACE_ICON_PATH[emotion]} />
          </svg>
          {EMOTION_LABEL[emotion]}
        </span>
      </div>
    </nav>
  );
}
