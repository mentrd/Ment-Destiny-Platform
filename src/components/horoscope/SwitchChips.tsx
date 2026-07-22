import Link from "next/link";

export interface ChipItem {
  slug: string;
  name: string;
  emoji: string;
}

/** 12 星座 / 12 生肖切換 chips；current 為目前頁面（不可點） */
export default function SwitchChips({
  items,
  basePath,
  current,
}: {
  items: ChipItem[];
  basePath: string; // 如 /horoscope/daily
  current?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) =>
        it.slug === current ? (
          <span
            key={it.slug}
            aria-current="page"
            className="rounded-full border border-gold-500/60 bg-gold-500/10 px-3 py-1.5 text-xs font-bold text-gold-300"
          >
            <span aria-hidden className="mr-1">{it.emoji}</span>
            {it.name}
          </span>
        ) : (
          <Link
            key={it.slug}
            href={`${basePath}/${it.slug}`}
            className="rounded-full border border-mystic-500/25 bg-night-900/60 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-gold-500/50 hover:text-gold-300"
          >
            <span aria-hidden className="mr-1">{it.emoji}</span>
            {it.name}
          </Link>
        )
      )}
    </div>
  );
}
