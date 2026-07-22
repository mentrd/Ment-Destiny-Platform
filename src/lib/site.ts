import type { Metadata } from "next";

export const SITE = {
  name: "星語命理",
  nameEn: "StarWhisper",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description:
    "星語命理：免費線上塔羅占卜、八字命盤、紫微斗數、西洋占星、每日星座運勢、姓名學、生命靈數、易經卜卦、觀音月老靈籤、愛情配對與解夢。即測即得，娛樂與自我探索的命理平台。",
  disclaimer:
    "本平台所有測算結果僅供娛樂、文化與自我探索參考，不構成醫療、法律、投資或任何專業建議。",
};

/** 產生各頁 metadata（title 模板統一） */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  const url = `${SITE.url}${opts.path}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: `${opts.title}｜${SITE.name}`,
      description: opts.description,
      url,
      siteName: SITE.name,
      type: "website",
      locale: "zh_TW",
    },
    twitter: {
      card: "summary_large_image",
      title: `${opts.title}｜${SITE.name}`,
      description: opts.description,
    },
  };
}

/** JSON-LD 結構化資料 <script> 內容 */
export function jsonLd(data: object): string {
  return JSON.stringify(data);
}

export function faqJsonLd(faqs: { q: string; a: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.url}${it.path}`,
    })),
  };
}
