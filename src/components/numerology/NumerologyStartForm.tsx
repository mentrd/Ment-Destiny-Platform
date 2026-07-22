"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { encodeParams } from "@/lib/encode";
import { track } from "@/lib/stats";
import RitualLoading from "@/components/RitualLoading";

const MAX_YEAR = Math.min(new Date().getFullYear(), 2026);
const YEARS = Array.from({ length: MAX_YEAR - 1919 }, (_, i) => MAX_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

export default function NumerologyStartForm() {
  const router = useRouter();
  const [y, setY] = useState(2000);
  const [m, setM] = useState(1);
  const [d, setD] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1), [y, m]);
  const dSafe = Math.min(d, days.length);

  function submit() {
    const maxDay = daysInMonth(y, m);
    if (y < 1920 || y > MAX_YEAR || m < 1 || m > 12 || dSafe < 1 || dSafe > maxDay) {
      setError("請確認出生日期是否正確");
      return;
    }
    setError("");
    track({ type: "reading_start", feature: "numerology" });
    setLoading(true);
  }

  function goResult() {
    router.push(`/numerology/result?d=${encodeParams({ y, m, d: dSafe })}`);
  }

  if (loading) {
    return (
      <RitualLoading
        messages={["回到你誕生的那一天…", "數字宇宙正在排列組合…", "你的靈數密碼即將揭曉…"]}
        onDone={goResult}
      />
    );
  }

  return (
    <div className="card-mystic p-6 sm:p-8">
      <h1 className="text-center font-serif text-2xl font-bold">
        <span className="text-gradient-gold">🔢 解開你的生命靈數</span>
      </h1>
      <p className="mt-2 text-center text-sm text-ink-300">
        只需要出生年月日，一分鐘看見你的數字密碼
      </p>

      <div className="mt-6 space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink-100">出生日期（西元）</legend>
          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="sr-only">出生年</span>
              <select className="input-mystic w-full" value={y} onChange={(e) => setY(Number(e.target.value))}>
                {YEARS.map((v) => (
                  <option key={v} value={v}>{v} 年</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">出生月</span>
              <select className="input-mystic w-full" value={m} onChange={(e) => setM(Number(e.target.value))}>
                {MONTHS.map((v) => (
                  <option key={v} value={v}>{v} 月</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">出生日</span>
              <select className="input-mystic w-full" value={dSafe} onChange={(e) => setD(Number(e.target.value))}>
                {days.map((v) => (
                  <option key={v} value={v}>{v} 日</option>
                ))}
              </select>
            </label>
          </div>
          <p className="mt-1.5 text-xs text-ink-500">
            生命靈數以西元生日計算，若只記得農曆生日，請先換算成國曆。
          </p>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </p>
        )}

        <button type="button" className="btn-gold w-full" onClick={submit}>
          🔮 計算我的生命靈數
        </button>
        <p className="text-center text-xs text-ink-500">結果僅供娛樂與自我探索參考</p>
      </div>
    </div>
  );
}
