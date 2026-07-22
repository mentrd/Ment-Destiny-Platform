import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import BaziResult from "@/components/bazi/BaziResult";

export const metadata = pageMeta({
  title: "你的八字命盤結果",
  description: "八字四柱命盤解讀：天干地支、十神藏干、五行比例、日主強弱、喜用神與大運分析。",
  path: "/bazi/result",
  noindex: true,
});

export default function BaziResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-mystic-300">
          正在推算你的四柱…
        </div>
      }
    >
      <BaziResult />
    </Suspense>
  );
}
