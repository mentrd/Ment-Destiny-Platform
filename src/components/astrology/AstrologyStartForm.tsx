"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CITIES } from "@/lib/engines/astrology";
import { encodeParams } from "@/lib/encode";
import { track } from "@/lib/stats";
import RitualLoading from "@/components/RitualLoading";

const NOW_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: NOW_YEAR - 1919 }, (_, i) => NOW_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

export default function AstrologyStartForm() {
  const router = useRouter();
  const [y, setY] = useState(2000);
  const [m, setM] = useState(1);
  const [d, setD] = useState(1);
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [unknownTime, setUnknownTime] = useState(false);
  const [cityIndex, setCityIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1), [y, m]);
  const dSafe = Math.min(d, days.length);

  function submit() {
    const maxDay = daysInMonth(y, m);
    if (y < 1920 || y > NOW_YEAR || m < 1 || m > 12 || dSafe < 1 || dSafe > maxDay) {
      setError("請確認出生日期是否正確");
      return;
    }
    if (cityIndex < 0 || cityIndex >= CITIES.length) {
      setError("請選擇出生城市");
      return;
    }
    setError("");
    track({ type: "reading_start", feature: "astrology" });
    setLoading(true);
  }

  function goResult() {
    const params = {
      y,
      m,
      d: dSafe,
      h: unknownTime ? 12 : hour,
      mi: unknownTime ? 0 : minute,
      c: cityIndex,
      ...(unknownTime ? { u: 1 as const } : {}),
    };
    router.push(`/astrology/result?d=${encodeParams(params)}`);
  }

  if (loading) {
    return (
      <RitualLoading
        messages={["仰望你出生那一刻的星空…", "行星正回到當時的位置…", "你的本命盤正在成形…"]}
        onDone={goResult}
      />
    );
  }

  return (
    <div className="card-mystic p-6 sm:p-8">
      <h1 className="text-center font-serif text-2xl font-bold">
        <span className="text-gradient-gold">✨ 排出你的本命盤</span>
      </h1>
      <p className="mt-2 text-center text-sm text-ink-300">
        輸入出生資料，計算太陽、月亮與上升星座
      </p>

      <div className="mt-6 space-y-5">
        {/* 出生日期 */}
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
        </fieldset>

        {/* 出生時間 */}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink-100">出生時間（當地時間）</legend>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="sr-only">時</span>
              <select
                className="input-mystic w-full disabled:opacity-40"
                value={hour}
                disabled={unknownTime}
                onChange={(e) => setHour(Number(e.target.value))}
              >
                {HOURS.map((v) => (
                  <option key={v} value={v}>{String(v).padStart(2, "0")} 時</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="sr-only">分</span>
              <select
                className="input-mystic w-full disabled:opacity-40"
                value={minute}
                disabled={unknownTime}
                onChange={(e) => setMinute(Number(e.target.value))}
              >
                {MINUTES.map((v) => (
                  <option key={v} value={v}>{String(v).padStart(2, "0")} 分</option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-2 text-sm text-ink-300">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 accent-[var(--gold-400,#e6c860)]"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
            />
            <span>我不知道確切的出生時間</span>
          </label>
          {unknownTime && (
            <p className="mt-2 rounded-xl border border-mystic-400/30 bg-mystic-500/10 px-3 py-2 text-xs leading-relaxed text-mystic-300">
              沒關係！太陽星座不受影響；月亮星座將以當天中午 12:00
              估算（少數情況可能相差一個星座）；上升星座因為每兩小時就換一個，將暫不計算。
              建議之後向家人或出生證明查詢，再回來補上時間。
            </p>
          )}
        </fieldset>

        {/* 出生城市 */}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink-100">出生城市</legend>
          <label className="block">
            <span className="sr-only">出生城市</span>
            <select
              className="input-mystic w-full"
              value={cityIndex}
              onChange={(e) => setCityIndex(Number(e.target.value))}
            >
              {CITIES.map((c, i) => (
                <option key={c.name} value={i}>{c.name}</option>
              ))}
            </select>
          </label>
          <p className="mt-1.5 text-xs text-ink-500">用於計算上升星座（東方地平線升起的星座與地點有關）</p>
        </fieldset>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </p>
        )}

        <button type="button" className="btn-gold w-full" onClick={submit}>
          🔭 計算我的星盤
        </button>
        <p className="text-center text-xs text-ink-500">結果僅供娛樂與自我探索參考</p>
      </div>
    </div>
  );
}
