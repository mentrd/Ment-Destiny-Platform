import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import NameResult from "@/components/name/NameResult";

export const metadata = pageMeta({
  title: "你的姓名學分析結果",
  description: "五格三才、81 數理與人格五行解讀：個性、事業、感情與財運，或新生兒吉利筆畫命名建議。",
  path: "/name/result",
  noindex: true,
});

export default function NameResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-mystic-300">
          正在推演你的姓名格局…
        </div>
      }
    >
      <NameResult />
    </Suspense>
  );
}
