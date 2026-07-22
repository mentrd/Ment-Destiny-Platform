"use client";

import { useEffect, useState } from "react";

/**
 * 儀式感載入動畫：星盤旋轉 + 依序浮現的引導語
 * onDone 於 duration 毫秒後觸發（預設 2600ms）
 */
export default function RitualLoading({
  messages = ["靜下心，深呼吸…", "連結宇宙的訊息…", "你的答案正在浮現…"],
  duration = 2600,
  onDone,
}: {
  messages?: string[];
  duration?: number;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setStep((s) => Math.min(s + 1, messages.length - 1)),
      duration / messages.length
    );
    const timer = setTimeout(onDone, duration);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 py-16" role="status" aria-live="polite">
      <div className="relative h-32 w-32">
        <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-gold-500/50" />
        <div
          className="absolute inset-3 rounded-full border border-mystic-400/40"
          style={{ animation: "spin-slow 8s linear infinite reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-float-slow" aria-hidden>
          🔮
        </div>
        <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gold-400 animate-twinkle" />
      </div>
      <p key={step} className="animate-rise-in font-serif text-lg text-mystic-300">
        {messages[step]}
      </p>
    </div>
  );
}
