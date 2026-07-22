import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import DreamResult from "@/components/dream/DreamResult";

export const metadata = pageMeta({
  title: "你的夢境解讀",
  description:
    "結合榮格心理學象徵觀點與周公解夢的夢境解析：夢中元素、象徵意義、自我覺察提問與綜合心理解讀。僅供娛樂與自我探索參考。",
  path: "/dream/result",
  noindex: true,
});

export default function DreamResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-mystic-300">
          正在解讀你的夢…
        </div>
      }
    >
      <DreamResult />
    </Suspense>
  );
}
