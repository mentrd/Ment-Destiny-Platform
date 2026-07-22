import { pageMeta } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";
import RecordList from "@/components/me/RecordList";

export const metadata = pageMeta({
  title: "我的收藏",
  description: "您在星語命理收藏的測算結果，隨時回味喜歡的塔羅、命盤與運勢解讀。",
  path: "/me/favorites",
  noindex: true,
});

export default function FavoritesPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 pb-12">
      <Breadcrumbs
        items={[
          { name: "會員中心", path: "/me" },
          { name: "我的收藏", path: "/me/favorites" },
        ]}
      />
      <h1 className="font-serif text-2xl font-bold text-gradient-gold">⭐ 我的收藏</h1>
      <p className="mt-2 text-sm text-ink-300">收藏喜歡的結果，點「重看結果」即可重現當時的結果頁</p>
      <RecordList kind="favorites" />
    </div>
  );
}
