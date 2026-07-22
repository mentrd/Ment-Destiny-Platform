"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeParams } from "@/lib/encode";
import { computeName, suggestName, type Grid } from "@/lib/engines/name";
import { getRenReading, GRID_LABELS, TRAIT_LABELS } from "@/lib/engines/name-copy";
import type { Num81Level } from "@/lib/engines/name-data";
import ResultShell from "@/components/ResultShell";

type Gender = "male" | "female";

interface AnalyzeParams {
  mode: "analyze";
  name: string;
  gender: Gender;
}
interface BabyParams {
  mode: "baby";
  surname: string;
  gender: Gender;
  trait: string;
}
type NameParams = AnalyzeParams | BabyParams;

const NAME_RE = /^[一-鿿]{2,4}$/;
const SURNAME_RE = /^[一-鿿]{1,2}$/;

function isValid(p: NameParams | null): p is NameParams {
  if (!p) return false;
  if (p.mode === "analyze") return typeof p.name === "string" && NAME_RE.test(p.name);
  if (p.mode === "baby") return typeof p.surname === "string" && SURNAME_RE.test(p.surname);
  return false;
}

/* 吉凶配色 */
function levelClasses(level: Num81Level): { ring: string; text: string; badge: string } {
  if (level === "吉")
    return {
      ring: "border-gold-400/60 bg-gold-500/10 shadow-[0_0_18px_rgba(230,200,96,0.28)]",
      text: "text-gold-400",
      badge: "border-gold-500/40 bg-gold-500/10 text-gold-300",
    };
  if (level === "半吉")
    return {
      ring: "border-mystic-400/50 bg-mystic-500/10",
      text: "text-mystic-300",
      badge: "border-mystic-400/40 bg-mystic-500/10 text-mystic-300",
    };
  return {
    ring: "border-rose-400/50 bg-rose-400/10",
    text: "text-rose-400",
    badge: "border-rose-400/40 bg-rose-400/10 text-rose-400",
  };
}

function InvalidNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>🌫️</p>
      <h1 className="mt-4 font-serif text-xl font-bold text-ink-100">找不到這份姓名分析</h1>
      <p className="mt-2 text-sm text-ink-300">
        連結似乎不完整或已失效，請重新輸入姓名，一分鐘就能看見你的五格三才格局。
      </p>
      <div className="mt-6">
        <Link href="/name/start" className="btn-gold">📜 重新分析</Link>
      </div>
    </div>
  );
}

const GRID_ORDER: (keyof ReturnType<typeof computeName>["grids"])[] = [
  "天格",
  "人格",
  "地格",
  "外格",
  "總格",
];

const SECTIONS = [
  { key: "個性", emoji: "🌟" },
  { key: "事業", emoji: "💼" },
  { key: "感情", emoji: "💞" },
  { key: "財運", emoji: "💰" },
] as const;

export default function NameResult() {
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const params = useMemo(() => {
    const p = encoded ? decodeParams<NameParams>(encoded) : null;
    return isValid(p) ? p : null;
  }, [encoded]);

  if (!params) return <InvalidNotice />;
  if (params.mode === "baby") return <BabyResult params={params} />;
  return <AnalyzeResult params={params} />;
}

/* ── 姓名分析 ───────────────────────── */

