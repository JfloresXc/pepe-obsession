import { Header } from "@/modules/emotion-mirror/components/Header";
import { EmotionMirror } from "@/modules/emotion-mirror/components/EmotionMirror";
import { loadPresetManifest } from "@/modules/emotion-mirror/lib/presetManifest";

export default function Home() {
  const presetManifest = loadPresetManifest();

  return (
    <main className="flex flex-1 flex-col">
      <Header />
      <div className="mx-auto w-full max-w-[1180px] flex-1 px-5 pb-3 pt-6.5">
        <EmotionMirror presetManifest={presetManifest} />
      </div>
    </main>
  );
}
