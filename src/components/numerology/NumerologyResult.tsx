"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeParams } from "@/lib/encode";
import { computeNumerology } from "@/lib/engines/numerology";
import { getNumberReading, PERSONAL_YEAR_READINGS } from "@/lib/engines/numerology-copy";
import ResultShell from "@/components/ResultShell";

interface NumParams {
  y: number;
  m: number;
  d: number;
}

function isValid(p: NumParams | null): p is NumParams {
  if (!p) return false;
  const { y, m, d } = p;
  if (!Number.isInteger(y) || y < 1920 || y > 2026) return false;
  if (!Number.isInteger(m) || m < 1 || m > 12) return false;
  const maxDay = new Date(y, m, 0).getDate();
  return Number.isInteger(d) && d >= 1 && d <= maxDay;
}

function InvalidNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>🌫️</p>
      <h1 className="mt-4 font-serif text-xl font-bold text-ink-100">找不到這組靈數</h1>
      <p className="mt-2 text-sm text-ink-300">
        連結似乎不完整或已失效，請重新輸入出生年月日，一分鐘就能算出你的生命靈數。
      </p>
      <div className="mt-6">
        <Link href="/numerology/start" className="btn-gold">🔢 重新計算</Link>
      </div>
    </div>
  );
}

const NOW_YEAR = new Date().getFullYear();

const SECTIONS = [
  { key: "personality", emoji: "🌟", label: "性格特質" },
  { key: "talent", emoji: "🎨", label: "天賦所在" },
  { key: "lesson", emoji: "🧭", label: "人生課題" },
  { key: "love", emoji: "💞", label: "感情模式" },
] as const;

export default function NumerologyResult() {
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const data = useMemo(() => {
    const p = encoded ? decodeParams<NumParams>(encoded) : null;
    if (!isValid(p)) return null;
    return { params: p, result: computeNumerology(p.y, p.m, p.d, NOW_YEAR) };
  }, [encoded]);

  if (!data) return <InvalidNotice />;
  const { params, result } = data;

  const reading = getNumberReading(result.lifePath, result.master);
  const display = result.master ? `${result.master}/${result.lifePath}` : `${result.lifePath}`;
  const title = `生命靈數 ${display}・${reading.title}`;
  const birthLabel = `${params.y} 年 ${params.m} 月 ${params.d} 日`;

  return (
    <ResultShell
      feature="numerology"
      featureName="生命靈數"
      title={title}
      summary={reading.personality}
      retryHref="/numerology/start"
    >
      {/* 標題 */}
      <header className="mb-6 text-center">
        <p className="text-sm text-ink-500">{birthLabel}</p>
      </header>

      {/* 超大生命靈數卡 */}
      <section aria-label="生命靈數" className="card-mystic relative overflow-hidden p-8 text-center sm:p-10">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl"
        />
        <p className="relative text-xs tracking-widest text-mystic-300">你的生命靈數</p>
        <p className="relative mt-2 font-serif text-8xl font-bold leading-none sm:text-9xl">
          <span className="text-gradient-gold">{display}</span>
        </p>
        <h1 className="relative mt-4 font-serif text-2xl font-bold text-gold-400 sm:text-3xl">
          {reading.title}
        </h1>
        {result.master && (
          <div className="relative mx-auto mt-4 max-w-md">
            <span className="inline-block rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-300">
              ✦ 大師數 {result.master}
            </span>
            <p className="mt-2 text-xs leading-relaxed text-ink-300">
              你的加總過程出現了大師數 {result.master}，最終約化為靈數 {result.lifePath}。
              大師數被認為帶有更強的能量與課題，「{result.master}/{result.lifePath}」兩層意義可以一起參考。
            </p>
          </div>
        )}
        <div className="relative mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2 text-center">
          {[
            ["生日數", result.birthday],
            ["天賦數", result.talent],
            ["流年數", result.personalYear],
          ].map(([label, n]) => (
            <div key={label} className="rounded-xl border border-gold-500/20 bg-night-900/40 px-2 py-2.5">
              <p className="text-xs text-mystic-300">{label}</p>
              <p className="mt-0.5 font-serif text-xl font-bold text-gold-400">{n}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 九宮格先天數字盤 */}
      <section aria-label="九宮格先天數字盤" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 先天數字盤 ✦</h2>
        <div className="mx-auto grid max-w-xs grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => {
            const present = result.digitsPresent.includes(n);
            return (
              <div
                key={n}
                className={
                  present
                    ? "flex aspect-square items-center justify-center rounded-2xl border border-gold-400/60 bg-gold-500/15 shadow-[0_0_18px_rgba(230,200,96,0.35)]"
                    : "flex aspect-square items-center justify-center rounded-2xl border border-ink-500/20 bg-night-900/40"
                }
              >
                <span
                  className={
                    present
                      ? "font-serif text-3xl font-bold text-gradient-gold"
                      : "font-serif text-3xl font-bold text-ink-500/40"
                  }
                >
                  {n}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-center text-xs leading-relaxed text-ink-500">
          亮起的是你出生日期中出現過的「先天數」，代表與生俱來的能量；
          暗著的數字沒有好壞之分，是這輩子可以後天補強的面向。
        </p>
      </section>

      {/* 四段分析 */}
      <section aria-label="靈數解析" className="mt-6 space-y-4">
        {SECTIONS.map((s) => (
          <article key={s.key} className="card-mystic p-5">
            <h2 className="font-serif text-lg font-bold text-gold-400">
              <span className="mr-2" aria-hidden>{s.emoji}</span>
              {s.label}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-100">{reading[s.key]}</p>
          </article>
        ))}
      </section>

      {/* 流年卡 */}
      <section aria-label="今年流年" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ {NOW_YEAR} 年流年運勢 ✦</h2>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10">
            <span className="font-serif text-4xl font-bold text-gradient-gold">{result.personalYear}</span>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-mystic-300">你的流年數是 {result.personalYear}</p>
            <p className="mt-2 leading-relaxed text-ink-100">
              {PERSONAL_YEAR_READINGS[result.personalYear]}
            </p>
          </div>
        </div>
      </section>
    </ResultShell>
  );
}
