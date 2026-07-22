/** 今日宜 / 忌 卡片 */
export default function DoAvoid({ good, bad }: { good: string; bad: string }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="card-mystic flex items-center gap-3 border-gold-500/25 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500/15 font-serif text-lg font-bold text-gold-300">
          宜
        </span>
        <span className="text-sm font-bold text-ink-100">{good}</span>
      </div>
      <div className="card-mystic flex items-center gap-3 border-rose-400/25 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-400/15 font-serif text-lg font-bold text-rose-400">
          忌
        </span>
        <span className="text-sm font-bold text-ink-100">{bad}</span>
      </div>
    </div>
  );
}
