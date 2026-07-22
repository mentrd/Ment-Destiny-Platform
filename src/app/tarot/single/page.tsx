import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotFlow from "@/components/tarot/TarotFlow";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "單張塔羅牌占卜｜一張牌看指引",
  description:
    "免費單張塔羅牌占卜：針對一件具體的事默想問題、洗牌抽一張牌，翻牌即得正逆位牌義與關鍵字解讀。快速取得清晰方向，結果僅供娛樂與自我探索參考。",
  path: "/tarot/single",
});

export default function TarotSinglePage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { name: "塔羅牌占卜", path: "/tarot" },
            { name: "單張塔羅", path: "/tarot/single" },
          ]}
        />
      </div>
      <Suspense fallback={null}>
        <TarotFlow mode="single" />
      </Suspense>
    </>
  );
}