function AnalyzeResult({ params }: { params: AnalyzeParams }) {
  const result = useMemo(() => computeName(params.name), [params.name]);
  const renWuxing = result.grids.人格.wuxing;
  const reading = getRenReading(renWuxing);
  const title = `${params.name}・人格${renWuxing}（${reading.title}）`;
  const summary = `三才配置 ${result.sancai.combo}（${result.sancai.level}）・${reading.個性.slice(0, 40)}…`;

  return (
    <ResultShell
      feature="name"
      featureName="姓名學分析"
      title={title}
      summary={summary}
      retryHref="/name/start"
    >
      <header className="mb-6 text-center">
        <p className="text-sm text-ink-500">姓 {result.surname}・名 {result.given}</p>
        <h1 className="mt-1 font-serif text-3xl font-bold">
          <span className="text-gradient-gold">{params.name}</span>
        </h1>
      </header>

      {result.missingChars.length > 0 && (
        <p className="mb-6 rounded-xl border border-mystic-400/30 bg-mystic-500/10 px-4 py-3 text-sm leading-relaxed text-mystic-300">
          ⚠️ 以下字未收錄於字庫，已以估算筆畫（12 畫）計算，僅供參考：
          <span className="font-bold text-ink-100">{result.missingChars.join("、")}</span>
        </p>
      )}

      {/* 五格五圓卡 */}
      <section aria-label="姓名五格" className="card-mystic p-5 sm:p-6">
        <h2 className="divider-star mb-5 font-serif text-lg font-bold">✦ 姓名五格 ✦</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {GRID_ORDER.map((key) => {
            const g: Grid = result.grids[key];
            const cls = levelClasses(g.level);
            return (
              <div key={key} className="flex flex-col items-center gap-1.5 text-center">
                <div className={`flex aspect-square w-full max-w-[92px] flex-col items-center justify-center rounded-full border ${cls.ring}`}>
                  <span className={`font-serif text-2xl font-bold ${cls.text}`}>{g.value}</span>
                  <span className="text-[11px] text-ink-300">{g.wuxing}</span>
                </div>
                <span className="text-xs font-bold text-ink-100">{key}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] ${cls.badge}`}>{g.level}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 三才配置 */}
      <section aria-label="三才配置" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="divider-star mb-5 font-serif text-lg font-bold">✦ 三才配置 ✦</h2>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {[
            ["天", result.grids.天格.wuxing],
            ["人", result.grids.人格.wuxing],
            ["地", result.grids.地格.wuxing],
          ].map(([label, wx], i) => (
            <div key={label} className="flex items-center gap-2 sm:gap-4">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl border border-gold-500/30 bg-night-900/40">
                <span className="text-[11px] text-ink-500">{label}</span>
                <span className="font-serif text-2xl font-bold text-gradient-gold">{wx}</span>
              </div>
              {i < 2 && <span className="text-xl text-gold-400" aria-hidden>→</span>}
            </div>
          ))}
        </div>
        <p className="mt-4 text-center">
          <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${levelClasses(result.sancai.level).badge}`}>
            {result.sancai.combo}・{result.sancai.level}
          </span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-100">{result.sancai.comment}</p>
      </section>

      {/* 逐格 81 數理批註 */}
      <section aria-label="81 數理批註" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="divider-star mb-5 font-serif text-lg font-bold">✦ 81 數理批註 ✦</h2>
        <ul className="space-y-3">
          {GRID_ORDER.map((key) => {
            const g = result.grids[key];
            const cls = levelClasses(g.level);
            return (
              <li key={key} className="rounded-xl border border-mystic-400/15 bg-night-900/30 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-base font-bold text-ink-100">{key}</span>
                  <span className={`font-serif text-lg font-bold ${cls.text}`}>{g.value}</span>
                  <span className="text-xs text-ink-500">{g.wuxing}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${cls.badge}`}>{g.level}</span>
                </div>
                <p className="mt-1 text-xs text-ink-500">{GRID_LABELS[key]?.hint}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{g.note}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 四段分析（依人格五行） */}
      <section aria-label="人格五行解析" className="mt-6 space-y-4">
        <div className="text-center">
          <span className="inline-block rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-sm font-bold text-gold-300">
            人格五行屬{renWuxing}・{reading.title}
          </span>
        </div>
        {SECTIONS.map((s) => (
          <article key={s.key} className="card-mystic p-5">
            <h3 className="font-serif text-lg font-bold text-gold-400">
              <span className="mr-2" aria-hidden>{s.emoji}</span>
              {s.key}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-100">{reading[s.key]}</p>
          </article>
        ))}
      </section>
    </ResultShell>
  );
}

/* ── 新生兒命名 ───────────────────────── */

function BabyResult({ params }: { params: BabyParams }) {
  const combos = useMemo(
    () => suggestName(params.surname, params.gender),
    [params.surname, params.gender]
  );
  const genderLabel = params.gender === "male" ? "男寶寶" : "女寶寶";
  const title = `${params.surname} 姓${genderLabel}・吉利命名建議`;
  const summary = `為 ${params.surname} 姓${genderLabel}反查出 ${combos.length} 組人格、地格、總格皆吉的筆畫組合與候選字。`;

  return (
    <ResultShell
      feature="name"
      featureName="姓名學分析"
      title={title}
      summary={summary}
      retryHref="/name/start"
    >
      <header className="mb-6 text-center">
        <p className="text-5xl" aria-hidden>🍼</p>
        <h1 className="mt-2 font-serif text-2xl font-bold">
          <span className="text-gradient-gold">{params.surname} 姓{genderLabel}命名建議</span>
        </h1>
        <p className="mt-2 text-sm text-ink-300">{TRAIT_LABELS[params.trait] ?? params.trait}</p>
      </header>

      <p className="mb-6 rounded-xl border border-mystic-400/20 bg-night-900/30 px-4 py-3 text-sm leading-relaxed text-ink-300">
        以下每組筆畫組合都讓「人格、地格、總格」三格數理皆為吉。
        請從候選字中，第一個字選對應「名首字」筆畫、第二個字選「名次字」筆畫，
        自由搭配出你喜歡的名字。這是命名的靈感參考，最終仍請以你的心意為主。
      </p>

      {combos.length === 0 ? (
        <div className="card-mystic p-6 text-center text-sm text-ink-300">
          這個姓氏暫時找不到理想的吉數組合，請試試其他姓氏或稍後再試。
        </div>
      ) : (
        <div className="space-y-5">
          {combos.map((c, i) => (
            <section key={i} className="card-mystic p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif text-lg font-bold text-gold-400">組合 {i + 1}</h2>
                <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-bold text-gold-300">
                  名筆畫 {c.strokes[0]} + {c.strokes[1]}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                {[
                  ["人格", c.ren],
                  ["地格", c.di],
                  ["總格", c.zong],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-xl border border-gold-500/20 bg-night-900/40 px-2 py-2">
                    <p className="text-ink-500">{label}</p>
                    <p className="mt-0.5 font-serif text-lg font-bold text-gold-400">{val}</p>
                    <p className="text-[10px] text-gold-300">吉</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="mb-1.5 text-xs font-bold text-mystic-300">名首字候選（{c.strokes[0]} 畫）</p>
                  <div className="flex flex-wrap gap-2">
                    {c.firstChars.map((ch) => (
                      <span key={ch} className="rounded-lg border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 font-serif text-lg font-bold text-ink-100">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-bold text-mystic-300">名次字候選（{c.strokes[1]} 畫）</p>
                  <div className="flex flex-wrap gap-2">
                    {c.secondChars.map((ch) => (
                      <span key={ch} className="rounded-lg border border-mystic-400/30 bg-mystic-500/10 px-3 py-1.5 font-serif text-lg font-bold text-ink-100">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </ResultShell>
  );
}
