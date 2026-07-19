import type { Reaction } from "@/modules/emotion-mirror/lib/resolveReaction";
import { EMOJI_BY_EMOTION, EMOTION_LABEL } from "@/shared/constants";
import { dictionary } from "@/shared/dictionary";

export function ReactionPanel({
  reaction,
  expanded = false,
}: {
  reaction: Reaction;
  expanded?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-3xl border border-[#C87C58]/35 bg-linear-to-b from-[#FFFDF9] to-[#FBF1E7] p-3.5 shadow-[0_24px_60px_rgba(80,50,25,0.1)]">
      <div
        className={`relative flex min-h-[min(56vh,540px)] flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#F4EADD] ${
          expanded ? "max-[899px]:min-h-[min(70vh,600px)]" : ""
        }`}
      >
        {reaction.imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element -- preset images are user-supplied local files, not build-time-known Next/Image assets
          <img
            src={reaction.imageSrc}
            alt={`Pepe ${reaction.emotion}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[120px] leading-none">{EMOJI_BY_EMOTION[reaction.emotion]}</span>
        )}
      </div>
      <div className="flex items-center justify-between px-2 pb-1 pt-0.5">
        <span className="font-mono text-[11px] tracking-wider text-[#8A8375]">
          {dictionary.reaction.footerLabel}
        </span>
        <span className="text-base font-extrabold tracking-tight text-[#B44A2B]">
          {EMOTION_LABEL[reaction.emotion]}
        </span>
      </div>
    </div>
  );
}
