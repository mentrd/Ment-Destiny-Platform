import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import NumerologyResult from "@/components/numerology/NumerologyResult";

export const metadata = pageMeta({
  title: "你的生命靈數結果",
  description: "生命靈數與大師數解讀：性格、天賦、人生課題、感情模式，九宮格先天數字盤與今年流年運勢。",
  path: "/numerology/result",
  noindex: true,
});

export default function NumerologyResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-mystic-300">
          正在解讀你的數字密碼…
        </div>
      }
    >
      <NumerologyResult />
    </Suspense>
  );
}
