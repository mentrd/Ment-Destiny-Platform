import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import BaziStartForm from "@/components/bazi/BaziStartForm";

export const metadata = pageMeta({
  title: "開始排盤｜輸入出生資料排八字四柱命盤",
  description:
    "輸入出生年月日、時辰、性別與出生地，立即排出八字四柱命盤，分析五行比例、日主強弱、喜用神與十年大運。不知道時辰也可以先以三柱排盤。",
  path: "/bazi/start",
});

export default function BaziStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "八字命盤", path: "/bazi" },
          { name: "開始排盤", path: "/bazi/start" },
        ]}
      />
      <BaziStartForm />
    </div>
  );
}
