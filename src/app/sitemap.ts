import type { MetadataRoute } from "next";
import { FEATURES } from "@/lib/features";
import { getArticles } from "@/lib/articles";
import { ZODIAC_SIGNS, CHINESE_ZODIAC } from "@/lib/engines/horoscope-data";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE.url}/horoscope`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/articles`, changeFrequency: "weekly", priority: 0.8 },
    ...["privacy", "terms", "disclaimer", "contact"].map((p) => ({
      url: `${SITE.url}/${p}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];

  for (const f of FEATURES) {
    entries.push({ url: `${SITE.url}/${f.slug}`, changeFrequency: "weekly", priority: 0.9 });
  }

  // 塔羅六模式
  for (const mode of ["single", "three", "love", "career", "yesno", "daily"]) {
    entries.push({ url: `${SITE.url}/tarot/${mode}`, changeFrequency: "weekly", priority: 0.7 });
  }
  // 籤種
  for (const set of ["yuelao", "guanyin", "guandi", "mazu"]) {
    entries.push({ url: `${SITE.url}/lots/${set}`, changeFrequency: "weekly", priority: 0.7 });
  }
  // 配對
  for (const t of ["name", "birthday", "zodiac", "animal"]) {
    entries.push({ url: `${SITE.url}/match/${t}`, changeFrequency: "weekly", priority: 0.7 });
  }
  // 運勢頁（SEO 主力）
  for (const s of ZODIAC_SIGNS) {
    entries.push({ url: `${SITE.url}/horoscope/daily/${s.slug}`, changeFrequency: "daily", priority: 0.9, lastModified: now });
    entries.push({ url: `${SITE.url}/horoscope/weekly/${s.slug}`, changeFrequency: "weekly", priority: 0.7 });
    entries.push({ url: `${SITE.url}/horoscope/monthly/${s.slug}`, changeFrequency: "monthly", priority: 0.7 });
  }
  for (const a of CHINESE_ZODIAC) {
    entries.push({ url: `${SITE.url}/horoscope/zodiac/${a.slug}`, changeFrequency: "daily", priority: 0.8, lastModified: now });
  }

  const articles = (await getArticles()).filter((a) => a.published);
  for (const a of articles) {
    entries.push({
      url: `${SITE.url}/articles/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
