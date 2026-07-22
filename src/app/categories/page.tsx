import { CATEGORY_LABELS } from "@/lib/features";
import { getVisibleFeatures } from "@/lib/feature-config";
import FeatureCard from "@/components/FeatureCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "全部算命功能分類",
  description:
    "星語命理全功能總覽：塔羅占卜、易經卜卦、線上抽籤、八字命盤、紫微斗數、西洋占星、姓名學、生命靈數、星座生肖運勢、愛情配對、解夢與手面相分析，全部免費線上體驗。",
  path: "/categories",
});

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const visibleFeatures = await getVisibleFeatures();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ name: "功能分類", path: "/categories" }]} />
      <h1 className="font-serif text-3xl font-bold">
        <span className="text-gradient-gold">全部算命功能</span>
      </h1>
      <p className="mt-2 text-ink-300">
        12 種命理系統，從東方八字紫微到西方塔羅占星，選一個現在最想探索的吧。
      </p>

      {(["divination", "chart", "fortune", "match"] as const).map((cat) => {
        const feats = visibleFeatures.filter((f) => f.category === cat);
        if (feats.length === 0) return null;
        return (
          <section key={cat} className="mt-10" aria-label={CATEGORY_LABELS[cat]}>
            <h2 className="divider-star font-serif text-xl font-bold">✦ {CATEGORY_LABELS[cat]} ✦</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {feats.map((f) => (
                <FeatureCard key={f.slug} feature={f} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
