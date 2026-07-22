import Link from "next/link";
import { getArticles } from "@/lib/articles";
import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "命理知識文章",
  description:
    "塔羅入門、八字五行、占星科普、靈籤文化、生命靈數與解夢心理學——星語命理的命理知識專區，帶你用現代視角理解古老智慧。",
  path: "/articles",
});

export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = (await getArticles()).filter((a) => a.published);
  const categories = [...new Set(articles.map((a) => a.category))];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs items={[{ name: "命理文章", path: "/articles" }]} />
      <h1 className="font-serif text-3xl font-bold">
        <span className="text-gradient-gold">命理知識</span>
      </h1>
      <p className="mt-2 text-ink-300">用現代視角理解古老智慧，命理入門從這裡開始。</p>

      <p className="mt-4 flex flex-wrap gap-2 text-xs">
        {categories.map((c) => (
          <span key={c} className="rounded-full border border-mystic-500/30 px-3 py-1 text-mystic-300">
            {c}
          </span>
        ))}
      </p>

      <div className="mt-8 space-y-4">
        {articles.map((a) => (
          <Link key={a.slug} href={`/articles/${a.slug}`} className="card-mystic card-mystic-hover block p-6">
            <p className="text-xs text-mystic-300">
              {a.category} ・ {new Date(a.createdAt).toLocaleDateString("zh-TW")}
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold text-ink-100">{a.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{a.excerpt}</p>
          </Link>
        ))}
        {articles.length === 0 && <p className="py-12 text-center text-ink-500">目前還沒有文章，敬請期待。</p>}
      </div>
    </div>
  );
}
