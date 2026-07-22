"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeParams } from "@/lib/encode";
import { analyzeDream, generateOverall } from "@/lib/engines/dream";
import type { DreamCategory } from "@/lib/engines/dream-data";
import ResultShell from "@/components/ResultShell";

interface DreamParams {
  text: string;
  seed: number;
}

const CATEGORY_STYLE: Record<DreamCategory, string> = {
  動物: "border-gold-500/40 bg-gold-500/10 text-gold-300",
  自然: "border-mystic-400/40 bg-mystic-500/10 text-mystic-300",
  人物: "border-rose-400/40 bg-rose-400/10 text-rose-400",
  場景: "border-gold-400/40 bg-gold-400/10 text-gold-400",
  行為: "border-mystic-300/40 bg-mystic-400/10 text-mystic-300",
  物品: "border-gold-300/40 bg-gold-300/10 text-gold-300",
  身體: "border-rose-400/40 bg-rose-400/10 text-rose-400",
  情緒: "border-mystic-400/40 bg-mystic-500/10 text-mystic-300",
};

function isValid(p: DreamParams | null): p is DreamParams {
  return Boolean(
    p &&
      typeof p.text === "string" &&
      p.text.trim().length >= 1 &&
      p.text.length <= 600 &&
      Number.isFinite(p.seed)
  );
}

function InvalidNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>🌫️</p>
      <h1 className="mt-4 font-serif text-xl font-bold text-ink-100">找不到這個夢</h1>
      <p className="mt-2 text-sm text-ink-300">
        連結似乎不完整或已失效，重新描述一次你的夢境，一分鐘就能取得解讀。
      </p>
      <div className="mt-6">
        <Link href="/dream/start" className="btn-gold">🌙 重新解夢</Link>
      </div>
    </div>
  );
}

export default function DreamResult() {
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const data = useMemo(() => {
    const p = encoded ? decodeParams<DreamParams>(encoded) : null;
    if (!isValid(p)) return null;
    const analysis = analyzeDream(p.text);
    return {
      params: p,
      ...analysis,
      overall: generateOverall(analysis.hits, p.seed),
    };
  }, [encoded]);

  if (!data) return <InvalidNotice />;
  const { params, hits, matchedWords, overall } = data;

  const title =
    hits.length > 0
      ? `夢見${hits.slice(0, 3).map((h) => h.title).join("、")}的解讀`
      : "你的夢境解讀";

  return (
    <ResultShell
      feature="dream"
      featureName="解夢"
      title={title}
      summary={overall.slice(0, 80)}
      retryHref="/dream/start"
    >
      {/* 標題 */}
      <header className="mb-6 text-center">
        <p className="animate-float-slow text-4xl" aria-hidden>🌙</p>
        <h1 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
          <span className="text-gradient-gold">{title}</span>
        </h1>
      </header>

      {/* 夢境引用 */}
      <section aria-label="你的夢境" className="card-mystic p-5">
        <p className="text-xs text-mystic-300">你描述的夢境</p>
        <blockquote className="mt-2 border-l-2 border-gold-500/40 pl-3 text-sm leading-relaxed text-ink-300">
          {params.text}
        </blockquote>
        {matchedWords.length > 0 && (
          <p className="mt-3 text-xs text-ink-500">
            捕捉到的夢境元素：
            {matchedWords.map((w) => (
              <span key={w} className="mx-0.5 rounded-full border border-gold-500/30 bg-gold-500/10 px-2 py-0.5 text-gold-300">
                {w}
              </span>
            ))}
          </p>
        )}
      </section>

      {/* 命中元素卡 或 無命中引導 */}
      {hits.length > 0 ? (
        <section aria-label="夢境元素解析" className="mt-6">
          <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 夢境元素解析 ✦</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {hits.map((h) => (
              <article key={h.title} className="card-mystic p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-ink-100">{h.title}</h3>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${CATEGORY_STYLE[h.category]}`}>
                    {h.category}
                  </span>
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{h.symbol}</p>
                <p className="mt-3 border-t border-ink-500/10 pt-3 text-sm italic leading-relaxed text-mystic-300">
                  💭 {h.reflection}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section aria-label="獨特的夢" className="card-mystic mt-6 p-6 text-center">
          <p className="text-4xl" aria-hidden>✨</p>
          <h2 className="mt-3 font-serif text-xl font-bold text-gold-400">你的夢很獨特</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-300">
            這個夢沒有落在常見的夢境符號裡——這不代表它沒有意義，反而代表潛意識正用只屬於你的語言說話。
            試著回想夢裡最強烈的一幕與醒來時的情緒，那往往就是解夢的鑰匙。
          </p>
        </section>
      )}

      {/* 綜合解讀 */}
      <section aria-label="綜合解讀" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 綜合心理解讀 ✦</h2>
        <p className="leading-relaxed text-ink-100">{overall}</p>
        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          解讀以榮格心理學的象徵觀點為主、民俗說法為輔，僅供娛樂與自我覺察參考，沒有吉凶預言，更不涉及健康診斷。
        </p>
      </section>
    </ResultShell>
  );
}
