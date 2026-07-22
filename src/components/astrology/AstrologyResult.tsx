"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeParams } from "@/lib/encode";
import { computeChart, CITIES } from "@/lib/engines/astrology";
import {
  SUN_READINGS,
  MOON_READINGS,
  RISING_READINGS,
  PLANET_MEANINGS,
  planetElementComment,
  buildOverview,
} from "@/lib/engines/astrology-copy";
import ResultShell from "@/components/ResultShell";
import ChartWheel from "@/components/astrology/ChartWheel";

interface AstroParams {
  y: number;
  m: number;
  d: number;
  h: number;
  mi: number;
  c: number;
  u?: 1;
}

function isValid(p: AstroParams | null): p is AstroParams {
  if (!p) return false;
  const { y, m, d, h, mi, c } = p;
  return (
    Number.isInteger(y) && y >= 1900 && y <= 2100 &&
    Number.isInteger(m) && m >= 1 && m <= 12 &&
    Number.isInteger(d) && d >= 1 && d <= 31 &&
    Number.isInteger(h) && h >= 0 && h <= 23 &&
    Number.isInteger(mi) && mi >= 0 && mi <= 59 &&
    Number.isInteger(c) && c >= 0 && c < CITIES.length
  );
}

function InvalidNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>🌫️</p>
      <h1 className="mt-4 font-serif text-xl font-bold text-ink-100">找不到這張星盤</h1>
      <p className="mt-2 text-sm text-ink-300">
        連結似乎不完整或已失效，請重新輸入出生資料，一分鐘就能排好你的本命盤。
      </p>
      <div className="mt-6">
        <Link href="/astrology/start" className="btn-gold">🔭 重新排盤</Link>
      </div>
    </div>
  );
}

