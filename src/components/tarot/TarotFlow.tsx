"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResultShell from "@/components/ResultShell";
import TarotCardView from "@/components/tarot/TarotCardView";
import { decodeParams, encodeParams } from "@/lib/encode";
import { dailySeed, newSeed } from "@/lib/random";
import { track } from "@/lib/stats";
import { drawCards, type DrawnCard } from "@/lib/engines/tarot";
import type { TarotCard } from "@/lib/engines/tarot-data";

export type TarotMode = "single" | "three" | "love" | "career" | "yesno" | "daily";

type TextKind = "general" | "love" | "career";

interface ModeConfig {
  count: number;
  positions?: readonly string[];
  textKind: TextKind;
  resultTitle: string;
  heading: string;
  intro: string;
  placeholder: string;
  daily?: boolean;
  yesno?: boolean;
}

export const TAROT_MODES: Record<TarotMode, ModeConfig> = {
  single: {
    count: 1,
    textKind: "general",
    resultTitle: "單張塔羅牌義",
    heading: "單張塔羅",
    intro: "適合針對一件具體的事情尋求指引。靜下心，在心中默想你的問題，準備好就開始洗牌。",
    placeholder: "例如：這個月我最該專注的事情是什麼？",
  },
  three: {
    count: 3,
    positions: ["過去", "現在", "未來"],
    textKind: "general",
    resultTitle: "過去・現在・未來牌陣",
    heading: "三張牌陣・過去現在未來",
    intro: "以時間軸看待一件事的脈絡：過去的成因、現在的處境、未來的走向。默想你想釐清的主題。",
    placeholder: "例如：我目前這段關係會如何發展？",
  },
  love: {
    count: 3,
    positions: ["我的心態", "對方心態", "關係走向"],
    textKind: "love",
    resultTitle: "愛情塔羅牌陣",
    heading: "愛情塔羅",
    intro: "從你的心態、對方的心態到關係的走向，看清這段感情此刻的樣貌。默想你想請示的對象或關係。",
    placeholder: "例如：我和他之間現在的緣分如何？",
  },
  career: {
    count: 3,
    positions: ["現況", "阻礙", "建議"],
    textKind: "career",
    resultTitle: "事業財運塔羅牌陣",
    heading: "事業財運塔羅",
    intro: "釐清工作或財務的現況、眼前的阻礙，以及可以採取的方向。默想你想請示的事業或財務問題。",
    placeholder: "例如：我適不適合在這個時候轉換工作？",
  },
  yesno: {
    count: 1,
    textKind: "general",
    yesno: true,
    resultTitle: "是非題塔羅",
    heading: "是非題塔羅",
    intro: "把你的問題整理成一個可以用「是/否」回答的句子，抽一張牌看看塔羅給你的傾向。",
    placeholder: "例如：我現在適合主動聯絡他嗎？",
  },
  daily: {
    count: 1,
    textKind: "general",
    daily: true,
    resultTitle: "今日塔羅指引",
    heading: "每日塔羅",
    intro: "",
    placeholder: "",
  },
};

const YESNO_LABEL: Record<"yes" | "no" | "maybe", string> = {
  yes: "是",
  no: "否",
  maybe: "保留",
};

const YESNO_TONE: Record<"yes" | "no" | "maybe", string> = {
  yes: "text-gold-300",
  no: "text-rose-400",
  maybe: "text-mystic-300",
};

/** 逆位時 yes↔no 對調，maybe 不變 */
function resolveYesNo(yesno: TarotCard["yesno"], reversed: boolean): "yes" | "no" | "maybe" {
  if (yesno === "maybe") return "maybe";
  if (!reversed) return yesno;
  return yesno === "yes" ? "no" : "yes";
}

function cardText(d: DrawnCard, kind: TextKind): string {
  const { card, reversed } = d;
  if (kind === "love") return reversed ? card.loveReversed : card.love;
  if (kind === "career") return reversed ? card.careerReversed : card.career;
  return reversed ? card.reversed : card.upright;
}

const FAN_COUNT = 13;
const FAN_SPREAD = 7; // 每張之間的角度

function KeywordChips({ card }: { card: TarotCard }) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {card.keywords.map((k) => (
        <span
          key={k}
          className="rounded-full border border-mystic-400/40 bg-mystic-500/10 px-3 py-1 text-xs text-mystic-300"
        >
          {k}
        </span>
      ))}
    </div>
  );
}

/** 位置標籤 + 牌卡 + 牌義（三張牌陣共用） */
function SpreadCard({
  position,
  draw,
  flipped,
  textKind,
}: {
  position: string;
  draw: DrawnCard;
  flipped: boolean;
  textKind: TextKind;
}) {
  return (
    <div className="card-mystic flex flex-col items-center p-4 text-center">
      <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-0.5 font-serif text-sm font-bold text-gold-300">
        {position}
      </span>
      <div className="mt-4 flex justify-center">
        <TarotCardView card={draw.card} reversed={draw.reversed} flipped={flipped} size="md" />
      </div>
      <p className="mt-3 font-serif font-bold text-ink-100">
        {draw.card.name}
        {draw.reversed && <span className="ml-1 text-xs font-normal text-rose-400">逆位</span>}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-300">{cardText(draw, textKind)}</p>
    </div>
  );
}

