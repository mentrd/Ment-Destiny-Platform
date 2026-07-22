import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import MatchClient from "@/components/match/MatchClient";

export const metadata = pageMeta({
  title: "姓名配對免費測｜姓名五行緣分指數",
  description:
    "輸入你與對方的姓名，以雙方人格五行的相生相剋，免費測出緣分指數、相處模式、優勢與注意事項。娛樂與自我探索，一分鐘揭曉。",
  path: "/match/name",
});

export default function MatchNamePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "愛情配對", path: "/match" },
          { name: "姓名配對", path: "/match/name" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-mystic-300">正在牽起紅線…</div>
        }
      >
        <MatchClient kind="name" />
      </Suspense>
    </div>
  );
}
