import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import NumerologyStartForm from "@/components/numerology/NumerologyStartForm";

export const metadata = pageMeta({
  title: "開始計算｜輸入出生年月日算生命靈數",
  description:
    "輸入出生年月日，立即計算你的生命靈數與大師數，取得九宮格先天數字盤、性格天賦解析與今年流年運勢。",
  path: "/numerology/start",
});

export default function NumerologyStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "生命靈數", path: "/numerology" },
          { name: "開始計算", path: "/numerology/start" },
        ]}
      />
      <NumerologyStartForm />
    </div>
  );
}
