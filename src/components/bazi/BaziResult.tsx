"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeParams } from "@/lib/encode";
import { computeBazi, type BaziResult as BaziResultData } from "@/lib/engines/bazi";
import { BAZI_ASPECTS, BAZI_DAY_MASTER_COPY, type BaziAspect } from "@/lib/engines/bazi-copy";
import { SHICHEN_NAMES, hourToZhi, type WuXing } from "@/lib/engines/lunar";
import ResultShell from "@/components/ResultShell";
import { PLACES } from "@/components/bazi/birth-places";

interface BaziParams {
  y: number;
  m: number;
  d: number;
  h: number | null;
  g: "M" | "F";
  p: number;
}

const WUXING_COLORS: { el: WuXing; color: string }[] = [
  { el: "木", color: "#4ade80" },
  { el: "火", color: "#f87171" },
  { el: "土", color: "#facc15" },
  { el: "金", color: "#e5e7eb" },
  { el: "水", color: "#60a5fa" },
];

const ASPECT_ICONS: Record<BaziAspect, string> = {
  個性: "🌱", 事業: "💼", 財運: "💰", 感情: "💞", 健康: "🌿",
};

function isValid(p: BaziParams | null): p is BaziParams {
  if (!p) return false;
  const { y, m, d, h, g } = p;
  return (
    Number.isInteger(y) && y >= 1920 && y <= 2026 &&
    Number.isInteger(m) && m >= 1 && m <= 12 &&
    Number.isInteger(d) && d >= 1 && d <= 31 &&
    (h === null || (Number.isInteger(h) && h >= 0 && h <= 23)) &&
    (g === "M" || g === "F")
  );
}

function InvalidNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>🌫️</p>
      <h1 className="mt-4 font-serif text-xl font-bold text-ink-100">找不到這張命盤</h1>
      <p className="mt-2 text-sm text-ink-300">
        連結似乎不完整或已失效，請重新輸入出生資料，一分鐘就能排好你的八字命盤。
      </p>
      <div className="mt-6">
        <Link href="/bazi/start" className="btn-gold">☯ 重新排盤</Link>
      </div>
    </div>
  );
}

