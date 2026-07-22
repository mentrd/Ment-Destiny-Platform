import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import MatchClient from "@/components/match/MatchClient";

export const metadata = pageMeta({
  title: "星座配對免費測｜12 星座元素緣分指數",
  description:
    "選擇你與對方的星座，從星座元素（火土風水）與模式的搭配，免費測出緣分指數、相處模式、優勢與注意事項。娛樂與自我探索，一分鐘揭曉。",
  path: "/match/zodiac",
});

export default function MatchZodiacPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "愛情配對", path: "/match" },
          { name: "星座配對", path: "/match/zodiac" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-mystic-300">正在牽起紅線…</div>
        }
      >
        <MatchClient kind="zodiac" />
      </Suspense>
    </div>
  );
}
