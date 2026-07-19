import { dictionary } from "@/shared/dictionary";

export function Header() {
  return (
    <header className="px-6 pb-1.5 pt-5.5 text-center">
      <div className="mb-4 flex justify-center gap-2.5">
        <span className="rounded-full border border-[#B44A2B]/30 bg-[#F9E1D7] px-3 py-1.5 font-mono text-[11px] font-medium tracking-wider text-[#B44A2B]">
          {dictionary.header.detectorBadge}
        </span>
        <span className="rounded-full border border-black/8 bg-white/55 px-3 py-1.5 font-mono text-[11px] tracking-wider text-[#57534B]">
          {dictionary.header.liveBadge}
        </span>
      </div>
      <h1 className="m-0 text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.05] tracking-tight">
        {dictionary.header.title}
      </h1>
      <p className="mx-auto mt-3 max-w-[560px] text-base leading-[1.55] text-[#57534B]">
        {dictionary.header.subtitle}
      </p>
    </header>
  );
}
