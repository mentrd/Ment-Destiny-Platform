import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import RelatedFeatures from "@/components/RelatedFeatures";
import DoAvoid from "@/components/horoscope/DoAvoid";
import FortuneAspects from "@/components/horoscope/FortuneAspects";
import LuckyGrid from "@/components/horoscope/LuckyGrid";
import SwitchChips from "@/components/horoscope/SwitchChips";
import { readContent } from "@/lib/db";
import { DEFAULT_COPY } from "@/lib/engines/horoscope-copy";
import { ZODIAC_SIGNS, getSign } from "@/lib/engines/horoscope-data";
import {
  formatDateZh,
  formatMonthDay,
  getDailyFortune,
  taipeiTodayStr,
} from "@/lib/engines/horoscope";
import { SITE, pageMeta } from "@/lib/site";

export const revalidate = 3600;

const ELEMENT_LABEL: Record<string, string> = {
  fire: "火象星座",
  earth: "土象星座",
  air: "風象星座",
  water: "水象星座",
};

export function generateStaticParams() {
  return ZODIAC_SIGNS.map((s) => ({ sign: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) return {};
  const today = taipeiTodayStr();
  return pageMeta({
    title: `${sign.name}今日運勢 ${formatMonthDay(today)}`,
    description: `${sign.name}（${sign.dateRange}）今日運勢：綜合、愛情、事業、財運、健康五大指數與詳細解析，附幸運色、幸運數字、幸運方位、速配星座與今日宜忌。`,
    path: `/horoscope/daily/${sign.slug}`,
  });
}

export default async function DailySignPage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign: slug } = await params;
  const sign = getSign(slug);
  if (!sign) notFound();

  const copy = await readContent("horoscope-copy", DEFAULT_COPY);
  const today = taipeiTodayStr();
  const f = getDailyFortune(sign.slug, today, copy);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${sign.name}今日運勢 ${formatMonthDay(today)}`,
          description: `${sign.name}今日綜合、愛情、事業、財運、健康運勢與幸運指南。`,
          datePublished: `${today}T00:00:00+08:00`,
          inLanguage: "zh-Hant-TW",
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      <Breadcrumbs
        items={[
          { name: "星座生肖運勢", path: "/horoscope" },
          { name: `${sign.name}今日運勢`, path: `/horoscope/daily/${sign.slug}` },
        ]}
      />

      <header className="text-center">
        <p aria-hidden className="text-5xl">{sign.emoji}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-gradient-gold">
          {sign.name}今日運勢
        </h1>
        <p className="mt-2 text-sm text-ink-300">{formatDateZh(today)}</p>
        <p className="mt-1 text-xs text-ink-500">
          {sign.dateRange} ・ {ELEMENT_LABEL[sign.element]} ・ 守護星 {sign.ruler}
        </p>
      </header>

      <div className="mt-8 space-y-6">
        <FortuneAspects aspects={f.aspects} />

        <section>
          <p className="divider-star mb-3 text-sm font-semibold">✦ 今日幸運指南 ✦</p>
          <LuckyGrid
            color={f.luckyColor}
            number={f.luckyNumber}
            direction={f.luckyDirection}
            match={{ emoji: f.matchSign.emoji, name: f.matchSign.name, label: "今日速配星座" }}
          />
        </section>

        <DoAvoid good={f.goodTip} bad={f.badTip} />

        <div className="flex flex-wrap justify-center gap-3">
          <Link href={`/horoscope/weekly/${sign.slug}`} className="btn-ghost">
            看{sign.name}本週運勢
          </Link>
          <Link href={`/horoscope/monthly/${sign.slug}`} className="btn-ghost">
            看{sign.name}本月運勢
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 看其他星座 ✦</p>
        <SwitchChips items={ZODIAC_SIGNS} basePath="/horoscope/daily" current={sign.slug} />
      </section>

      <Disclaimer />
      <RelatedFeatures slug="horoscope" />
    </div>
  );
}
