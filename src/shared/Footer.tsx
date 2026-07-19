import { dictionary } from "@/shared/dictionary";

export function Footer() {
  return (
    <footer className="flex justify-center py-5">
      <span className="rounded-full border border-black/10 bg-white px-4 py-1.5 font-mono text-[11px] text-[#57534B]">
        {dictionary.footer.text}
      </span>
    </footer>
  );
}
