import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import AstrologyResult from "@/components/astrology/AstrologyResult";

export const metadata = pageMeta({
  title: "你的本命盤結果",
  description: "太陽、月亮與上升星座解讀，本命盤星盤輪與七大行星落座分析。",
  path: "/astrology/result",
  noindex: true,
});

export default function AstrologyResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-mystic-300">
          正在展開你的星盤…
        </div>
      }
    >
      <AstrologyResult />
    </Suspense>
  );
}
