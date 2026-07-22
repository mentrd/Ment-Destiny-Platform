import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotFlow from "@/components/tarot/TarotFlow";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "事業財運塔羅占卜｜現況阻礙與建議",
  description:
    "免費事業財運塔羅占卜：以現況、阻礙、建議三張牌，釐清工作與財務的處境與可行方向，翻牌即得事業財運專屬牌義解讀。結果僅供娛樂與自我探索參考。",
  path: "/tarot/career",
});

export default function TarotCareerPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { name: "塔羅牌占卜", path: "/tarot" },
            { name: "事業財運", path: "/tarot/career" },
          ]}
        />
      </div>
      <Suspense fallback={null}>
        <TarotFlow mode="career" />
      </Suspense>
    </>
  );
}
