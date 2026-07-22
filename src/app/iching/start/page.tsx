import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import IchingStartClient from "@/components/iching/IchingStartClient";

export const metadata = pageMeta({
  title: "開始起卦｜擲幣、數字或時間占卜",
  description:
    "誠心默念你的問題，選擇擲幣、數字或時間任一方式起卦，即得易經六十四卦的本卦、動爻與變卦解析。一事一問，看見此刻該進該守。",
  path: "/iching/start",
});

export default function IchingStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "易經卜卦", path: "/iching" },
          { name: "開始起卦", path: "/iching/start" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-mystic-300">
            正在備妥卦盤…
          </div>
        }
      >
        <IchingStartClient />
      </Suspense>
    </div>
  );
}
