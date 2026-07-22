import type { TarotCard } from "@/lib/engines/tarot-data";

interface Props {
  /** 牌面資料；僅顯示牌背時可不傳 */
  card?: TarotCard;
  /** 是否為逆位（牌面旋轉 180 度） */
  reversed?: boolean;
  /** true 顯示牌面，false 顯示牌背 */
  flipped?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-32 w-20",
  md: "h-44 w-28",
  lg: "h-60 w-38 sm:h-72 sm:w-46",
} as const;

/** 牌背：星空漸層 + 純 CSS 星芒 */
export function TarotCardBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-mystic-400/40 bg-gradient-to-br from-night-600 via-night-800 to-night-900 shadow-[0_4px_20px_rgba(7,11,26,0.6)] ${className}`}
      aria-hidden
    >
      {/* 星點 */}
      <span className="absolute left-[18%] top-[12%] text-[8px] text-gold-300/70">✦</span>
      <span className="absolute right-[15%] top-[26%] text-[6px] text-mystic-300/60">✦</span>
      <span className="absolute left-[25%] top-[42%] text-[5px] text-ink-300/50">✦</span>
      <span className="absolute right-[22%] bottom-[30%] text-[8px] text-gold-400/60">✦</span>
      <span className="absolute left-[15%] bottom-[14%] text-[6px] text-mystic-300/50">✦</span>
      <span className="absolute right-[12%] bottom-[10%] text-[5px] text-ink-300/40">✦</span>
      {/* 中央星芒 */}
      <span className="absolute inset-0 flex items-center justify-center text-2xl text-gold-400/80 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">
        ✦
      </span>
      {/* 內框 */}
      <span className="absolute inset-1.5 rounded-lg border border-gold-500/25" />
    </div>
  );
}

/** 牌面 */
export function TarotCardFace({
  card,
  reversed = false,
  className = "",
}: {
  card: TarotCard;
  reversed?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gold-500/50 bg-gradient-to-b from-night-700 to-night-900 shadow-[0_0_18px_rgba(212,175,55,0.25)] ${className}`}
    >
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center transition-transform ${
          reversed ? "rotate-180" : ""
        }`}
      >
        <span className="text-3xl sm:text-4xl" aria-hidden>{card.emoji}</span>
        <span className="font-serif text-sm font-bold leading-tight text-gold-300">{card.name}</span>
        <span className="text-[9px] leading-tight text-ink-500">{card.nameEn}</span>
      </div>
      <span className="absolute inset-1.5 rounded-lg border border-gold-500/20" aria-hidden />
    </div>
  );
}

/** 可翻轉的塔羅牌：rotateY 3D 翻牌，逆位牌面旋轉 180 度 */
export default function TarotCardView({ card, reversed = false, flipped = false, size = "md", className = "" }: Props) {
  return (
    <div className={`perspective-1000 ${SIZES[size]} ${className}`}>
      <div
        className={`preserve-3d relative h-full w-full transition-transform duration-700 ease-in-out ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <TarotCardBack className="backface-hidden absolute inset-0" />
        {card && (
          <div className="backface-hidden absolute inset-0 [transform:rotateY(180deg)]">
            <TarotCardFace card={card} reversed={reversed} className="h-full w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
