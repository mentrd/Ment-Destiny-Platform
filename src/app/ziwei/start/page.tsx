import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import ZiweiStartForm from "@/components/ziwei/ZiweiStartForm";

export const metadata = pageMeta({
  title: "開始排盤｜輸入出生資料排紫微斗數命盤",
  description:
    "輸入出生年月日、時辰、性別與出生地，立即排出紫微斗數十二宮命盤：命宮身宮、五行局、十四主星與生年四化解析。",
  path: "/ziwei/start",
});

export default function ZiweiStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "紫微斗數", path: "/ziwei" },
          { name: "開始排盤", path: "/ziwei/start" },
        ]}
      />
      <ZiweiStartForm />
    </div>
  );
}
