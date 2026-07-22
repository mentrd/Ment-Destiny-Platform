"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeParams } from "@/lib/encode";
import { computeZiwei, type ZiweiResult as ZiweiResultData, type ZiweiPalace } from "@/lib/engines/ziwei";
import {
  KEY_PALACES,
  getStarCopy,
  NO_MAIN_STAR_COPY,
  SIHUA_COPY,
  type KeyPalace,
} from "@/lib/engines/ziwei-copy";
import { SHICHEN_NAMES, hourToZhi, lunarDateName } from "@/lib/engines/lunar";
import ResultShell from "@/components/ResultShell";
import PalaceChart, { SIHUA_BADGE } from "@/components/ziwei/PalaceChart";
import { PLACES } from "@/components/bazi/birth-places";

interface ZiweiParams {
  y: number;
  m: number;
  d: number;
  h: number;
  g: "M" | "F";
  p: number;
}

const KEY_PALACE_META: Record<KeyPalace, { icon: string; subtitle: string }> = {
  命宮: { icon: "🌟", subtitle: "本命性格" },
  夫妻: { icon: "💞", subtitle: "感情姻緣" },
  財帛: { icon: "💰", subtitle: "財富理財" },
  官祿: { icon: "💼", subtitle: "事業發展" },
};

function isValid(p: ZiweiParams | null): p is ZiweiParams {
  if (!p) return false;
  const { y, m, d, h, g } = p;
  return (
    Number.isInteger(y) && y >= 1920 && y <= 2026 &&
    Number.isInteger(m) && m >= 1 && m <= 12 &&
    Number.isInteger(d) && d >= 1 && d <= 31 &&
    Number.isInteger(h) && h >= 0 && h <= 23 &&
    (g === "M" || g === "F")
  );
}

function InvalidNotice() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <p className="text-5xl" aria-hidden>🌫️</p>
      <h1 className="mt-4 font-serif text-xl font-bold text-ink-100">找不到這張命盤</h1>
      <p className="mt-2 text-sm text-ink-300">
        連結似乎不完整或已失效，請重新輸入出生資料，一分鐘就能排好你的紫微命盤。
      </p>
      <div className="mt-6">
        <Link href="/ziwei/start" className="btn-gold">🌌 重新排盤</Link>
      </div>
    </div>
  );
}

