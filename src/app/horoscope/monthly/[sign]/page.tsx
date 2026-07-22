import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import RelatedFeatures from "@/components/RelatedFeatures";
import FortuneAspects from "@/components/horoscope/FortuneAspects";
import LuckyGrid from "@/components/horoscope/LuckyGrid";
import SwitchChips from "@/components/horoscope/SwitchChips";
import { readContent } from "@/lib/db";
import { DEFAULT_COPY, MONTHLY_COPY } from "@/lib/engines/horoscope-copy";
import { ZODIAC_SIGNS, getSign } from "@/lib/engines/horoscope-data";
import { getMonthlyFortune, monthKeyOf, taipeiTodayStr } from "@/lib/engines/horoscope";
import { SITE, pageMeta } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) return {};
  const today = taipeiTodayStr();
  const [y, m] = today.split("-").map(Number);
  return pageMeta({
    title: `${sign.name}${m}月運勢（${y}）`,
    description: `${sign.name}（${sign.dateRange}）${y}年${m}月運勢解析：本月整體走向與愛情、事業、財運、健康五大指數，附本月幸運色與幸運數字，每月更新。`,
    path: `/horoscope/monthly/${sign.slug}`,
  });
}

export default async function MonthlySignPage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) notFound();

  const copy = await readContent("horoscope-copy", DEFAULT_COPY);
  const today = taipeiTodayStr();
  const ymKey = monthKeyOf(today);
  const [y, m] = today.split("-").map(Number);
  const f = getMonthlyFortune(sign.slug, ymKey, copy, MONTHLY_COPY);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${sign.name}${m}月運勢（${y}）`,
          description: `${sign.name}${y}年${m}月整體運勢走向與五大指數解析。`,
          datePublished: `${today}T00:00:00+08:00`,
          inLanguage: "zh-Hant-TW",
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      <Breadcrumbs
        items={[
          { name: "星座生肖運勢", path: "/horoscope" },
          { name: `${sign.name}本月運勢`, path: `/horoscope/monthly/${sign.slug}` },
        ]}
      />

      <header className="text-center">
        <p aria-hidden className="text-5xl">{sign.emoji}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-gradient-gold">
          {sign.name}{m}月運勢
        </h1>
        <p className="mt-2 text-sm text-ink-300">
          {y}年{m}月（{ymKey}）
        </p>
        <p className="mt-1 text-xs text-ink-500">{sign.dateRange} ・ 每月一日（台北時間）更新</p>
      </header>

      <div className="mt-8 space-y-6">
        <FortuneAspects aspects={f.aspects} />

        <section className="card-mystic rise-stagger space-y-4 p-5">
          <p className="divider-star text-sm font-semibold">✦ 本月運勢解析 ✦</p>
          {f.paragraphs.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-ink-300">{p}</p>
          ))}
        </section>

        <LuckyGrid color={f.luckyColor} number={f.luckyNumber} />

        <div className="flex flex-wrap justify-center gap-3">
          <Link href={`/horoscope/daily/${sign.slug}`} className="btn-gold">
            看{sign.name}今日運勢
          </Link>
          <Link href={`/horoscope/weekly/${sign.slug}`} className="btn-ghost">
            看{sign.name}本週運勢
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 看其他星座 ✦</p>
        <SwitchChips items={ZODIAC_SIGNS} basePath="/horoscope/monthly" current={sign.slug} />
      </section>

      <Disclaimer />
      <RelatedFeatures slug="horoscope" />
    </div>
  );
}
