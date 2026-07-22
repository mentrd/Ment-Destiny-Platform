"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { encodeParams, decodeParams } from "@/lib/encode";
import { track } from "@/lib/stats";
import RitualLoading from "@/components/RitualLoading";
import ResultShell from "@/components/ResultShell";
import {
  matchName,
  matchBirthday,
  matchZodiac,
  matchAnimal,
  type MatchResult,
} from "@/lib/engines/match";
import { heartLevel } from "@/lib/engines/match-copy";
import { ZODIAC_SIGNS, CHINESE_ZODIAC } from "@/lib/engines/horoscope-data";

export type MatchKind = "name" | "birthday" | "zodiac" | "animal";

const LOADING_MSGS = [
  "月下老人翻開姻緣簿…",
  "紅線正悄悄牽起兩端…",
  "你們的緣分指數即將揭曉…",
];

const META: Record<MatchKind, { emoji: string; title: string; featureLabel: string }> = {
  name: { emoji: "📜", title: "姓名配對", featureLabel: "姓名配對" },
  birthday: { emoji: "🎂", title: "生日配對", featureLabel: "生日配對" },
  zodiac: { emoji: "✨", title: "星座配對", featureLabel: "星座配對" },
  animal: { emoji: "🐾", title: "生肖配對", featureLabel: "生肖配對" },
};