type Phase = "intro" | "picking" | "result";

function TarotInner({ mode }: { mode: TarotMode }) {
  const cfg = TAROT_MODES[mode];
  const router = useRouter();
  const searchParams = useSearchParams();

  const restored = useMemo(() => {
    const d = searchParams.get("d");
    if (!d) return null;
    const data = decodeParams<{ seed: number; q?: string }>(d);
    return data && typeof data.seed === "number" ? data : null;
  }, [searchParams]);

  // daily 直接以每日種子進結果；有分享參數則還原結果；否則從介紹開始
  const initialSeed = cfg.daily ? dailySeed("tarot-daily") : restored ? restored.seed : null;
  const [phase, setPhase] = useState<Phase>(cfg.daily || restored ? "result" : "intro");
  const [seed, setSeed] = useState<number | null>(initialSeed);
  const [question, setQuestion] = useState(restored?.q ?? "");
  const [selected, setSelected] = useState<number[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);

  const draws = useMemo(
    () => (seed === null ? [] : drawCards(seed, cfg.count)),
    [seed, cfg.count],
  );

  // 逐張翻牌動畫
  useEffect(() => {
    if (phase !== "result") return;
    setRevealedCount(0);
    const timers = draws.map((_, i) =>
      setTimeout(() => setRevealedCount((c) => Math.max(c, i + 1)), 250 + i * 380),
    );
    return () => timers.forEach(clearTimeout);
  }, [phase, seed, draws.length]);

  // 選完牌把 seed 寫回網址（daily 每日固定不需重現參數）
  useEffect(() => {
    if (phase === "result" && seed !== null && !cfg.daily && !searchParams.get("d")) {
      const q = question.trim();
      router.replace(`?d=${encodeParams(q ? { seed, q } : { seed })}`, { scroll: false });
    }
  }, [phase, seed, question, cfg.daily, router, searchParams]);

  // 選滿指定張數 → 進結果
  useEffect(() => {
    if (phase === "picking" && selected.length === cfg.count) {
      const t = setTimeout(() => setPhase("result"), 650);
      return () => clearTimeout(t);
    }
  }, [selected.length, phase, cfg.count]);

  function startShuffle() {
    setSeed(newSeed());
    setSelected([]);
    track({ type: "reading_start", feature: "tarot" });
    setPhase("picking");
  }

  function pickCard(i: number) {
    if (selected.includes(i) || selected.length >= cfg.count) return;
    setSelected((s) => [...s, i]);
  }

  // ── 結果 ──
  if (phase === "result" && seed !== null && draws.length > 0) {
    const q = question.trim();
    const first = draws[0];

    let title = cfg.resultTitle;
    let summary = "";
    if (mode === "single") {
      title = `${first.card.name}${first.reversed ? "（逆位）" : ""}`;
      summary = `${first.card.name}${first.reversed ? "逆位" : "正位"}：${cardText(first, "general")}`;
    } else if (cfg.yesno) {
      const verdict = resolveYesNo(first.card.yesno, first.reversed);
      title = `是非題塔羅・傾向「${YESNO_LABEL[verdict]}」`;
      summary = `${first.card.name}${first.reversed ? "逆位" : "正位"}，塔羅的傾向是「${YESNO_LABEL[verdict]}」。`;
    } else if (cfg.daily) {
      title = "今日塔羅指引";
      summary = `今日塔羅：${first.card.name}${first.reversed ? "逆位" : "正位"}。${cardText(first, "general")}`;
    } else {
      summary = `${cfg.resultTitle}：${draws
        .map((d) => `${d.card.name}${d.reversed ? "(逆)" : ""}`)
        .join("、")}。`;
    }

    return (
      <ResultShell
        feature="tarot"
        featureName="塔羅牌占卜"
        title={title}
        summary={summary}
        retryHref={`/tarot/${mode}`}
      >
        <div className="mx-auto max-w-3xl px-4">
          <header className="text-center">
            {cfg.daily && (
              <p className="mb-2 text-sm text-gold-300">
                今日塔羅指引 ·{" "}
                {new Date().toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" })}
              </p>
            )}
            <h1 className="font-serif text-2xl font-bold text-gradient-gold sm:text-3xl">
              {cfg.heading}
            </h1>
            {q && <p className="mt-3 text-sm text-ink-500">你的提問：「{q}」</p>}
          </header>

          {/* 單張（single / daily） */}
          {cfg.count === 1 && !cfg.yesno && (
            <section className="mt-8 flex flex-col items-center">
              <TarotCardView
                card={first.card}
                reversed={first.reversed}
                flipped={revealedCount > 0}
                size="lg"
              />
              <p className="mt-4 font-serif text-xl font-bold text-ink-100">
                {first.card.name}
                <span className="ml-2 text-sm font-normal text-ink-500">{first.card.nameEn}</span>
              </p>
              <p className="text-sm text-ink-500">{first.reversed ? "逆位" : "正位"}</p>
              <div className="card-mystic mt-5 w-full p-5 sm:p-6">
                <h2 className="font-serif text-lg font-bold text-gold-400">
                  {first.reversed ? "逆位牌義" : "正位牌義"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-300 sm:text-base">
                  {cardText(first, "general")}
                </p>
              </div>
              <KeywordChips card={first.card} />
            </section>
          )}

          {/* 是非題 */}
          {cfg.yesno && (
            <section className="mt-8 flex flex-col items-center">
              <TarotCardView
                card={first.card}
                reversed={first.reversed}
                flipped={revealedCount > 0}
                size="lg"
              />
              <p className="mt-4 font-serif text-lg font-bold text-ink-100">
                {first.card.name}
                {first.reversed && <span className="ml-1 text-xs font-normal text-rose-400">逆位</span>}
              </p>
              {(() => {
                const verdict = resolveYesNo(first.card.yesno, first.reversed);
                return (
                  <p className="mt-4 text-center">
                    <span className="block text-sm text-ink-500">塔羅的傾向</span>
                    <span className={`font-serif text-6xl font-bold ${YESNO_TONE[verdict]}`}>
                      {YESNO_LABEL[verdict]}
                    </span>
                  </p>
                );
              })()}
              <div className="card-mystic mt-6 w-full p-5 sm:p-6">
                <h2 className="font-serif text-lg font-bold text-gold-400">牌義解讀</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-300 sm:text-base">
                  {cardText(first, "general")}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-ink-500">
                  是非題僅供參考。塔羅點出的是趨勢與心境，最終的選擇仍在你手上。
                </p>
              </div>
              <KeywordChips card={first.card} />
            </section>
          )}

          {/* 三張牌陣（three / love / career） */}
          {cfg.count === 3 && cfg.positions && (
            <section className="rise-stagger mt-8 grid gap-4 sm:grid-cols-3">
              {cfg.positions.map((pos, i) => (
                <SpreadCard
                  key={pos}
                  position={pos}
                  draw={draws[i]}
                  flipped={revealedCount > i}
                  textKind={cfg.textKind}
                />
              ))}
            </section>
          )}
        </div>
      </ResultShell>
    );
  }

  // ── 介紹 / 洗牌互動 ──
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {phase === "intro" && (
        <div className="card-mystic animate-rise-in p-5 sm:p-7">
          <p className="divider-star text-xs font-semibold">✦ 靜心默想 ✦</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">{cfg.intro}</p>
          <div className="mt-5">
            <label htmlFor="tarot-q" className="mb-2 block text-sm font-medium text-ink-300">
              想請示的問題<span className="ml-1 text-xs text-ink-500">（選填，60 字內）</span>
            </label>
            <input
              id="tarot-q"
              type="text"
              className="input-mystic"
              placeholder={cfg.placeholder}
              maxLength={60}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <p className="mt-1.5 text-right text-xs text-ink-500">{question.length}/60</p>
          </div>
          <button className="btn-gold mt-4 w-full" onClick={startShuffle}>
            開始洗牌
          </button>
        </div>
      )}

      {phase === "picking" && (
        <div className="text-center">
          <p className="divider-star text-xs font-semibold">
            ✦ 請憑直覺選擇 {cfg.count} 張牌（已選 {selected.length}/{cfg.count}）✦
          </p>

          {/* 牌背扇形展開 */}
          <div className="perspective-1000 relative mx-auto mt-14 h-52 w-full max-w-lg">
            {Array.from({ length: FAN_COUNT }).map((_, i) => {
              const angle = (i - (FAN_COUNT - 1) / 2) * FAN_SPREAD;
              const order = selected.indexOf(i);
              const isSelected = order >= 0;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`第 ${i + 1} 張牌`}
                  onClick={() => pickCard(i)}
                  disabled={selected.length >= cfg.count && !isSelected}
                  className="absolute left-1/2 top-2 origin-bottom transition-transform duration-300 hover:-translate-y-3 focus:outline-none disabled:cursor-default"
                  style={{
                    transform: `translateX(-50%) rotate(${angle}deg) translateY(${isSelected ? "-2.5rem" : "0"})`,
                    zIndex: isSelected ? 30 + order : i,
                  }}
                >
                  <TarotCardView
                    size="sm"
                    className={isSelected ? "ring-2 ring-gold-400 rounded-xl" : ""}
                  />
                  {isSelected && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-500 px-2 py-0.5 text-xs font-bold text-night-900">
                      {order + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <p className="mt-10 text-sm text-ink-500" aria-live="polite">
            {selected.length < cfg.count
              ? "深呼吸，把注意力放回你的問題上，再輕觸吸引你的牌。"
              : "牌已選定，正在為你翻牌…"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function TarotFlow({ mode }: { mode: TarotMode }) {
  return (
    <Suspense fallback={null}>
      <TarotInner mode={mode} />
    </Suspense>
  );
}
