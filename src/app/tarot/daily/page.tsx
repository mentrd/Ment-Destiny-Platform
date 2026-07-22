import { Suspense } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TarotFlow from "@/components/tarot/TarotFlow";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "每日塔羅｜今日指引牌",
  description:
    "免費每日塔羅：進頁即翻出今日指引牌，附正逆位牌義與關鍵字，作為一天的提醒與陪伴。每日結果固定，結果僅供娛樂與自我探索參考。",
  path: "/tarot/daily",
});

export default function TarotDailyPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <Breadcrumbs
          items={[
            { name: "塔羅牌占卜", path: "/tarot" },
            { name: "每日塔羅", path: "/tarot/daily" },
          ]}
        />
      </div>
      <Suspense fallback={null}>
        <TarotFlow mode="daily" />
      </Suspense>
    </>
  );
}
