import { notFound } from "next/navigation";
import { getArticle, getArticles } from "@/lib/articles";
import { markdownToHtml } from "@/lib/markdown";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import RelatedFeatures from "@/components/RelatedFeatures";
import { SITE, pageMeta } from "@/lib/site";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || !article.published) return {};
  return pageMeta({
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    path: `/articles/${article.slug}`,
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || !article.published) notFound();

  const others = (await getArticles()).filter((a) => a.published && a.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          datePublished: new Date(article.createdAt).toISOString(),
          dateModified: new Date(article.updatedAt).toISOString(),
          inLanguage: "zh-Hant-TW",
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      <Breadcrumbs
        items={[
          { name: "命理文章", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ]}
      />
      <article>
        <p className="text-xs text-mystic-300">
          {article.category} ・ {new Date(article.createdAt).toLocaleDateString("zh-TW")}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-snug text-ink-100">{article.title}</h1>
        <div
          className="prose-mystic mt-6 [&_blockquote]:my-4 [&_blockquote]:rounded-xl [&_blockquote]:border [&_blockquote]:border-gold-500/30 [&_blockquote]:bg-gold-500/5 [&_blockquote]:px-5 [&_blockquote]:py-3"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
        />
      </article>

      {others.length > 0 && (
        <section className="mt-12">
          <p className="divider-star mb-4 text-sm font-semibold">✦ 繼續閱讀 ✦</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {others.map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="card-mystic card-mystic-hover p-4">
                <p className="text-xs text-mystic-300">{a.category}</p>
                <p className="mt-1 text-sm font-bold text-ink-100">{a.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
      <RelatedFeatures slug="tarot" />
    </div>
  );
}
