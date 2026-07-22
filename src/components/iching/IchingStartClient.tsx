"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { encodeParams } from "@/lib/encode";
import { newSeed } from "@/lib/random";
import { track } from "@/lib/stats";
import { castByCoins, lineValueLabel } from "@/lib/engines/iching";

type Method = "coins" | "numbers" | "time";

const TABS: { key: Method; label: string; icon: string }[] = [
  { key: "coins", label: "擲幣起卦", icon: "🪙" },
  { key: "numbers", label: "數字起卦", icon: "🔢" },
  { key: "time", label: "時間起卦", icon: "🕐" },
];

/** 由爻值推回三枚銅錢面：字面（陰）=2、花面（陽）=3 */
function coinFaces(value: number): boolean[] {
  // true = 花面（陽 3）
  const yangCount = value - 6; // 6→0 枚、7→1、8→2、9→3
  return [0, 1, 2].map((i) => i < yangCount);
}

export default function IchingStartClient() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("coins");
  const [question, setQuestion] = useState("");
  const [touched, setTouched] = useState(false);

  const qLen = question.trim().length;
  const qValid = qLen >= 5 && qLen <= 100;
  const qError = touched && !qValid;

  // ── 擲幣：seed 於進頁時產生，六次結果全由 seed 決定 ──
  const [seed] = useState(() => newSeed());
  const coinResult = useMemo(() => castByCoins(seed), [seed]);
  const [revealed, setRevealed] = useState(0); // 已擲出的爻數
  const [tossing, setTossing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  function goResult(data: Record<string, unknown>) {
    track({ type: "reading_start", feature: "iching" });
    router.push(`/iching/result?d=${encodeParams({ q: question.trim(), ...data })}`);
  }

  function requireQuestion(): boolean {
    setTouched(true);
    return qValid;
  }

  function handleToss() {
    if (tossing || revealed >= 6) return;
    if (!requireQuestion()) return;
    setTossing(true);
    timerRef.current = setTimeout(() => {
      const next = revealed + 1;
      setTossing(false);
      setRevealed(next);
      if (next >= 6) {
        timerRef.current = setTimeout(() => {
          goResult({ method: "coins", seed });
        }, 900);
      }
    }, 800);
  }

  // ── 數字起卦 ──
  const [nums, setNums] = useState<[string, string, string]>(["", "", ""]);
  const [numError, setNumError] = useState("");
  function handleNumbers() {
    if (!requireQuestion()) return;
    const parsed = nums.map((s) => Number(s));
    const ok = parsed.every((n) => Number.isInteger(n) && n >= 1 && n <= 999);
    if (!ok) {
      setNumError("請輸入三個 1 到 999 之間的整數");
      return;
    }
    setNumError("");
    goResult({ method: "numbers", n1: parsed[0], n2: parsed[1], n3: parsed[2] });
  }

  // ── 時間起卦 ──
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  function handleTime() {
    if (!requireQuestion()) return;
    const d = new Date();
    goResult({
      method: "time",
      y: d.getFullYear(),
      m: d.getMonth() + 1,
      d: d.getDate(),
      h: d.getHours(),
    });
  }

  const currentLine = revealed > 0 ? coinResult.lineValues[revealed - 1] : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-serif text-2xl font-bold text-gradient-gold sm:text-3xl">易經卜卦・誠心起卦</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        先在心中默想你的問題，一事一問、問得越具體越好。結果僅供娛樂與自我探索參考。
      </p>

      {/* 問題輸入 */}
      <div className="card-mystic mt-6 p-5">
        <label htmlFor="iching-q" className="mb-2 block text-sm font-medium text-ink-300">
          你想問什麼？<span className="text-gold-400">（5–100 字）</span>
        </label>
        <textarea
          id="iching-q"
          className="input-mystic min-h-24 resize-y"
          placeholder="例如：我最近考慮轉換跑道，接下來半年在工作上該進還是該守？"
          maxLength={100}
          value={question}
          aria-invalid={qError}
          onChange={(e) => setQuestion(e.target.value)}
          onBlur={() => setTouched(true)}
        />
        <div className="mt-1.5 flex items-center justify-between text-xs">
          {qError ? (
            <span className="text-rose-400">請輸入 5 到 100 個字的問題，讓卦象有明確的對焦。</span>
          ) : (
            <span className="text-ink-500">誠心默念問題，再選擇下方任一方式起卦。</span>
          )}
          <span className={qLen > 100 || qError ? "text-rose-400" : "text-ink-500"}>{qLen}/100</span>
        </div>
      </div>

      {/* 起卦方式 tabs */}
      <div className="mt-6 grid grid-cols-3 gap-2" role="tablist" aria-label="起卦方式">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={method === t.key}
            onClick={() => setMethod(t.key)}
            className={`min-h-11 rounded-xl border px-2 py-2.5 text-sm font-medium transition-colors ${
              method === t.key
                ? "border-gold-500/60 bg-gold-500/10 text-gold-300"
                : "border-mystic-400/25 text-ink-500 hover:border-mystic-400/50 hover:text-ink-300"
            }`}
          >
            <span aria-hidden className="mr-1">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 擲幣 ── */}
      {method === "coins" && (
        <div className="card-mystic mt-4 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-300">
            古法以三枚銅錢擲六次成卦，由下而上逐爻累積。按「擲出」讓銅錢落定，六爻齊備即成卦。
          </p>

          {/* 三枚銅錢 */}
          <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6">
            {[0, 1, 2].map((i) => {
              const face = currentLine !== null ? coinFaces(currentLine)[i] : null;
              return (
                <div
                  key={`${revealed}-${i}`}
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-500/70 bg-gradient-to-br from-gold-300/30 to-gold-500/20 font-serif text-lg font-bold text-gold-300 shadow-[0_0_14px_rgba(212,175,55,0.25)] sm:h-20 sm:w-20 ${
                    tossing ? "animate-coin-toss" : ""
                  }`}
                  aria-hidden
                >
                  {tossing ? "" : face === null ? "🪙" : face ? "花" : "字"}
                </div>
              );
            })}
          </div>

          {/* 本次爻結果 */}
          <div className="mt-4 min-h-8 text-center" aria-live="polite">
            {!tossing && currentLine !== null && revealed <= 6 && (
              <p className="animate-rise-in font-serif text-lg text-ink-100">
                第 {revealed} 爻：
                <span className="mx-1 text-2xl text-gold-300">{currentLine % 2 === 1 ? "⚊" : "⚋"}</span>
                <span className={currentLine === 6 || currentLine === 9 ? "text-gold-400" : "text-mystic-300"}>
                  {lineValueLabel(currentLine)}
                </span>
              </p>
            )}
            {tossing && <p className="text-sm text-ink-500">銅錢翻飛中…</p>}
          </div>

          {/* 已成之爻：由下而上堆疊 */}
          <div className="mx-auto mt-2 flex w-44 flex-col-reverse gap-2" aria-label="已擲出的爻">
            {coinResult.lineValues.slice(0, revealed).map((v, i) => {
              const yang = v % 2 === 1;
              const changing = v === 6 || v === 9;
              const cls = `h-2.5 rounded-sm ${changing ? "bg-gold-400 shadow-[0_0_10px_rgba(212,175,55,0.6)]" : "bg-mystic-300/85"}`;
              return (
                <div key={i} className="flex animate-rise-in items-center gap-2">
                  <span className="w-6 text-right text-[10px] text-ink-500">{["初", "二", "三", "四", "五", "上"][i]}</span>
                  <div className="flex w-28 items-center justify-between">
                    {yang ? <span className={`${cls} w-full`} /> : (
                      <>
                        <span className={`${cls} w-[42%]`} />
                        <span className={`${cls} w-[42%]`} />
                      </>
                    )}
                  </div>
                  <span className="w-6 text-[10px] text-gold-400">{changing ? "動" : ""}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            {revealed < 6 ? (
              <button className="btn-gold w-full sm:w-auto sm:px-12" onClick={handleToss} disabled={tossing}>
                {revealed === 0 ? "擲出第一爻" : `擲出第 ${revealed + 1} 爻`}（{revealed}/6）
              </button>
            ) : (
              <p className="animate-rise-in font-serif text-gold-300">六爻已成，正在為你解卦…</p>
            )}
          </div>
        </div>
      )}

      {/* ── 數字 ── */}
      {method === "numbers" && (
        <div className="card-mystic mt-4 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-300">
            梅花易數之法：憑直覺報出三個數字（1–999），第一數取上卦、第二數取下卦、第三數定動爻。
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {(["第一數", "第二數", "第三數"] as const).map((label, i) => (
              <div key={label}>
                <label htmlFor={`iching-n${i + 1}`} className="mb-1.5 block text-xs text-ink-500">{label}</label>
                <input
                  id={`iching-n${i + 1}`}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={999}
                  placeholder="1–999"
                  className="input-mystic text-center"
                  value={nums[i]}
                  onChange={(e) => {
                    const next = [...nums] as [string, string, string];
                    next[i] = e.target.value;
                    setNums(next);
                    setNumError("");
                  }}
                />
              </div>
            ))}
          </div>
          {numError && <p className="mt-2 text-xs text-rose-400">{numError}</p>}
          <div className="mt-6 text-center">
            <button className="btn-gold w-full sm:w-auto sm:px-12" onClick={handleNumbers}>
              以此三數起卦
            </button>
          </div>
        </div>
      )}

      {/* ── 時間 ── */}
      {method === "time" && (
        <div className="card-mystic mt-4 p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-300">
            以「此刻」的年、月、日、時起卦——問題浮現的那一刻，本身就是徵兆。
          </p>
          <div className="mt-5 rounded-xl border border-mystic-400/25 bg-night-900/50 p-4 text-center">
            <p className="text-xs text-ink-500">目前時間</p>
            <p className="mt-1 font-serif text-xl text-gold-300" suppressHydrationWarning>
              {now
                ? `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
                : "…"}
            </p>
          </div>
          <div className="mt-6 text-center">
            <button className="btn-gold w-full sm:w-auto sm:px-12" onClick={handleTime}>
              以此刻起卦
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