export default function BaziResult() {
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const data = useMemo<{ params: BaziParams; result: BaziResultData } | null>(() => {
    const p = encoded ? decodeParams<BaziParams>(encoded) : null;
    if (!isValid(p)) return null;
    try {
      return { params: p, result: computeBazi({ y: p.y, m: p.m, d: p.d, hour: p.h, gender: p.g }) };
    } catch {
      return null;
    }
  }, [encoded]);

  if (!data) return <InvalidNotice />;
  const { params, result } = data;

  const copy = BAZI_DAY_MASTER_COPY[result.dayMaster][result.strong ? "strong" : "weak"];
  const title = `${result.dayMaster}${result.dayMasterWuxing}日主・${result.strong ? "身強" : "身弱"}格局`;
  const placeName = PLACES[params.p] ?? "";
  const birthLabel = `${params.y} 年 ${params.m} 月 ${params.d} 日 ${
    params.h === null ? "時辰未知" : SHICHEN_NAMES[hourToZhi(params.h)]
  }・${params.g === "M" ? "男" : "女"}${placeName ? `・${placeName}` : ""}`;

  return (
    <ResultShell
      feature="bazi"
      featureName="八字命盤"
      title={title}
      summary={result.strengthText}
      retryHref="/bazi/start"
    >
      {/* 標題 */}
      <header className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold sm:text-3xl">
          <span className="text-gradient-gold">{title}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-500">{birthLabel}</p>
        <p className="mt-1 text-sm text-ink-300">
          {result.lunarText && <span>{result.lunarText}・</span>}
          生肖屬{result.shengXiao}
        </p>
      </header>

      {/* 四柱表 */}
      <section aria-label="四柱命盤" className="card-mystic p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 四柱命盤 ✦</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {result.pillars.map((pillar) => (
            <div key={pillar.label} className="rounded-xl border border-mystic-400/20 bg-night-700/50 p-3 text-center">
              <p className="text-xs text-mystic-300">{pillar.label}</p>
              <p className="mt-2 font-serif text-3xl font-bold leading-tight text-gold-400 sm:text-4xl">
                {pillar.gan}
                <br />
                {pillar.zhi}
              </p>
              <span className="mt-2 inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-2 py-0.5 text-xs text-gold-300">
                {pillar.ganShiShen}
              </span>
              <div className="mt-2 space-y-0.5 border-t border-ink-500/15 pt-2 text-xs text-ink-300">
                <p className="text-[10px] text-ink-500">藏干</p>
                {pillar.cangGan.map((cg) => (
                  <p key={cg.gan}>
                    <span className="text-ink-100">{cg.gan}</span>
                    <span className="ml-1 text-ink-500">{cg.shiShen}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
          {result.hourUnknown && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink-500/30 p-3 text-center">
              <p className="text-xs text-mystic-300">時柱</p>
              <p className="mt-2 text-2xl text-ink-500" aria-hidden>？</p>
              <p className="mt-2 text-xs leading-relaxed text-ink-500">
                時辰未知，以三柱排盤
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 五行比例 */}
      <section aria-label="五行比例" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 五行能量分布 ✦</h2>
        <div className="space-y-3">
          {WUXING_COLORS.map(({ el, color }) => (
            <div key={el} className="flex items-center gap-3">
              <span className="w-6 shrink-0 font-serif text-lg font-bold" style={{ color }}>{el}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-night-700">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.max(result.wuxingPercent[el], 2)}%`, background: color }}
                />
              </div>
              <span className="w-10 shrink-0 text-right text-sm text-ink-300">{result.wuxingPercent[el]}%</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-500">
          以天干與地支藏干加權統計（月支加重計算），呈現命盤中五行能量的相對比例。
        </p>
      </section>

      {/* 日主強弱 + 喜用神 */}
      <section aria-label="日主強弱與喜用神" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 日主強弱與喜用神 ✦</h2>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-sm font-bold text-gold-300">
            日主 {result.dayMaster}（{result.dayMasterYang ? "陽" : "陰"}{result.dayMasterWuxing}）
          </span>
          <span className="rounded-full border border-mystic-400/40 bg-mystic-500/10 px-3 py-1 text-sm font-bold text-mystic-300">
            {result.strong ? "身強" : "身弱"}
          </span>
          {result.favorable.map((w) => (
            <span
              key={w}
              className="rounded-full border border-ink-500/30 bg-night-700/60 px-3 py-1 text-sm"
              style={{ color: WUXING_COLORS.find((c) => c.el === w)?.color }}
            >
              喜{w}
            </span>
          ))}
        </div>
        <p className="mt-3 leading-relaxed text-ink-100">{result.strengthText}</p>
        <p className="mt-2 leading-relaxed text-ink-100">{result.favorableText}</p>
      </section>

      {/* 大運 */}
      <section aria-label="大運" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 大運走勢 ✦</h2>
        <p className="mb-3 text-sm text-ink-300">
          約 {result.qiYunAge} 歲（虛歲）起運，大運{result.daYunForward ? "順行" : "逆行"}，每十年一柱：
        </p>
        <div className="overflow-x-auto pb-2">
          <ol className="flex min-w-max gap-2">
            {result.daYun.map((dy) => (
              <li key={dy.order} className="w-20 shrink-0 rounded-xl border border-mystic-400/20 bg-night-700/50 p-2.5 text-center">
                <p className="text-xs text-ink-500">{dy.startAge} 歲起</p>
                <p className="mt-1 font-serif text-xl font-bold text-gold-400">{dy.name}</p>
                <p className="mt-1 text-xs text-mystic-300">{dy.ganShiShen}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-2 text-xs text-ink-500">大運僅呈現十年主氣氛圍，實際仍以整體命盤與當下努力為主。</p>
      </section>

      {/* 五面向分析 */}
      <section aria-label="日主分析" className="mt-6 space-y-4">
        <h2 className="divider-star font-serif text-lg font-bold">
          ✦ {result.dayMaster}{result.dayMasterWuxing}日主・{result.strong ? "身強" : "身弱"}解讀 ✦
        </h2>
        {BAZI_ASPECTS.map((aspect) => (
          <article key={aspect} className="card-mystic p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400">
              <span className="mr-2" aria-hidden>{ASPECT_ICONS[aspect]}</span>
              {aspect}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-100">{copy[aspect]}</p>
            {aspect === "健康" && (
              <p className="mt-2 text-xs text-ink-500">健康段落僅為作息與紓壓的生活提醒，不涉及疾病判斷，身體不適請諮詢專業醫師。</p>
            )}
          </article>
        ))}
      </section>
    </ResultShell>
  );
}
