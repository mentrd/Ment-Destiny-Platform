"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeParams } from "@/lib/encode";
import {
  castByCoins,
  castByNumbers,
  castByTime,
  LINE_POSITION_NAMES,
  type CastResult,
} from "@/lib/engines/iching";
import HexagramLines from "@/components/iching/HexagramLines";
import ResultShell from "@/components/ResultShell";

interface BaseParams {
  q?: string;
  method: "coins" | "numbers" | "time";
}
interface CoinsParams extends BaseParams {
  method: "coins";
  seed: number | string;
}
interface NumbersParams extends BaseParams {
  method: "numbers";
  n1: number;
  n2: number;
  n3: number;
}
interface TimeParams extends BaseParams {
  method: "time";
  y: number;
  m: number;
  d: number;
  h: number;
}
type IchingParams = CoinsParams | NumbersParams | TimeParams;

function castFromParams(p: IchingParams): CastResult {
  switch (p.method) {
    case "coins":
      return castByCoins(p.seed);
    case "numbers":
      return castByNumbers(p.n1, p.n2, p.n3);
    case "time":
      return castByTime(p.y, p.m, p.d, p.h);
  }
}

function InvalidNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>🌫️</p>
      <h1 className="mt-4 font-serif text-xl font-bold text-ink-100">卦象消散了</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">
        這個連結似乎不完整或已失效，讀不到當時的卦象。
        沒關係，誠心再問一次，重新為你起一卦。
      </p>
      <div className="mt-6">
        <Link href="/iching/start" className="btn-gold">☯ 重新起卦</Link>
      </div>
    </div>
  );
}

export default function IchingResult() {
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const data = useMemo(() => {
    const p = encoded ? decodeParams<IchingParams>(encoded) : null;
    if (!p || (p.method !== "coins" && p.method !== "numbers" && p.method !== "time")) {
      return null;
    }
    try {
      return { params: p, result: castFromParams(p) };
    } catch {
      return null;
    }
  }, [encoded]);

  if (!data) return <InvalidNotice />;

  const { params, result } = data;
  const { present, transformed, changingLines, lineValues } = result;
  const question = typeof params.q === "string" ? params.q.trim() : "";

  return (
    <ResultShell
      feature="iching"
      featureName="易經卜卦"
      title={present.fullName}
      summary={`${present.name}——${present.keywords.join("、")}`}
      retryHref="/iching/start"
    >
      {/* 問題引用 */}
      {question && (
        <blockquote className="mb-6 rounded-xl border-l-2 border-gold-500/60 bg-night-900/40 px-4 py-3">
          <p className="text-xs text-mystic-300">你問：</p>
          <p className="mt-1 font-serif leading-relaxed text-ink-100">「{question}」</p>
        </blockquote>
      )}

      {/* 本卦大卡 */}
      <section aria-label="本卦" className="card-mystic relative overflow-hidden p-6 text-center sm:p-8">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl"
        />
        <p className="relative text-xs tracking-widest text-mystic-300">本卦・第 {present.no} 卦</p>
        <p className="relative mt-3 font-serif text-7xl leading-none text-gradient-gold sm:text-8xl" aria-hidden>
          {present.symbol}
        </p>
        <h1 className="relative mt-4 font-serif text-3xl font-bold text-gold-400">{present.fullName}</h1>
        <p className="relative mt-1 font-serif text-lg text-ink-300">{present.name}卦</p>

        <div className="relative mx-auto mt-6 flex flex-wrap justify-center gap-2">
          {present.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs text-gold-300"
            >
              {k}
            </span>
          ))}
        </div>

        <div className="relative mx-auto mt-6 max-w-lg rounded-xl border border-mystic-400/25 bg-night-900/40 p-4">
          <p className="text-xs text-mystic-300">卦辭</p>
          <p className="mt-1.5 font-serif text-lg leading-relaxed text-ink-100">{present.judgment}</p>
        </div>
        <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-300">
          {present.modern}
        </p>
      </section>

      {/* 六爻卦象 */}
      <section aria-label="六爻卦象" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="divider-star mb-5 font-serif text-lg font-bold">✦ 六爻卦象 ✦</h2>
        <HexagramLines binary={present.binary} changingLines={changingLines} showLabels size="lg" />
        <p className="mt-5 text-center text-xs leading-relaxed text-ink-500">
          由下而上為初爻至上爻；
          {changingLines.length > 0 ? (
            <>金色高亮者為<span className="text-gold-300">動爻</span>，是本卦變化的關鍵。</>
          ) : (
            <>此卦六爻皆安定，並無動爻。</>
          )}
        </p>
      </section>

      {/* 動爻爻辭 */}
      <section aria-label="動爻爻辭" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 動爻爻辭 ✦</h2>
        {changingLines.length > 0 ? (
          <div className="space-y-4">
            {changingLines.map((i) => (
              <article key={i} className="rounded-xl border border-gold-500/25 bg-gold-500/5 p-4">
                <p className="text-sm font-bold text-gold-300">
                  <span aria-hidden className="mr-1.5">✦</span>
                  {LINE_POSITION_NAMES[i]}
                  <span className="ml-2 text-xs font-normal text-mystic-300">
                    （{lineValues[i] === 9 ? "老陽・動" : "老陰・動"}）
                  </span>
                </p>
                <p className="mt-2 font-serif leading-relaxed text-ink-100">{present.lines[i]}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm leading-relaxed text-ink-300">
            六爻安定，以本卦卦辭為主。此刻情勢尚未生變，宜守其常、順勢而為。
          </p>
        )}
      </section>

      {/* 變卦 */}
      {transformed && (
        <section aria-label="變卦" className="card-mystic mt-6 p-6 text-center sm:p-8">
          <p className="text-xs tracking-widest text-mystic-300">變卦・第 {transformed.no} 卦</p>
          <p className="mt-3 font-serif text-6xl leading-none text-gradient-gold sm:text-7xl" aria-hidden>
            {transformed.symbol}
          </p>
          <h2 className="mt-4 font-serif text-2xl font-bold text-gold-400">{transformed.fullName}</h2>
          <div className="mx-auto mt-5 max-w-lg rounded-xl border border-mystic-400/25 bg-night-900/40 p-4">
            <p className="text-xs text-mystic-300">卦辭</p>
            <p className="mt-1.5 font-serif leading-relaxed text-ink-100">{transformed.judgment}</p>
          </div>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-300">
            動爻翻轉後成此卦——情勢將朝此方向發展。可與本卦對照，觀察事情由「現在」往「將來」的推移。
          </p>
        </section>
      )}

      {/* 行動建議 */}
      <section aria-label="行動建議" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="font-serif text-lg font-bold text-gold-400">
          <span aria-hidden className="mr-2">🧭</span>行動建議
        </h2>
        <p className="mt-2 leading-relaxed text-ink-100">{present.advice}</p>
      </section>
    </ResultShell>
  );
}
