import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import ZiweiResult from "@/components/ziwei/ZiweiResult";

export const metadata = pageMeta({
  title: "你的紫微命盤結果",
  description: "紫微斗數十二宮命盤解讀：命宮身宮、五行局、十四主星與生年四化解析。",
  path: "/ziwei/result",
  noindex: true,
});

export default function ZiweiResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-mystic-300">
          正在展開你的星盤…
        </div>
      }
    >
      <ZiweiResult />
    </Suspense>
  );
}
