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
import { CHINESE_ZODIAC, animalFromYear, getAnimal } from "@/lib/engines/horoscope-data";
import {
  formatDateZh,
  formatMonthDay,
  getAnimalFortune,
  taipeiTodayStr,
} from "@/lib/engines/horoscope";
import { SITE, pageMeta } from "@/lib/site";

export const revalidate = 3600;

export function generateStaticParams() {
  return CHINESE_ZODIAC.map((a) => ({ animal: a.slug }));
}

/** 該生肖的西曆年份對照（近百年區間） */
function yearsOf(animalSlug: string, thisYear: number): number[] {
  const years: number[] = [];
  for (let y = thisYear - 96; y <= thisYear + 11; y++) {
    if (animalFromYear(y).slug === animalSlug) years.push(y);
  }
  return years;
}

export async function generateMetadata({ params }: { params: Promise<{ animal: string }> }) {
  const { animal: slug } = await params;
  const animal = getAnimal(slug);
  if (!animal) return {};
  const today = taipeiTodayStr();
  return pageMeta({
    title: `屬${animal.name}今日運勢 ${formatMonthDay(today)}`,
    description: `生肖屬${animal.name}（${animal.branch}）今日運勢：綜合、愛情、事業、財運、健康五大指數與解析，附幸運色、幸運數字、幸運方位、六合速配與沖煞小提醒。`,
    path: `/horoscope/zodiac/${animal.slug}`,
  });
}

export default async function AnimalPage({ params }: { params: Promise<{ animal: string }> }) {
  const { animal: slug } = await params;
  const animal = getAnimal(slug);
  if (!animal) notFound();

  const copy = await readContent("horoscope-copy", DEFAULT_COPY);
  const today = taipeiTodayStr();
  const f = getAnimalFortune(animal.slug, today, copy);
  const thisYear = Number(today.slice(0, 4));
  const years = yearsOf(animal.slug, thisYear);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `屬${animal.name}今日運勢 ${formatMonthDay(today)}`,
          description: `生肖屬${animal.name}今日綜合、愛情、事業、財運、健康運勢與幸運指南。`,
          datePublished: `${today}T00:00:00+08:00`,
          inLanguage: "zh-Hant-TW",
          author: { "@type": "Organization", name: SITE.name },
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      <Breadcrumbs
        items={[
          { name: "星座生肖運勢", path: "/horoscope" },
          { name: `屬${animal.name}今日運勢`, path: `/horoscope/zodiac/${animal.slug}` },
        ]}
      />

      <header className="text-center">
        <p aria-hidden className="text-5xl">{animal.emoji}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-gradient-gold">
          屬{animal.name}今日運勢
        </h1>
        <p className="mt-2 text-sm text-ink-300">{formatDateZh(today)}</p>
        <p className="mt-1 text-xs text-ink-500">地支「{animal.branch}」・ 每日更新</p>
      </header>

      <div className="mt-8 space-y-6">
        <FortuneAspects aspects={f.aspects} />

        {/* 沖煞小提醒 */}
        <section className="card-mystic border-rose-400/25 p-5">
          <h2 className="font-serif text-base font-bold text-rose-400">
            沖煞小提醒：今日沖屬{f.conflictAnimal.name} {f.conflictAnimal.emoji}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.conflictNote}</p>
          <p className="mt-2 text-xs text-ink-500">
            沖煞為傳統民俗說法，輕鬆參考就好，好心情才是每天最好的開運物。
          </p>
        </section>

        <section>
          <p className="divider-star mb-3 text-sm font-semibold">✦ 今日幸運指南 ✦</p>
          <LuckyGrid
            color={f.luckyColor}
            number={f.luckyNumber}
            direction={f.luckyDirection}
            match={{ emoji: f.bestMatch.emoji, name: `屬${f.bestMatch.name}`, label: "六合速配" }}
          />
        </section>

        <DoAvoid good={f.goodTip} bad={f.badTip} />

        {/* 年份對照 */}
        <section className="card-mystic p-5">
          <h2 className="font-serif text-base font-bold text-ink-100">
            屬{animal.name}的出生年份對照
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {years.map((y) => (
              <span
                key={y}
                className="rounded-full border border-mystic-500/25 bg-night-900/60 px-3 py-1 text-xs text-ink-300"
              >
                {y}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-500">
            以上為西曆年份的簡易對照。傳統命理以「立春」（約每年 2 月 4 日前後）為生肖分界，
            國曆 1 月至立春前出生者，生肖多屬前一年，實際歸屬可再以農曆生辰確認。
          </p>
        </section>
      </div>

      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 看其他生肖 ✦</p>
        <SwitchChips
          items={CHINESE_ZODIAC.map((a) => ({ slug: a.slug, name: `屬${a.name}`, emoji: a.emoji }))}
          basePath="/horoscope/zodiac"
          current={animal.slug}
        />
      </section>

      <div className="mt-8 text-center">
        <Link href="/horoscope" className="btn-ghost">回星座生肖運勢總覽</Link>
      </div>

      <Disclaimer />
      <RelatedFeatures slug="horoscope" />
    </div>
  );
}
