"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { encodeParams } from "@/lib/encode";
import { newSeed } from "@/lib/random";
import { track } from "@/lib/stats";
import RitualLoading from "@/components/RitualLoading";

const MIN_LEN = 10;
const MAX_LEN = 500;

export default function DreamStartClient() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const len = text.trim().length;

  function submit() {
    const trimmed = text.trim();
    if (trimmed.length < MIN_LEN) {
      setError(`請至少描述 ${MIN_LEN} 個字，越具體的細節解讀越貼近你。`);
      return;
    }
    if (trimmed.length > MAX_LEN) {
      setError(`夢境描述請控制在 ${MAX_LEN} 字以內。`);
      return;
    }
    setError("");
    track({ type: "reading_start", feature: "dream" });
    setLoading(true);
  }

  function goResult() {
    router.push(`/dream/result?d=${encodeParams({ text: text.trim(), seed: newSeed() })}`);
  }

  if (loading) {
    return (
      <RitualLoading
        messages={["月亮還記得你的夢…", "正在潛入你的潛意識…", "夢的訊息即將浮現…"]}
        onDone={goResult}
      />
    );
  }

  return (
    <div className="card-mystic p-6 sm:p-8">
      <h1 className="text-center font-serif text-2xl font-bold">
        <span className="text-gradient-gold">🌙 說說你的夢</span>
      </h1>
      <p className="mt-2 text-center text-sm text-ink-300">
        盡量寫下夢裡的人物、場景、動作與醒來時的感覺，細節越多，解讀越貼近你。
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-100">夢境描述</span>
          <textarea
            className="input-mystic min-h-[10rem] w-full resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LEN + 50}
            placeholder="例如：我夢見自己在一片大海上飛，後來掉進水裡，看見一條大蛇游過來，我很害怕但牠沒有攻擊我…"
            aria-invalid={Boolean(error) || undefined}
            aria-describedby="dream-count"
          />
        </label>
        <p id="dream-count" className={`text-right text-xs ${len > MAX_LEN ? "text-rose-400" : "text-ink-500"}`}>
          {len} / {MAX_LEN} 字{len > 0 && len < MIN_LEN ? `（至少 ${MIN_LEN} 字）` : ""}
        </p>

        {error && (
          <p role="alert" className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-3 py-2 text-sm text-rose-400">
            {error}
          </p>
        )}

        <button type="button" className="btn-gold w-full" onClick={submit}>
          🔮 開始解夢
        </button>
        <p className="text-center text-xs text-ink-500">
          解讀以心理象徵與自我覺察為主，僅供娛樂參考，不涉及吉凶斷言。
        </p>
      </div>
    </div>
  );
}
