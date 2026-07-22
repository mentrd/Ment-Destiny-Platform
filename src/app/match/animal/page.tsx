import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import MatchClient from "@/components/match/MatchClient";

export const metadata = pageMeta({
  title: "生肖配對免費測｜12 生肖合沖緣分指數",
  description:
    "選擇你與對方的生肖，依六合、三合與相沖的生肖磁場，免費測出緣分指數、相處模式、優勢與注意事項。娛樂與自我探索，一分鐘揭曉。",
  path: "/match/animal",
});

export default function MatchAnimalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "愛情配對", path: "/match" },
          { name: "生肖配對", path: "/match/animal" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-mystic-300">正在牽起紅線…</div>
        }
      >
        <MatchClient kind="animal" />
      </Suspense>
    </div>
  );
}
