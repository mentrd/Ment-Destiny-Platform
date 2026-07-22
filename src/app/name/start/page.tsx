import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import NameStartForm from "@/components/name/NameStartForm";

export const metadata = pageMeta({
  title: "開始分析｜輸入姓名算五格三才・新生兒命名",
  description:
    "輸入姓名與性別，立即分析五格三才與 81 數理；或選擇新生兒命名模式，輸入姓氏與期望特質，取得吉利筆畫組合與候選字建議。",
  path: "/name/start",
});

export default function NameStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "姓名學", path: "/name" },
          { name: "開始分析", path: "/name/start" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center text-mystic-300">
            正在準備筆墨…
          </div>
        }
      >
        <NameStartForm />
      </Suspense>
    </div>
  );
}
