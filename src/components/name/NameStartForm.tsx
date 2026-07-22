"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { encodeParams } from "@/lib/encode";
import { track } from "@/lib/stats";
import RitualLoading from "@/components/RitualLoading";

type Mode = "analyze" | "baby";
type Gender = "male" | "female";
type Trait = "聰慧" | "穩重" | "開朗" | "溫柔" | "堅毅";

const NAME_RE = /^[一-鿿]{2,4}$/;
const SURNAME_RE = /^[一-鿿]{1,2}$/;
const TRAITS: Trait[] = ["聰慧", "穩重", "開朗", "溫柔", "堅毅"];

const LOADING_MSGS = ["提筆蘸墨，細數筆畫…", "推演五格三才之數…", "你的姓名格局即將揭曉…"];
const LOADING_MSGS_BABY = ["翻閱字庫，尋覓吉數…", "反查吉利筆畫組合…", "好名字的靈感正在浮現…"];

export default function NameStartForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const initialMode: Mode = sp.get("mode") === "baby" ? "baby" : "analyze";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);

  // 分析
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [nameError, setNameError] = useState("");

  // 命名
  const [surname, setSurname] = useState("");
  const [babyGender, setBabyGender] = useState<Gender>("male");
  const [trait, setTrait] = useState<Trait>("聰慧");
  const [surnameError, setSurnameError] = useState("");

  function submitAnalyze() {
    if (!NAME_RE.test(name.trim())) {
      setNameError("請輸入 2 至 4 個中文字的姓名");
      return;
    }
    setNameError("");
    track({ type: "reading_start", feature: "name" });
    setLoading(true);
  }

  function submitBaby() {
    if (!SURNAME_RE.test(surname.trim())) {
      setSurnameError("請輸入 1 至 2 個中文字的姓氏");
      return;
    }
    setSurnameError("");
    track({ type: "reading_start", feature: "name" });
    setLoading(true);
  }

  function goResult() {
    if (mode === "baby") {
      const payload = { mode: "baby" as const, surname: surname.trim(), gender: babyGender, trait };
      router.push(`/name/result?d=${encodeParams(payload)}`);
    } else {
      const payload = { mode: "analyze" as const, name: name.trim(), gender };
      router.push(`/name/result?d=${encodeParams(payload)}`);
    }
  }

  if (loading) {
    return (
      <RitualLoading
        messages={mode === "baby" ? LOADING_MSGS_BABY : LOADING_MSGS}
        onDone={goResult}
      />
    );
  }

  return (
    <div className="card-mystic p-6 sm:p-8">
      <h1 className="text-center font-serif text-2xl font-bold">
        <span className="text-gradient-gold">📜 姓名學分析</span>
      </h1>

      {/* Tabs */}
      <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-mystic-400/20 bg-night-900/40 p-1">
        {(
          [
            ["analyze", "姓名分析"],
            ["baby", "新生兒命名"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={
              "min-h-[44px] rounded-xl px-3 text-sm font-bold transition " +
              (mode === m
                ? "bg-gradient-to-br from-gold-300 to-gold-500 text-night-900"
                : "text-mystic-300 hover:text-gold-300")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "analyze" ? (
        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-100">姓名（2-4 個中文字）</span>
            <input
              type="text"
              inputMode="text"
              className="input-mystic w-full text-center text-lg tracking-widest"
              placeholder="例：王小明"
              value={name}
              maxLength={4}
              aria-invalid={!!nameError}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submitAnalyze()}
            />
          </label>
          {nameError && (
            <p role="alert" className="text-sm text-rose-400">{nameError}</p>
          )}

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-ink-100">性別</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["male", "👦 男"],
                  ["female", "👧 女"],
                ] as [Gender, string][]
              ).map(([g, label]) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  aria-pressed={gender === g}
                  className={
                    "min-h-[44px] rounded-xl border px-3 text-sm font-bold transition " +
                    (gender === g
                      ? "border-gold-400 bg-gold-500/15 text-gold-300"
                      : "border-mystic-400/30 text-mystic-300 hover:border-mystic-400")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <button type="button" className="btn-gold w-full" onClick={submitAnalyze}>
            🔮 分析我的姓名
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          <p className="text-center text-sm text-ink-300">
            輸入寶寶的姓氏與期望特質，為你反查吉利筆畫組合與候選字
          </p>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-100">姓氏（1-2 個中文字）</span>
            <input
              type="text"
              className="input-mystic w-full text-center text-lg tracking-widest"
              placeholder="例：陳 或 歐陽"
              value={surname}
              maxLength={2}
              aria-invalid={!!surnameError}
              onChange={(e) => {
                setSurname(e.target.value);
                if (surnameError) setSurnameError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && submitBaby()}
            />
          </label>
          {surnameError && (
            <p role="alert" className="text-sm text-rose-400">{surnameError}</p>
          )}

          <fieldset>
            <legend className="mb-2 text-sm font-bold text-ink-100">性別</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["male", "👦 男寶寶"],
                  ["female", "👧 女寶寶"],
                ] as [Gender, string][]
              ).map(([g, label]) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setBabyGender(g)}
                  aria-pressed={babyGender === g}
                  className={
                    "min-h-[44px] rounded-xl border px-3 text-sm font-bold transition " +
                    (babyGender === g
                      ? "border-gold-400 bg-gold-500/15 text-gold-300"
                      : "border-mystic-400/30 text-mystic-300 hover:border-mystic-400")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-100">期望特質</span>
            <select
              className="input-mystic w-full"
              value={trait}
              onChange={(e) => setTrait(e.target.value as Trait)}
            >
              {TRAITS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <button type="button" className="btn-gold w-full" onClick={submitBaby}>
            🍼 產生命名建議
          </button>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-ink-500">結果僅供娛樂與自我探索參考</p>
    </div>
  );
}
