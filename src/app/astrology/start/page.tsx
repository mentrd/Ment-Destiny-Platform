import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import AstrologyStartForm from "@/components/astrology/AstrologyStartForm";

export const metadata = pageMeta({
  title: "開始排盤｜輸入出生資料計算太陽月亮上升星座",
  description:
    "輸入出生年月日、出生時間與出生城市，立即計算你的太陽、月亮與上升星座並繪製本命盤。不知道出生時間也可以先算太陽與月亮星座。",
  path: "/astrology/start",
});

export default function AstrologyStartPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Breadcrumbs
        items={[
          { name: "西洋占星", path: "/astrology" },
          { name: "開始排盤", path: "/astrology/start" },
        ]}
      />
      <AstrologyStartForm />
    </div>
  );
}
