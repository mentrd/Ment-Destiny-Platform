import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotFlow from "@/components/tarot/TarotFlow";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "愛情塔羅占卜｜看清這段感情",
  description:
    "免費愛情塔羅占卜：以我的心態、對方心態、關係走向三張牌，看清這段感情此刻的樣貌與方向，翻牌即得感情專屬牌義解讀。結果僅供娛樂與自我探索參考。",
  path: "/tarot/love",
});

export default function TarotLovePage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { name: "塔羅牌占卜", path: "/tarot" },
            { name: "愛情塔羅", path: "/tarot/love" },
          ]}
        />
      </div>
      <Suspense fallback={null}>
        <TarotFlow mode="love" />
      </Suspense>
    </>
  );
}
