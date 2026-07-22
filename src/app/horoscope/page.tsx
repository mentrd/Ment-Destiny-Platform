import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import RelatedFeatures from "@/components/RelatedFeatures";
import StarRating from "@/components/StarRating";
import SwitchChips from "@/components/horoscope/SwitchChips";
import { readContent } from "@/lib/db";
import { DEFAULT_COPY } from "@/lib/engines/horoscope-copy";
import { CHINESE_ZODIAC, ZODIAC_SIGNS } from "@/lib/engines/horoscope-data";
import {
  formatDateZh,
  getAnimalFortune,
  getDailyFortune,
  taipeiTodayStr,
} from "@/lib/engines/horoscope";
import { pageMeta } from "@/lib/site";

export const revalidate = 3600;

export const metadata = pageMeta({
  title: "星座生肖每日運勢",
  description:
    "12 星座與 12 生肖今日運勢免費查詢：綜合、愛情、事業、財運、健康五大指數，附幸運色、幸運數字、幸運方位與宜忌提醒，並提供每週、每月運勢。",
  path: "/horoscope",
});

export default async function HoroscopePage() {
  const copy = await readContent("horoscope-copy", DEFAULT_COPY);
  const today = taipeiTodayStr();

  const signCards = ZODIAC_SIGNS.map((s) => ({
    sign: s,
    overall: getDailyFortune(s.slug, today, copy).aspects[0].level,
  }));
  const animalCards = CHINESE_ZODIAC.map((a) => ({
    animal: a,
    overall: getAnimalFortune(a.slug, today, copy).aspects[0].level,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Breadcrumbs items={[{ name: "星座生肖運勢", path: "/horoscope" }]} />

      <header className="text-center">
        <h1 className="font-serif text-3xl font-bold text-gradient-gold sm:text-4xl">
          星座生肖運勢
        </h1>
        <p className="mt-2 text-sm text-ink-300">{formatDateZh(today)}</p>
        <p className="mt-1 text-xs text-ink-500">
          每日更新的 12 星座與 12 生肖運勢指數，點進去看完整幸運色、宜忌與速配。
        </p>
      </header>

      {/* 12 星座今日運勢 */}
      <section className="mt-8">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 12 星座今日運勢 ✦</p>
        <div className="rise-stagger grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {signCards.map(({ sign, overall }) => (
            <Link
              key={sign.slug}
              href={`/horoscope/daily/${sign.slug}`}
              className="card-mystic card-mystic-hover flex flex-col items-center gap-1 p-4 text-center"
            >
              <span aria-hidden className="text-3xl">{sign.emoji}</span>
              <span className="font-serif font-bold text-ink-100">{sign.name}</span>
              <span className="text-xs text-ink-500">{sign.dateRange}</span>
              <StarRating value={overall} />
            </Link>
          ))}
        </div>
      </section>

      {/* 週運 / 月運入口 */}
      <section className="mt-10 grid gap-3 sm:grid-cols-2">
        <div className="card-mystic p-5">
          <h2 className="font-serif text-lg font-bold text-ink-100">本週星座運勢</h2>
          <p className="mt-1 text-xs text-ink-500">以台北時間週一起算，一次看整週走向。</p>
          <div className="mt-3">
            <SwitchChips items={ZODIAC_SIGNS} basePath="/horoscope/weekly" />
          </div>
        </div>
        <div className="card-mystic p-5">
          <h2 className="font-serif text-lg font-bold text-ink-100">本月星座運勢</h2>
          <p className="mt-1 text-xs text-ink-500">每月整體趨勢與重點提醒，月初必看。</p>
          <div className="mt-3">
            <SwitchChips items={ZODIAC_SIGNS} basePath="/horoscope/monthly" />
          </div>
        </div>
      </section>

      {/* 12 生肖今日運勢 */}
      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 12 生肖今日運勢 ✦</p>
        <div className="rise-stagger grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {animalCards.map(({ animal, overall }) => (
            <Link
              key={animal.slug}
              href={`/horoscope/zodiac/${animal.slug}`}
              className="card-mystic card-mystic-hover flex flex-col items-center gap-1 p-4 text-center"
            >
              <span aria-hidden className="text-3xl">{animal.emoji}</span>
              <span className="font-serif font-bold text-ink-100">
                {animal.name}
                <span className="ml-1 text-xs font-normal text-ink-500">{animal.branch}</span>
              </span>
              <StarRating value={overall} />
            </Link>
          ))}
        </div>
      </section>

      <Disclaimer />
      <RelatedFeatures slug="horoscope" />
    </div>
  );
}
