import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotFlow from "@/components/tarot/TarotFlow";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "塔羅是非題｜一張牌看是或否",
  description:
    "免費塔羅是非題占卜：把問題化成一句是非題，抽一張牌看塔羅給你的傾向（是／否／保留），並附上牌義解讀。結果僅供娛樂與自我探索參考。",
  path: "/tarot/yesno",
});

export default function TarotYesNoPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { name: "塔羅牌占卜", path: "/tarot" },
            { name: "是非題", path: "/tarot/yesno" },
          ]}
        />
      </div>
      <Suspense fallback={null}>
        <TarotFlow mode="yesno" />
      </Suspense>
    </>
  );
}
