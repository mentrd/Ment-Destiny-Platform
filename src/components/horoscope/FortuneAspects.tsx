import StarRating from "@/components/StarRating";
import type { FortuneLevel } from "@/lib/engines/horoscope-copy";

export interface AspectItem {
  key: string;
  label: string;
  level: FortuneLevel;
  text?: string;
}

/** 五項運勢指數卡列（含星級與可選文案段落） */
export default function FortuneAspects({ aspects }: { aspects: AspectItem[] }) {
  return (
    <div className="rise-stagger space-y-3">
      {aspects.map((a) => (
        <section key={a.key} className="card-mystic p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-serif text-base font-bold text-ink-100">{a.label}</h2>
            <StarRating value={a.level} />
          </div>
          {a.text && <p className="mt-2 text-sm leading-relaxed text-ink-300">{a.text}</p>}
        </section>
      ))}
    </div>
  );
}