const NAME_RE = /^[一-鿿]{2,4}$/;
const NOW_YEAR = Math.min(new Date().getFullYear(), 2026);
const YEARS = Array.from({ length: NOW_YEAR - 1919 }, (_, i) => NOW_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

/* 各型 payload 型別 */
interface NamePayload { a: string; b: string }
interface BirthdayPayload { ay: number; am: number; ad: number; by: number; bm: number; bd: number }
interface SlugPayload { a: string; b: string }

function computeFromPayload(kind: MatchKind, raw: unknown): { result: MatchResult; labelA: string; labelB: string } | null {
  try {
    if (kind === "name") {
      const p = raw as NamePayload;
      if (!p || !NAME_RE.test(p.a ?? "") || !NAME_RE.test(p.b ?? "")) return null;
      return { result: matchName(p.a, p.b), labelA: p.a, labelB: p.b };
    }
    if (kind === "birthday") {
      const p = raw as BirthdayPayload;
      const ok = [p?.ay, p?.am, p?.ad, p?.by, p?.bm, p?.bd].every((n) => Number.isInteger(n));
      if (!ok) return null;
      return {
        result: matchBirthday({ y: p.ay, m: p.am, d: p.ad }, { y: p.by, m: p.bm, d: p.bd }),
        labelA: `${p.ay}/${p.am}/${p.ad}`,
        labelB: `${p.by}/${p.bm}/${p.bd}`,
      };
    }
    if (kind === "zodiac") {
      const p = raw as SlugPayload;
      const sa = ZODIAC_SIGNS.find((s) => s.slug === p?.a);
      const sb = ZODIAC_SIGNS.find((s) => s.slug === p?.b);
      if (!sa || !sb) return null;
      return { result: matchZodiac(sa.slug, sb.slug), labelA: `${sa.emoji} ${sa.name}`, labelB: `${sb.emoji} ${sb.name}` };
    }
    // animal
    const p = raw as SlugPayload;
    const aa = CHINESE_ZODIAC.find((a) => a.slug === p?.a);
    const ab = CHINESE_ZODIAC.find((a) => a.slug === p?.b);
    if (!aa || !ab) return null;
    return { result: matchAnimal(aa.slug, ab.slug), labelA: `${aa.emoji} ${aa.name}`, labelB: `${ab.emoji} ${ab.name}` };
  } catch {
    return null;
  }
}

export default function MatchClient({ kind }: { kind: MatchKind }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const [submitting, setSubmitting] = useState(false);
  const [pendingHref, setPendingHref] = useState<string>("");

  const decoded = useMemo(() => {
    if (!encoded) return null;
    const raw = decodeParams<unknown>(encoded);
    return computeFromPayload(kind, raw);
  }, [encoded, kind]);

  if (submitting) {
    return (
      <RitualLoading
        messages={LOADING_MSGS}
        onDone={() => {
          setSubmitting(false);
          if (pendingHref) router.replace(pendingHref);
        }}
      />
    );
  }

  if (decoded) {
    return <MatchResultView kind={kind} data={decoded} />;
  }

  return (
    <MatchForm
      kind={kind}
      onSubmit={(payload) => {
        track({ type: "reading_start", feature: "match" });
        setPendingHref(`${pathname}?d=${encodeParams(payload)}`);
        setSubmitting(true);
      }}
    />
  );
}

/* ── 表單 ───────────────────────── */

function ColumnHeading({ side, label }: { side: "you" | "other"; label: string }) {
  return (
    <p className="mb-2 flex items-center gap-1.5 text-sm font-bold text-ink-100">
      <span aria-hidden>{side === "you" ? "🧑" : "❤️"}</span>
      {label}
    </p>
  );
}

function MatchForm({ kind, onSubmit }: { kind: MatchKind; onSubmit: (payload: unknown) => void }) {
  // name
  const [aName, setAName] = useState("");
  const [bName, setBName] = useState("");
  // birthday
  const [aDate, setADate] = useState({ y: 2000, m: 1, d: 1 });
  const [bDate, setBDate] = useState({ y: 2000, m: 1, d: 1 });
  // slug (zodiac/animal)
  const list = kind === "zodiac" ? ZODIAC_SIGNS : CHINESE_ZODIAC;
  const [aSlug, setASlug] = useState(list[0].slug);
  const [bSlug, setBSlug] = useState(list[0].slug);

  const [error, setError] = useState("");

  function submit() {
    if (kind === "name") {
      if (!NAME_RE.test(aName.trim()) || !NAME_RE.test(bName.trim())) {
        setError("兩人的姓名都請輸入 2 至 4 個中文字");
        return;
      }
      setError("");
      onSubmit({ a: aName.trim(), b: bName.trim() });
      return;
    }
    if (kind === "birthday") {
      const va = aDate.d <= daysInMonth(aDate.y, aDate.m);
      const vb = bDate.d <= daysInMonth(bDate.y, bDate.m);
      if (!va || !vb) {
        setError("請確認兩人的出生日期是否正確");
        return;
      }
      setError("");
      onSubmit({ ay: aDate.y, am: aDate.m, ad: aDate.d, by: bDate.y, bm: bDate.m, bd: bDate.d });
      return;
    }
    // zodiac / animal
    setError("");
    onSubmit({ a: aSlug, b: bSlug });
  }

  const meta = META[kind];

  return (
    <div className="card-mystic p-6 sm:p-8">
      <h1 className="text-center font-serif text-2xl font-bold">
        <span className="text-gradient-gold">{meta.emoji} {meta.title}</span>
      </h1>
      <p className="mt-2 text-center text-sm text-ink-300">
        分別填入你與對方的資料，測出你們的緣分指數
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* 你 */}
        <div className="rounded-2xl border border-mystic-400/20 bg-night-900/30 p-4">
          <ColumnHeading side="you" label="你" />
          {kind === "name" && (
            <input
              type="text"
              className="input-mystic w-full text-center text-lg tracking-widest"
              placeholder="你的姓名"
              maxLength={4}
              value={aName}
              onChange={(e) => { setAName(e.target.value); if (error) setError(""); }}
            />
          )}
          {kind === "birthday" && <DateSelect value={aDate} onChange={setADate} />}
          {(kind === "zodiac" || kind === "animal") && (
            <SlugSelect kind={kind} value={aSlug} onChange={setASlug} />
          )}
        </div>

        {/* 對方 */}
        <div className="rounded-2xl border border-rose-400/20 bg-night-900/30 p-4">
          <ColumnHeading side="other" label="對方" />
          {kind === "name" && (
            <input
              type="text"
              className="input-mystic w-full text-center text-lg tracking-widest"
              placeholder="對方的姓名"
              maxLength={4}
              value={bName}
              onChange={(e) => { setBName(e.target.value); if (error) setError(""); }}
            />
          )}
          {kind === "birthday" && <DateSelect value={bDate} onChange={setBDate} />}
          {(kind === "zodiac" || kind === "animal") && (
            <SlugSelect kind={kind} value={bSlug} onChange={setBSlug} />
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
          {error}
        </p>
      )}

      <button type="button" className="btn-gold mt-6 w-full" onClick={submit}>
        💞 測我們的緣分
      </button>
      <p className="mt-4 text-center text-xs text-ink-500">結果僅供娛樂與自我探索參考</p>
    </div>
  );
}

function DateSelect({
  value,
  onChange,
}: {
  value: { y: number; m: number; d: number };
  onChange: (v: { y: number; m: number; d: number }) => void;
}) {
  const days = Array.from({ length: daysInMonth(value.y, value.m) }, (_, i) => i + 1);
  const dSafe = Math.min(value.d, days.length);
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <select
        className="input-mystic w-full px-2"
        value={value.y}
        aria-label="出生年"
        onChange={(e) => onChange({ ...value, y: Number(e.target.value), d: dSafe })}
      >
        {YEARS.map((v) => <option key={v} value={v}>{v}年</option>)}
      </select>
      <select
        className="input-mystic w-full px-2"
        value={value.m}
        aria-label="出生月"
        onChange={(e) => onChange({ ...value, m: Number(e.target.value), d: dSafe })}
      >
        {MONTHS.map((v) => <option key={v} value={v}>{v}月</option>)}
      </select>
      <select
        className="input-mystic w-full px-2"
        value={dSafe}
        aria-label="出生日"
        onChange={(e) => onChange({ ...value, d: Number(e.target.value) })}
      >
        {days.map((v) => <option key={v} value={v}>{v}日</option>)}
      </select>
    </div>
  );
}

