import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import DreamStartClient from "@/components/dream/DreamStartClient";

export const metadata = pageMeta({
  title: "開始解夢｜描述你的夢境",
  description:
    "寫下你夢裡的人物、場景、動作與感覺，立即取得結合心理象徵與周公解夢的夢境解析。即測即得，僅供娛樂與自我探索參考。",
  path: "/dream/start",
});

export default function DreamStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "解夢", path: "/dream" },
          { name: "開始解夢", path: "/dream/start" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-mystic-300">
            正在準備解夢…
          </div>
        }
      >
        <DreamStartClient />
      </Suspense>
    </div>
  );
}
