import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import PalmStartClient from "@/components/palm/PalmStartClient";

export const metadata = pageMeta({
  title: "開始分析｜上傳照片看手相面相",
  description:
    "選擇手相或面相，上傳一張照片，立即取得趣味解析。照片僅在您的瀏覽器中分析，不會上傳伺服器、不會被保存。",
  path: "/palm/start",
});

export default function PalmStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "手相面相", path: "/palm" },
          { name: "開始分析", path: "/palm/start" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-mystic-300">
            正在準備分析…
          </div>
        }
      >
        <PalmStartClient />
      </Suspense>
    </div>
  );
}
