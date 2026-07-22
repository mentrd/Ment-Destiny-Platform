import { Suspense } from "react";
import { pageMeta } from "@/lib/site";
import IchingResult from "@/components/iching/IchingResult";

export const metadata = pageMeta({
  title: "卜卦結果",
  description: "易經卜卦結果：本卦卦辭與白話總解、六爻卦象、動爻爻辭與變卦走向，附行動建議。",
  path: "/iching/result",
  noindex: true,
});

export default function IchingResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-mystic-300">
          正在為你解卦…
        </div>
      }
    >
      <IchingResult />
    </Suspense>
  );
}
