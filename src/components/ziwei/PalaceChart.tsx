import type { ZiweiPalace, SiHuaType } from "@/lib/engines/ziwei";
import { KEY_PALACES } from "@/lib/engines/ziwei-copy";

/** 地支索引 → 桌機 4×4 外圈格位（巳午未申 / 辰…酉 / 卯…戌 / 寅丑子亥） */
const GRID_POS: Record<number, string> = {
  5: "col-start-1 row-start-1", 6: "col-start-2 row-start-1", 7: "col-start-3 row-start-1", 8: "col-start-4 row-start-1",
  4: "col-start-1 row-start-2", 9: "col-start-4 row-start-2",
  3: "col-start-1 row-start-3", 10: "col-start-4 row-start-3",
  2: "col-start-1 row-start-4", 1: "col-start-2 row-start-4", 0: "col-start-3 row-start-4", 11: "col-start-4 row-start-4",
};

export const SIHUA_BADGE: Record<SiHuaType, string> = {
  祿: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  權: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  科: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  忌: "border-zinc-400/40 bg-zinc-400/10 text-zinc-300",
};

export interface CenterInfo {
  lunarName: string;
  wuxingJu: string;
  mingGongZhi: string;
  shenGongZhi: string;
  yearGanZhiName: string;
}

function isKeyPalace(name: string): boolean {
  return (KEY_PALACES as readonly string[]).includes(name);
}

function PalaceCell({ palace }: { palace: ZiweiPalace }) {
  const key = isKeyPalace(palace.name);
  return (
    <div
      className={`flex min-h-28 flex-col rounded-xl border p-2 ${
        key
          ? "border-gold-500/60 bg-gold-500/5 shadow-[0_0_12px_rgba(212,175,55,0.12)]"
          : "border-mystic-400/20 bg-night-700/40"
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span className={`text-xs font-bold ${key ? "text-gold-300" : "text-ink-300"}`}>
          {palace.name}
          {palace.isShenGong && (
            <span className="ml-1 rounded border border-mystic-400/50 bg-mystic-500/20 px-1 text-[10px] font-normal text-mystic-300">身</span>
          )}
        </span>
        <span className="text-[10px] text-ink-500">{palace.gan}{palace.zhi}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-0.5">
        {palace.mainStars.length > 0 ? (
          palace.mainStars.map((s) => (
            <span key={s} className="font-serif text-sm font-bold text-gold-400">{s}</span>
          ))
        ) : (
          <span className="text-xs text-ink-500">（借對宮）</span>
        )}
      </div>
      {palace.subStars.length > 0 && (
        <p className="mt-1 text-[10px] leading-relaxed text-mystic-300">{palace.subStars.join(" ")}</p>
      )}
      {palace.sihua.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1 pt-1.5">
          {palace.sihua.map((sh) => (
            <span
              key={sh.star + sh.type}
              className={`rounded border px-1 py-px text-[10px] ${SIHUA_BADGE[sh.type]}`}
            >
              {sh.star}化{sh.type}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function CenterPanel({ center }: { center: CenterInfo }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-gold-500/30 bg-night-700/60 p-4 text-center">
      <p className="font-serif text-lg font-bold text-gradient-gold">紫微命盤</p>
      <p className="text-sm text-ink-100">{center.lunarName}</p>
      <p className="text-sm text-ink-300">{center.yearGanZhiName}年生・{center.wuxingJu}</p>
      <p className="text-sm text-ink-300">
        命宮在<span className="mx-0.5 font-bold text-gold-300">{center.mingGongZhi}</span>・
        身宮在<span className="mx-0.5 font-bold text-mystic-300">{center.shenGongZhi}</span>
      </p>
    </div>
  );
}

export default function PalaceChart({ palaces, center }: { palaces: ZiweiPalace[]; center: CenterInfo }) {
  return (
    <>
      {/* 桌機：4×4 環狀盤 */}
      <div className="hidden gap-2 sm:grid sm:grid-cols-4" role="img" aria-label="紫微斗數十二宮命盤">
        {palaces.map((p) => (
          <div key={p.name} className={GRID_POS[p.zhiIndex]}>
            <PalaceCell palace={p} />
          </div>
        ))}
        <div className="col-start-2 col-span-2 row-start-2 row-span-2">
          <CenterPanel center={center} />
        </div>
      </div>

      {/* 手機：中央資訊 + 2 欄卡片 */}
      <div className="sm:hidden">
        <CenterPanel center={center} />
        <div className="mt-3 grid grid-cols-2 gap-2">
          {palaces.map((p) => (
            <PalaceCell key={p.name} palace={p} />
          ))}
        </div>
      </div>
    </>
  );
}