/** 重點宮位解析區塊 */
function KeyPalaceSection({ palace, palaces }: { palace: ZiweiPalace; palaces: ZiweiPalace[] }) {
  const key = palace.name as KeyPalace;
  const meta = KEY_PALACE_META[key];
  const opposite = palaces.find((pp) => pp.zhiIndex === (palace.zhiIndex + 6) % 12);

  return (
    <article className="card-mystic p-5">
      <header className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="font-serif text-lg font-bold text-gold-400">
          <span className="mr-1.5" aria-hidden>{meta.icon}</span>
          {key === "命宮" ? "命宮" : `${key}宮`}・{meta.subtitle}
        </h3>
        <span className="text-xs text-ink-500">
          {palace.gan}{palace.zhi}
          {palace.isShenGong && "・身宮"}
        </span>
      </header>

      <p className="mt-1.5 text-sm text-mystic-300">
        {palace.mainStars.length > 0
          ? `主星：${palace.mainStars.join("、")}`
          : `無主星（借對宮${opposite ? `「${opposite.name}」` : ""}${
              opposite && opposite.mainStars.length > 0 ? `：${opposite.mainStars.join("、")}` : ""
            }）`}
        {palace.subStars.length > 0 && `　輔星：${palace.subStars.join("、")}`}
      </p>

      <div className="mt-3 space-y-3">
        {palace.mainStars.length > 0 ? (
          palace.mainStars.map((star) => {
            const text = getStarCopy(star, key);
            return text ? (
              <p key={star} className="leading-relaxed text-ink-100">
                <strong className="mr-1 text-gold-300">{star}：</strong>
                {text}
              </p>
            ) : null;
          })
        ) : (
          <p className="leading-relaxed text-ink-100">{NO_MAIN_STAR_COPY[key]}</p>
        )}
      </div>

      {palace.sihua.length > 0 && (
        <div className="mt-4 space-y-3 border-t border-ink-500/15 pt-3">
          {palace.sihua.map((sh) => (
            <div key={sh.star + sh.type}>
              <span className={`inline-block rounded border px-1.5 py-0.5 text-xs ${SIHUA_BADGE[sh.type]}`}>
                {sh.star}化{sh.type}
              </span>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{SIHUA_COPY[sh.type]}</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

export default function ZiweiResult() {
  const sp = useSearchParams();
  const encoded = sp.get("d");

  const data = useMemo<{ params: ZiweiParams; result: ZiweiResultData } | null>(() => {
    const p = encoded ? decodeParams<ZiweiParams>(encoded) : null;
    if (!isValid(p)) return null;
    try {
      return { params: p, result: computeZiwei({ y: p.y, m: p.m, d: p.d, hour: p.h, gender: p.g }) };
    } catch {
      return null;
    }
  }, [encoded]);

  if (!data) return <InvalidNotice />;
  const { params, result } = data;

  const ming = result.palaces[0];
  const title = ming.mainStars.length > 0
    ? `${ming.mainStars.join("、")}坐命・${result.wuxingJu}`
    : `命宮在${result.mingGongZhi}・${result.wuxingJu}`;
  const summary = ming.mainStars.length > 0
    ? getStarCopy(ming.mainStars[0], "命宮") ?? ""
    : NO_MAIN_STAR_COPY["命宮"];
  const placeName = PLACES[params.p] ?? "";
  const lunarName = `農曆${result.lunar.year}年${lunarDateName(result.lunar)}`;
  const birthLabel = `${params.y} 年 ${params.m} 月 ${params.d} 日 ${SHICHEN_NAMES[hourToZhi(params.h)]}・${
    params.g === "M" ? "男" : "女"
  }${placeName ? `・${placeName}` : ""}`;

  return (
    <ResultShell
      feature="ziwei"
      featureName="紫微斗數"
      title={title}
      summary={summary}
      retryHref="/ziwei/start"
    >
      {/* 標題 */}
      <header className="mb-6 text-center">
        <h1 className="font-serif text-2xl font-bold sm:text-3xl">
          <span className="text-gradient-gold">{title}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-500">{birthLabel}</p>
        <p className="mt-1 text-sm text-ink-300">{lunarName}・{result.yearGanZhiName}年生</p>
      </header>

      {/* 十二宮盤 */}
      <section aria-label="十二宮命盤" className="card-mystic p-4 sm:p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 十二宮命盤 ✦</h2>
        <PalaceChart
          palaces={result.palaces}
          center={{
            lunarName,
            wuxingJu: result.wuxingJu,
            mingGongZhi: result.mingGongZhi,
            shenGongZhi: result.shenGongZhi,
            yearGanZhiName: result.yearGanZhiName,
          }}
        />
        <p className="mt-3 text-center text-xs text-ink-500">
          金色框為命宮、夫妻、財帛、官祿四大重點宮位；「身」為身宮所在，
          彩色標籤為生年四化（祿・權・科・忌）。
        </p>
      </section>

      {/* 重點宮位解析 */}
      <section aria-label="重點宮位解析" className="mt-6 space-y-4">
        <h2 className="divider-star font-serif text-lg font-bold">✦ 重點宮位解析 ✦</h2>
        {KEY_PALACES.map((name) => {
          const palace = result.palaces.find((pp) => pp.name === name);
          return palace ? <KeyPalaceSection key={name} palace={palace} palaces={result.palaces} /> : null;
        })}
      </section>
    </ResultShell>
  );
}
