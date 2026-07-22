import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import RecordList from "@/components/me/RecordList";

export const metadata = pageMeta({
  title: "歷史紀錄",
  description: "回顧您在星語命理的每一次測算紀錄，隨時重看塔羅、八字、紫微等結果。",
  path: "/me/history",
  noindex: true,
});

export default function HistoryPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-12">
      <Breadcrumbs
        items={[
          { name: "會員中心", path: "/me" },
          { name: "歷史紀錄", path: "/me/history" },
        ]}
      />
      <h1 className="font-serif text-2xl font-bold text-gradient-gold">🕘 歷史紀錄</h1>
      <p className="mt-2 text-sm text-ink-300">回顧每一次測算，點「重看結果」即可重現當時的結果頁</p>
      <RecordList kind="history" />
    </div>
  );
}
