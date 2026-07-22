"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResultShell from "@/components/ResultShell";
import { decodeParams, encodeParams } from "@/lib/encode";
import { newSeed, seededRng } from "@/lib/random";
import { track } from "@/lib/stats";
import { LOT_SETS, type LotSetKey } from "@/lib/engines/lots-data";

type Phase = "intro" | "shaking" | "risen" | "result";
type JiaoState = "idle" | "tossing" | "sheng" | "xiao";

interface Draw {
  lotIndex: number;
  sheng: boolean;
}

/** 由 seed 推導整段求籤劇本（抽籤與擲筊結果皆可由分享連結重現）：
 *  每次擲筊 75% 聖筊，最多 2 次笑筊、第 3 次必為聖筊。 */
function resolveReading(setKey: LotSetKey, seed: number): Draw[] {
  const count = LOT_SETS[setKey].lots.length;
  const draws: Draw[] = [];
  for (let i = 0; i < 3; i++) {
    const lotIndex = Math.floor(seededRng(`${setKey}|${seed}|draw${i}`)() * count);
    const sheng = i >= 2 || seededRng(`${setKey}|${seed}|jiao${i}`)() < 0.75;
    draws.push({ lotIndex, sheng });
    if (sheng) break;
  }
  return draws;
}

function levelKind(level: string): "up" | "mid" | "down" {
  if (level.includes("下")) return "down";
  if (level.startsWith("中")) return "mid";
  return "up";
}

const LEVEL_BADGE: Record<ReturnType<typeof levelKind>, string> = {
  up: "border-gold-500/60 bg-gold-500/10 text-gold-300",
  mid: "border-mystic-400/50 bg-mystic-500/15 text-mystic-300",
  down: "border-ink-500/40 bg-night-600/70 text-ink-500",
};

const THEME_META: { key: "love" | "career" | "health"; label: string; icon: string; tone: string }[] = [
  { key: "love", label: "感情姻緣", icon: "💞", tone: "text-rose-400" },
  { key: "career", label: "事業財運", icon: "📜", tone: "text-gold-300" },
  { key: "health", label: "生活提醒", icon: "🌿", tone: "text-mystic-300" },
];

/** 筊杯圖形：up = 凸面朝上（弧面），flat = 平面朝上 */
function JiaoCup({ face, tossing }: { face: "up" | "flat"; tossing: boolean }) {
  return (
    <span
      aria-hidden
      className={`block h-9 w-20 border border-rose-400/70 shadow-[0_4px_14px_rgba(229,139,176,0.2)] ${
        face === "up"
          ? "rounded-t-full rounded-b-md bg-gradient-to-b from-rose-400/70 to-rose-400/25"
          : "rounded-b-full rounded-t-md bg-rose-400/15"
      } ${tossing ? "animate-coin-toss" : ""}`}
    />
  );
}

