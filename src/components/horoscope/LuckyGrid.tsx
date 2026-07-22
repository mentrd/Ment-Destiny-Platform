import type { LuckyColor } from "@/lib/engines/horoscope-copy";

function LuckyCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card-mystic flex flex-col items-center gap-1.5 p-4 text-center">
      <p className="text-xs text-ink-500">{label}</p>
      <div className="flex items-center justify-center gap-2 text-ink-100">{children}</div>
    </div>
  );
}

/** 幸運色（色塊）/ 幸運數字 / 幸運方位 / 速配 卡片格 */
export default function LuckyGrid({
  color,
  number,
  direction,
  match,
}: {
  color: LuckyColor;
  number: number;
  direction?: string;
  match?: { emoji: string; name: string; label?: string };
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <LuckyCard label="幸運色">
        <span
          aria-hidden
          className="inline-block h-5 w-5 shrink-0 rounded-full border border-white/25 shadow-inner"
          style={{ backgroundColor: color.hex }}
        />
        <span className="text-sm font-bold">{color.name}</span>
      </LuckyCard>
      <LuckyCard label="幸運數字">
        <span className="font-serif text-xl font-bold text-gold-300">{number}</span>
      </LuckyCard>
      {direction && (
        <LuckyCard label="幸運方位">
          <span className="font-serif text-lg font-bold">{direction}</span>
        </LuckyCard>
      )}
      {match && (
        <LuckyCard label={match.label ?? "今日速配"}>
          <span aria-hidden className="text-lg">{match.emoji}</span>
          <span className="text-sm font-bold">{match.name}</span>
        </LuckyCard>
      )}
    </div>
  );
}