function SlugSelect({
  kind,
  value,
  onChange,
}: {
  kind: "zodiac" | "animal";
  value: string;
  onChange: (v: string) => void;
}) {
  const list = kind === "zodiac" ? ZODIAC_SIGNS : CHINESE_ZODIAC;
  return (
    <select
      className="input-mystic w-full"
      value={value}
      aria-label={kind === "zodiac" ? "星座" : "生肖"}
      onChange={(e) => onChange(e.target.value)}
    >
      {list.map((o) => (
        <option key={o.slug} value={o.slug}>{o.emoji} {o.name}</option>
      ))}
    </select>
  );
}

/* ── 結果 ───────────────────────── */

function useCountUp(target: number, duration = 1200): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return n;
}

function ScoreRing({ score }: { score: number }) {
  const count = useCountUp(score);
  const R = 54;
  const C = 2 * Math.PI * R;
  const [offset, setOffset] = useState(C);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOffset(C * (1 - score / 100)));
    return () => cancelAnimationFrame(id);
  }, [score, C]);

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(139,122,232,0.18)" strokeWidth="10" />
        <circle
          cx="64"
          cy="64"
          r={R}
          fill="none"
          stroke="url(#matchGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <defs>
          <linearGradient id="matchGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2dd9b" />
            <stop offset="50%" stopColor="#e6c860" />
            <stop offset="100%" stopColor="#e58bb0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-5xl font-bold text-gradient-gold">{count}</span>
        <span className="text-xs text-ink-500">緣分指數</span>
      </div>
    </div>
  );
}

function MatchResultView({
  kind,
  data,
}: {
  kind: MatchKind;
  data: { result: MatchResult; labelA: string; labelB: string };
}) {
  const { result, labelA, labelB } = data;
  const heart = heartLevel(result.score);
  const meta = META[kind];
  const title = `${labelA} ♥ ${labelB}・緣分 ${result.score} 分`;
  const summary = `${heart.label}｜${result.mode}・${result.tip}`;

  return (
    <ResultShell
      feature="match"
      featureName="愛情配對"
      title={title}
      summary={summary}
      retryHref={`/match/${kind}`}
    >
      {/* 分數環 */}
      <section aria-label="緣分指數" className="card-mystic p-6 text-center sm:p-8">
        <p className="text-sm text-mystic-300">{meta.emoji} {meta.featureLabel}</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 font-serif text-lg font-bold text-ink-100">
          <span>{labelA}</span>
          <span className="text-rose-400" aria-hidden>♥</span>
          <span>{labelB}</span>
        </div>
        <div className="mt-4">
          <ScoreRing score={result.score} />
        </div>
        <p className="mt-4 font-serif text-2xl font-bold text-gradient-gold">
          {heart.emoji} {heart.label}
        </p>
      </section>

      {/* 相處模式 */}
      <section aria-label="相處模式" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 相處模式 ✦</h2>
        <p className="text-center font-serif text-xl font-bold text-gold-400">{result.mode}</p>
      </section>

      {/* 優勢 */}
      <section aria-label="你們的優勢" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-gold-400">💪 你們的優勢</h2>
        <ul className="space-y-3">
          {result.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-xs text-gold-300" aria-hidden>✓</span>
              <span className="text-sm leading-relaxed text-ink-100">{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 注意事項 */}
      <section aria-label="需要注意的地方" className="card-mystic mt-6 p-5 sm:p-6">
        <h2 className="mb-4 font-serif text-lg font-bold text-rose-400">⚠ 需要留意</h2>
        <ul className="space-y-3">
          {result.cautions.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-400/20 text-xs text-rose-400" aria-hidden>!</span>
              <span className="text-sm leading-relaxed text-ink-100">{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* tip */}
      <section aria-label="月老小建議" className="card-mystic mt-6 border border-mystic-400/25 p-5 sm:p-6">
        <h2 className="mb-2 font-serif text-lg font-bold text-mystic-300">🌙 月老小建議</h2>
        <p className="text-sm leading-relaxed text-ink-100">{result.tip}</p>
      </section>
    </ResultShell>
  );
}