function LotsFlow({ setKey }: { setKey: LotSetKey }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const set = LOT_SETS[setKey];

  // 載入時帶 ?d= 直接還原到結果
  const restored = useMemo(() => {
    const d = searchParams.get("d");
    if (!d) return null;
    const data = decodeParams<{ seed: number; q?: string }>(d);
    return data && typeof data.seed === "number" ? data : null;
  }, [searchParams]);

  const [phase, setPhase] = useState<Phase>(restored ? "result" : "intro");
  const [seed, setSeed] = useState<number | null>(restored ? restored.seed : null);
  const [question, setQuestion] = useState(restored?.q ?? "");
  const [drawIdx, setDrawIdx] = useState(0);
  const [jiao, setJiao] = useState<JiaoState>("idle");

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  function later(fn: () => void, ms: number) {
    timers.current.push(setTimeout(fn, ms));
  }
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const draws = useMemo(
    () => (seed === null ? [] : resolveReading(setKey, seed)),
    [setKey, seed],
  );

  // 進入結果時把 seed 寫回網址，分享連結可重現
  useEffect(() => {
    if (phase === "result" && seed !== null && !searchParams.get("d")) {
      const q = question.trim();
      router.replace(`?d=${encodeParams(q ? { seed, q } : { seed })}`, { scroll: false });
    }
  }, [phase, seed, question, router, searchParams]);

  function startShake() {
    const s = newSeed();
    setSeed(s);
    setDrawIdx(0);
    setJiao("idle");
    track({ type: "reading_start", feature: "lots" });
    setPhase("shaking");
    later(() => setPhase("risen"), 1800);
  }

  function tossJiao() {
    if (jiao !== "idle" || seed === null) return;
    const d = draws[Math.min(drawIdx, draws.length - 1)];
    setJiao("tossing");
    later(() => {
      if (d.sheng) {
        setJiao("sheng");
        later(() => setPhase("result"), 1000);
      } else {
        setJiao("xiao");
        later(() => {
          setJiao("idle");
          setDrawIdx((i) => i + 1);
          setPhase("shaking");
          later(() => setPhase("risen"), 1800);
        }, 1400);
      }
    }, 850);
  }

  // ── 結果 ──
  if (phase === "result" && seed !== null && draws.length > 0) {
    const lot = set.lots[draws[draws.length - 1].lotIndex % set.lots.length];
    const kind = levelKind(lot.level);
    const poemLines = lot.poem.split("\n");
    const q = question.trim();

    return (
      <ResultShell
        feature="lots"
        featureName="線上抽籤"
        title={`${set.name}第${lot.no}籤`}
        summary={`${set.name}第${lot.no}籤（${lot.level}）：${poemLines[0]}。`}
        retryHref={`/lots/${setKey}`}
      >
        {/* 籤號與吉凶 */}
        <section className="text-center">
          {q && <p className="mb-3 text-sm text-ink-500">你的默想：「{q}」</p>}
          <p className="font-serif text-5xl font-bold text-gradient-gold sm:text-6xl">
            第{lot.no}籤
          </p>
          <span
            className={`mt-3 inline-block rounded-full border px-4 py-1 font-serif text-lg font-bold ${LEVEL_BADGE[kind]}`}
          >
            {lot.level}
          </span>
          {kind === "down" && (
            <p className="mt-2 text-xs text-ink-500">下籤是善意的提醒，不是判決。</p>
          )}
        </section>

        {/* 籤詩 */}
        <section className="card-mystic mt-6 p-6 sm:p-8">
          <p className="divider-star mb-5 text-xs font-semibold">
            {set.icon} {set.name}・籤詩
          </p>
          <div className="space-y-3 text-center">
            {poemLines.map((line: string) => (
              <p
                key={line}
                className="font-serif text-xl leading-relaxed tracking-[0.2em] text-ink-100 sm:text-2xl"
              >
                {line}
              </p>
            ))}
          </div>
        </section>

        {/* 白話解 */}
        <section className="card-mystic mt-4 p-5 sm:p-6">
          <h2 className="font-serif text-lg font-bold text-gold-400">白話解籤</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-300 sm:text-base">{lot.modern}</p>
        </section>

        {/* 主題解讀 */}
        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          {THEME_META.filter((t) => lot.themes[t.key]).map((t) => (
            <div key={t.key} className="card-mystic p-5">
              <h3 className={`font-serif font-bold ${t.tone}`}>
                <span aria-hidden className="mr-1.5">{t.icon}</span>
                {t.label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{lot.themes[t.key]}</p>
            </div>
          ))}
        </section>

        {/* 建議 */}
        <section className="card-mystic mt-4 border-gold-500/35 p-5 sm:p-6">
          <h2 className="font-serif text-lg font-bold text-gold-400">給你的建議</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-300 sm:text-base">{lot.advice}</p>
        </section>
      </ResultShell>
    );
  }

  const currentLotNo =
    draws.length > 0 ? set.lots[draws[Math.min(drawIdx, draws.length - 1)].lotIndex % set.lots.length].no : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* ── 步驟一：默想 ── */}
      {phase === "intro" && (
        <div className="card-mystic animate-rise-in p-5 sm:p-7">
          <p className="divider-star text-xs font-semibold">✦ 步驟一・靜心默想 ✦</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            深呼吸三次，在心中向{set.deity}報上自己想請示的事。一事一問、心誠則靈，
            準備好了再開始搖籤。
          </p>
          <div className="mt-5">
            <label htmlFor="lots-q" className="mb-2 block text-sm font-medium text-ink-300">
              想請示的事<span className="ml-1 text-xs text-ink-500">（選填，40 字內）</span>
            </label>
            <input
              id="lots-q"
              type="text"
              className="input-mystic"
              placeholder="例如：接下來半年，我和他的緣分該怎麼經營？"
              maxLength={40}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <p className="mt-1.5 text-right text-xs text-ink-500">{question.length}/40</p>
          </div>
          <button className="btn-gold mt-4 w-full" onClick={startShake}>
            開始搖籤
          </button>
        </div>
      )}

      {/* ── 步驟二：搖籤 ── */}
      {(phase === "shaking" || phase === "risen") && (
        <div className="card-mystic p-5 text-center sm:p-7">
          <p className="divider-star text-xs font-semibold">
            {phase === "shaking" ? "✦ 步驟二・誠心搖籤 ✦" : "✦ 步驟三・擲筊確認 ✦"}
          </p>

          {/* 籤筒 */}
          <div
            aria-hidden
            className={`relative mx-auto mt-10 h-40 w-28 ${phase === "shaking" ? "origin-bottom animate-shake" : ""}`}
          >
            <div className="absolute -top-7 left-1/2 flex -translate-x-1/2 items-end gap-1">
              {[38, 46, 34, 50, 42, 32, 44].map((h, i) => (
                <span key={i} className="w-1.5 rounded-t-full bg-gold-300/80" style={{ height: `${h}px` }} />
              ))}
            </div>
            <div className="absolute inset-x-0 top-5 bottom-0 rounded-t-md rounded-b-[2.5rem] border border-gold-500/50 bg-gradient-to-b from-night-600 to-night-900 shadow-[0_10px_30px_rgba(7,11,26,0.7)]">
              <span className="absolute inset-x-3 top-3 h-1.5 rounded-full bg-gold-500/30" />
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-serif text-3xl text-gold-400/90">
                籤
              </span>
            </div>
          </div>

          {phase === "shaking" && (
            <p className="mt-6 text-sm text-ink-300" aria-live="polite">
              誠心搖籤中…
              {drawIdx > 0 && <span className="ml-1 text-xs text-ink-500">（第 {drawIdx + 1} 次請示）</span>}
            </p>
          )}

          {/* 籤支彈出 + 擲筊 */}
          {phase === "risen" && currentLotNo !== null && (
            <div className="animate-rise-in">
              <div className="mx-auto mt-6 flex w-14 items-center justify-center rounded-t-full rounded-b-md border border-gold-500/60 bg-gradient-to-b from-gold-300/25 to-gold-500/10 px-2 py-5">
                <span className="font-serif text-lg font-bold tracking-[0.35em] text-gold-300 [writing-mode:vertical-rl]">
                  第{currentLotNo}籤
                </span>
              </div>
              <p className="mt-4 text-sm text-ink-300">
                籤支躍出——請擲筊向{set.deity}確認，這支籤是否是給你的指引。
              </p>

              {/* 兩枚筊杯 */}
              <div className="mt-6 flex items-center justify-center gap-6">
                <JiaoCup face={jiao === "sheng" ? "flat" : "up"} tossing={jiao === "tossing"} />
                <JiaoCup face="up" tossing={jiao === "tossing"} />
              </div>

              <div className="mt-4 min-h-10" aria-live="polite">
                {jiao === "tossing" && <p className="text-sm text-ink-500">筊杯落定中…</p>}
                {jiao === "sheng" && (
                  <p className="animate-rise-in font-serif text-lg font-bold text-gold-300">
                    聖筊！{set.deity}應允，正在為你展開籤詩…
                  </p>
                )}
                {jiao === "xiao" && (
                  <p className="animate-rise-in font-serif text-mystic-300">
                    笑筊——{set.deity}莞爾一笑，請再誠心搖一次。
                  </p>
                )}
              </div>

              {jiao === "idle" && (
                <button className="btn-gold mt-2 w-full sm:w-auto sm:px-12" onClick={tossJiao}>
                  擲筊確認
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LotsClient({ setKey }: { setKey: LotSetKey }) {
  return (
    <Suspense fallback={null}>
      <LotsFlow setKey={setKey} />
    </Suspense>
  );
}