export default function AstrologyResult() {
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const data = useMemo(() => {
    const p = encoded ? decodeParams<AstroParams>(encoded) : null;
    if (!isValid(p)) return null;
    return {
      params: p,
      chart: computeChart({
        y: p.y,
        m: p.m,
        d: p.d,
        hour: p.h,
        minute: p.mi,
        cityIndex: p.c,
        unknownTime: p.u === 1,
      }),
    };
  }, [encoded]);

  if (!data) return <InvalidNotice />;
  const { params, chart } = data;

  const { sun, moon, ascendant, unknownTime } = chart;
  const overview = buildOverview(sun.sign, moon.sign, ascendant?.sign ?? null, chart.planets);
  const title = `太陽${sun.sign.name}・月亮${moon.sign.name}${ascendant ? `・上升${ascendant.sign.name}` : ""}`;
  const birthLabel = `${params.y} 年 ${params.m} 月 ${params.d} 日${unknownTime ? "（時間未知）" : ` ${String(params.h).padStart(2, "0")}:${String(params.mi).padStart(2, "0")}`}・${chart.city.name}`;

  const big3 = [
    {
      key: "sun",
      label: "太陽星座",
      sub: "自我核心",
      sign: sun.sign,
      deg: sun.degreeInSign,
      text: SUN_READINGS[sun.sign.slug],
      note: null as string | null,
    },
    {
      key: "moon",
      label: "月亮星座",
      sub: "內在情緒",
      sign: moon.sign,
      deg: moon.degreeInSign,
      text: MOON_READINGS[moon.sign.slug],
      note: unknownTime ? "出生時間未知，月亮位置以當天中午 12:00 估算，少數情況可能相差一個星座。" : null,
    },
  ];

  return (
    <ResultShell
      feature="astrology"
      featureName="西洋占星"
      title={title}
      summary={overview[0]}
      retryHref="/astrology/start"
    >
      {/* 標題 */}
      <header className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold sm:text-3xl">
          <span className="text-gradient-gold">{title}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-500">{birthLabel}</p>
      </header>

      {/* 三大卡 */}
      <section aria-label="太陽月亮上升解讀" className="space-y-4">
        {big3.map((b) => (
          <article key={b.key} className="card-mystic p-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl text-gold-400" aria-hidden>{b.sign.emoji}</span>
              <div>
                <p className="text-xs text-mystic-300">{b.label}・{b.sub}</p>
                <h2 className="font-serif text-xl font-bold text-gold-400">
                  {b.sign.name}
                  <span className="ml-2 text-sm font-normal text-ink-500">{b.deg.toFixed(1)}°</span>
                </h2>
              </div>
            </div>
            <p className="mt-3 leading-relaxed text-ink-100">{b.text}</p>
            {b.note && (
              <p className="mt-3 rounded-xl border border-mystic-400/30 bg-mystic-500/10 px-3 py-2 text-xs text-mystic-300">
                ℹ️ {b.note}
              </p>
            )}
          </article>
        ))}

        {/* 上升卡 */}
        {ascendant ? (
          <article className="card-mystic p-5">
            <div className="flex items-center gap-3">
              <span className="text-4xl text-gold-400" aria-hidden>{ascendant.sign.emoji}</span>
              <div>
                <p className="text-xs text-mystic-300">上升星座・第一印象</p>
                <h2 className="font-serif text-xl font-bold text-gold-400">
                  {ascendant.sign.name}
                  <span className="ml-2 text-sm font-normal text-ink-500">{ascendant.degreeInSign.toFixed(1)}°</span>
                </h2>
              </div>
            </div>
            <p className="mt-3 leading-relaxed text-ink-100">{RISING_READINGS[ascendant.sign.slug]}</p>
          </article>
        ) : (
          <article className="card-mystic p-5 text-center">
            <p className="text-4xl" aria-hidden>🌅</p>
            <h2 className="mt-2 font-serif text-lg font-bold text-ink-100">上升星座：需要出生時間</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-300">
              上升星座約每兩小時就換一個，沒有出生時間便無法計算。
              可以翻閱出生證明、寶寶手冊，或向家人詢問大概的時段，再回來補上時間，就能看見完整的三王配置。
            </p>
            <div className="mt-4">
              <Link href="/astrology/start" className="btn-ghost">🕐 補上出生時間</Link>
            </div>
          </article>
        )}
      </section>

      {/* 星盤輪 */}
      <section aria-label="本命盤星盤輪" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 你的本命盤 ✦</h2>
        <ChartWheel chart={chart} />
        <p className="mt-3 text-center text-xs text-ink-500">
          外圈為十二星座（每格 30°），符號為七大行星於出生時刻的黃道位置
          {ascendant ? "，粉色線為上升點（ASC）" : ""}。
        </p>
      </section>

      {/* 行星落座表 */}
      <section aria-label="行星落座" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 七大行星落座 ✦</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gold-500/20 text-xs text-mystic-300">
                <th scope="col" className="py-2 pr-2 font-normal">行星</th>
                <th scope="col" className="py-2 pr-2 font-normal">落座</th>
                <th scope="col" className="py-2 pr-2 font-normal">度數</th>
                <th scope="col" className="py-2 font-normal">短評</th>
              </tr>
            </thead>
            <tbody>
              {chart.planets.map((p) => (
                <tr key={p.id} className="border-b border-ink-500/10 align-top">
                  <th scope="row" className="whitespace-nowrap py-2.5 pr-2 font-bold text-ink-100">
                    <span className="mr-1 text-gold-400" aria-hidden>{p.symbol}</span>
                    {p.name}
                  </th>
                  <td className="whitespace-nowrap py-2.5 pr-2 text-ink-100">
                    <span className="mr-1" aria-hidden>{p.sign.emoji}</span>
                    {p.sign.name}
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 text-ink-300">{p.degreeInSign.toFixed(1)}°</td>
                  <td className="py-2.5 leading-relaxed text-ink-300">
                    {planetElementComment(p.id, p.sign.element)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-mystic-300 hover:text-gold-300">七大行星分別代表什麼？</summary>
          <ul className="mt-3 space-y-2 text-ink-300">
            {chart.planets.map((p) => (
              <li key={p.id}>
                <span className="mr-1 text-gold-400" aria-hidden>{p.symbol}</span>
                <strong className="text-ink-100">{p.name}：</strong>
                {PLANET_MEANINGS[p.id]}
              </li>
            ))}
          </ul>
        </details>
      </section>

      {/* 綜合分析 */}
      <section aria-label="綜合性格分析" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 綜合性格分析 ✦</h2>
        <div className="space-y-3">
          {overview.map((p, i) => (
            <p key={i} className="leading-relaxed text-ink-100">{p}</p>
          ))}
        </div>
      </section>
    </ResultShell>
  );
}
