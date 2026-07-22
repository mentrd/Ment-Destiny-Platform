"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SHICHEN_NAMES } from "@/lib/engines/lunar";
import { encodeParams } from "@/lib/encode";
import { track } from "@/lib/stats";
import RitualLoading from "@/components/RitualLoading";
import { PLACE_GROUPS, PLACES, TRUE_SOLAR_NOTE } from "@/components/bazi/birth-places";

const MIN_YEAR = 1920;
const MAX_YEAR = 2026;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MAX_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

export default function BaziStartForm() {
  const router = useRouter();
  const [y, setY] = useState(2000);
  const [m, setM] = useState(1);
  const [d, setD] = useState(1);
  const [shichen, setShichen] = useState<string>(""); // "" 未選、"-1" 不知道、"0"-"11" 時支
  const [gender, setGender] = useState<"" | "M" | "F">("");
  const [place, setPlace] = useState(0);
  const [errors, setErrors] = useState<{ shichen?: string; gender?: string; date?: string }>({});
  const [loading, setLoading] = useState(false);

  const days = useMemo(() => Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1), [y, m]);
  const dSafe = Math.min(d, days.length);

  function submit() {
    const errs: typeof errors = {};
    if (y < MIN_YEAR || y > MAX_YEAR || m < 1 || m > 12 || dSafe < 1 || dSafe > daysInMonth(y, m)) {
      errs.date = "請確認出生日期是否正確";
    }
    if (shichen === "") errs.shichen = "請選擇出生時辰，不確定可選「不知道時辰」";
    if (gender === "") errs.gender = "請選擇性別（大運順逆需要依此推算）";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    track({ type: "reading_start", feature: "bazi" });
    setLoading(true);
  }

  function goResult() {
    const params = {
      y,
      m,
      d: dSafe,
      h: shichen === "-1" ? null : Number(shichen) * 2, // 時支代表小時
      g: gender as "M" | "F",
      p: place,
    };
    router.push(`/bazi/result?d=${encodeParams(params)}`);
  }

  if (loading) {
    return (
      <RitualLoading
        messages={["撥動天干地支的羅盤…", "對照節氣，推算四柱…", "你的八字命盤正在成形…"]}
        onDone={goResult}
      />
    );
  }

  return (
    <div className="card-mystic p-6 sm:p-8">
      <h1 className="text-center font-serif text-2xl font-bold">
        <span className="text-gradient-gold">☯ 排出你的八字命盤</span>
      </h1>
      <p className="mt-2 text-center text-sm text-ink-300">
        輸入出生資料，推算四柱、五行與大運
      </p>

      <div className="mt-6 space-y-5">
        {/* 出生日期 */}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink-100">出生日期（國曆／西元）</legend>
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
          {errors.date && <p role="alert" className="mt-1.5 text-sm text-rose-400">{errors.date}</p>}
        </fieldset>

        {/* 出生時辰 */}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink-100">出生時辰</legend>
          <label className="block">
            <span className="sr-only">出生時辰</span>
            <select
              className="input-mystic w-full"
              value={shichen}
              aria-invalid={errors.shichen ? "true" : undefined}
              onChange={(e) => setShichen(e.target.value)}
            >
              <option value="" disabled>請選擇時辰</option>
              {SHICHEN_NAMES.map((name, i) => (
                <option key={name} value={i}>{name}</option>
              ))}
              <option value="-1">不知道時辰</option>
            </select>
          </label>
          {errors.shichen && <p role="alert" className="mt-1.5 text-sm text-rose-400">{errors.shichen}</p>}
          {shichen === "-1" && (
            <p className="mt-2 rounded-xl border border-mystic-400/30 bg-mystic-500/10 px-3 py-2 text-xs leading-relaxed text-mystic-300">
              沒關係！將以年、月、日三柱排盤，日主、五行與大運仍可推算，僅時柱相關細節略過。
              建議之後向家人或出生證明查詢，再回來補上時辰。
            </p>
          )}
        </fieldset>

        {/* 性別 */}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink-100">性別</legend>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="性別">
            {([["M", "男"], ["F", "女"]] as const).map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={gender === v}
                onClick={() => setGender(v)}
                className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm transition ${
                  gender === v
                    ? "border-gold-500/70 bg-gold-500/15 font-bold text-gold-300"
                    : "border-mystic-400/30 bg-night-700/60 text-ink-300 hover:border-mystic-400/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-xs text-ink-500">傳統大運以年干陰陽配性別定順逆排</p>
          {errors.gender && <p role="alert" className="mt-1.5 text-sm text-rose-400">{errors.gender}</p>}
        </fieldset>

        {/* 出生地 */}
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-ink-100">出生地</legend>
          <label className="block">
            <span className="sr-only">出生地</span>
            <select className="input-mystic w-full" value={place} onChange={(e) => setPlace(Number(e.target.value))}>
              {PLACE_GROUPS.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.places.map((name) => (
                    <option key={name} value={PLACES.indexOf(name)}>{name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{TRUE_SOLAR_NOTE}</p>
        </fieldset>

        <button type="button" className="btn-gold min-h-11 w-full" onClick={submit}>
          ☯ 排出我的八字
        </button>
        <p className="text-center text-xs text-ink-500">結果僅供娛樂與自我探索參考</p>
      </div>
    </div>
  );
}
