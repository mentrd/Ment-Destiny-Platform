import Link from "next/link";
import { FEATURES, CATEGORY_LABELS } from "@/lib/features";
import { getVisibleFeatures } from "@/lib/feature-config";
import { ZODIAC_SIGNS } from "@/lib/engines/horoscope-data";
import FeatureCard from "@/components/FeatureCard";
import { readContent, readDb, type StatRow } from "@/lib/db";
import { getArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  announcement?: string;
  featureOrder?: string[];
}

const DEFAULT_HOME: HomepageConfig = {
  heroTitle: "在星光之間，遇見更完整的自己",
  heroSubtitle: "塔羅、八字、紫微、占星、靈籤——12 種命理系統，即測即得，免費體驗",
};

async function getPopularFeatures(): Promise<{ slug: string; count: number }[]> {
  const stats = await readDb<StatRow[]>("stats", []);
  const counts = new Map<string, number>();
  for (const s of stats) {
    if (s.type === "reading_complete" && s.feature) {
      counts.set(s.feature, (counts.get(s.feature) ?? 0) + s.count);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
}

export default async function HomePage() {
  const config = await readContent<HomepageConfig>("homepage", DEFAULT_HOME);
  const popular = await getPopularFeatures();
  const articles = (await getArticles()).filter((a) => a.published).slice(0, 3);
  const visibleFeatures = await getVisibleFeatures();

  return (
    <div className="mx-auto max-w-6xl px-4">
      {config.announcement && (
        <p className="mt-4 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-center text-sm text-gold-300">
          📢 {config.announcement}
        </p>
      )}

      {/* Hero */}
      <section className="py-14 text-center sm:py-20">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>🌙</p>
        <h1 className="mx-auto max-w-2xl font-serif text-3xl font-bold leading-snug sm:text-5xl">
          <span className="text-gradient-gold">{config.heroTitle}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300 sm:text-lg">{config.heroSubtitle}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/categories" className="btn-gold">✨ 探索全部功能</Link>
          <Link href="/tarot/daily" className="btn-ghost">🃏 抽今日塔羅</Link>
        </div>
      </section>

      {/* 今日運勢速覽 */}
      <section className="card-mystic p-5" aria-labelledby="daily-title">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="daily-title" className="font-serif text-lg font-bold text-gold-400">🌠 今日星座運勢</h2>
          <Link href="/horoscope" className="text-sm text-mystic-300 hover:text-gold-300">全部運勢 →</Link>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
          {ZODIAC_SIGNS.map((s) => (
            <Link
              key={s.slug}
              href={`/horoscope/daily/${s.slug}`}
              className="flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-center transition hover:bg-mystic-500/15"
            >
              <span className="text-2xl" aria-hidden>{s.emoji}</span>
              <span className="text-xs text-ink-300">{s.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 熱門排行 */}
      {popular.length > 0 && (
        <section className="mt-10" aria-labelledby="popular-title">
          <h2 id="popular-title" className="divider-star font-serif text-lg font-bold">🔥 本站熱門</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {popular.map((p, i) => {
              const f = FEATURES.find((x) => x.slug === p.slug);
              if (!f) return null;
              return (
                <Link key={p.slug} href={`/${f.slug}`} className="card-mystic card-mystic-hover flex items-center gap-3 p-4">
                  <span className="font-serif text-2xl font-bold text-gold-500/70">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-bold">{f.icon} {f.name}</span>
                    <span className="block text-xs text-ink-500">{p.count.toLocaleString()} 次測算</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 功能卡片牆（依分類） */}
      {(["divination", "chart", "fortune", "match"] as const).map((cat) => {
        const feats = visibleFeatures.filter((f) => f.category === cat);
        if (feats.length === 0) return null;
        return (
          <section key={cat} className="mt-12" aria-label={CATEGORY_LABELS[cat]}>
            <h2 className="divider-star font-serif text-lg font-bold">✦ {CATEGORY_LABELS[cat]} ✦</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {feats.map((f) => (
                <FeatureCard key={f.slug} feature={f} />
              ))}
            </div>
          </section>
        );
      })}

      {/* 最新文章 */}
      {articles.length > 0 && (
        <section className="mt-12" aria-labelledby="articles-title">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="articles-title" className="font-serif text-lg font-bold text-gold-400">📖 命理知識</h2>
            <Link href="/articles" className="text-sm text-mystic-300 hover:text-gold-300">更多文章 →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="card-mystic card-mystic-hover p-5">
                <p className="text-xs text-mystic-300">{a.category}</p>
                <h3 className="mt-1 font-serif font-bold text-ink-100">{a.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-500">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
