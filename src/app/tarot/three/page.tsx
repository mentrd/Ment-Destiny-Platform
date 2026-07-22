import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotFlow from "@/components/tarot/TarotFlow";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "三張牌塔羅占卜｜過去現在未來",
  description:
    "免費三張牌塔羅占卜（過去・現在・未來牌陣）：以時間軸看一件事的成因、現況與走向，翻牌即得每張牌的正逆位解讀。結果僅供娛樂與自我探索參考。",
  path: "/tarot/three",
});

export default function TarotThreePage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { name: "塔羅牌占卜", path: "/tarot" },
            { name: "三張牌陣", path: "/tarot/three" },
          ]}
        />
      </div>
      <Suspense fallback={null}>
        <TarotFlow mode="three" />
      </Suspense>
    </>
  );
}
