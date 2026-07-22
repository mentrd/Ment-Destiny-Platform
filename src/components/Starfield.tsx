"use client";

import { useMemo } from "react";
import { mulberry32 } from "@/lib/random";

/** 固定種子的星空背景（SSR/CSR 一致，不觸發 hydration 差異） */
export default function Starfield({ count = 70 }: { count?: number }) {
  const stars = useMemo(() => {
    const rng = mulberry32(20260719);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rng() * 100,
      y: rng() * 100,
      size: rng() * 2 + 1,
      delay: rng() * 4,
      duration: rng() * 3 + 2,
    }));
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: 0.3,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
