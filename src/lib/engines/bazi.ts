/**
 * 八字命盤引擎：四柱、十神、藏干、五行統計、日主強弱、喜用神、大運、生肖
 * 僅供娛樂與自我探索參考。
 */

import {
  TIANGAN, DIZHI, GAN_WUXING, GAN_YANG, ZHI_WUXING, ZHI_CANGGAN,
  SHENGXIAO, type WuXing, type GanZhi, ganZhiName,
  dayGanZhi, yearGanZhi, monthGanZhi, hourGanZhi, hourToZhi, daysToJie,
  solarToLunar, lunarDateName,
} from "./lunar";

export interface BaziInput {
  y: number;
  m: number;
  d: number;
  /** 出生小時 0-23；null 表示不知道時辰 */
  hour: number | null;
  gender: "M" | "F";
}

export interface Pillar {
  label: "年柱" | "月柱" | "日柱" | "時柱";
  gan: string;          // 天干
  zhi: string;          // 地支
  name: string;         // 干支合稱
  ganShiShen: string;   // 天干十神（日主標「日主」）
  cangGan: { gan: string; shiShen: string }[]; // 地支藏干與其十神
  wuxingGan: WuXing;
  wuxingZhi: WuXing;
}

export interface DaYun {
  order: number;        // 第幾柱大運
  startAge: number;     // 起運虛歲
  endAge: number;
  name: string;         // 干支
  gan: string;
  zhi: string;
  ganShiShen: string;
}

export interface BaziResult {
  input: BaziInput;
  pillars: Pillar[];               // 年月日（時柱若未知則長度 3）
  hourUnknown: boolean;
  dayMaster: string;               // 日主天干
  dayMasterWuxing: WuXing;
  dayMasterYang: boolean;
  shengXiao: string;               // 生肖（依立春年柱）
  lunarText: string | null;        // 農曆日期描述
  wuxingCount: Record<WuXing, number>;   // 五行加權統計
  wuxingPercent: Record<WuXing, number>; // 百分比（四捨五入）
  strong: boolean;                 // 身強 / 身弱
  supportScore: number;            // 同黨分數
  opposeScore: number;             // 異黨分數
  strengthText: string;            // 強弱說明
  favorable: WuXing[];             // 喜用五行
  favorableText: string;           // 喜用神提示
  daYun: DaYun[];
  daYunForward: boolean;           // 大運順排/逆排
  qiYunAge: number;                // 起運虛歲
}

const WUXING_ALL: WuXing[] = ["木", "火", "土", "金", "水"];

/** 五行相生：木→火→土→金→水→木 */
const SHENG_NEXT: Record<WuXing, WuXing> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
/** 五行相剋：木剋土、土剋水、水剋火、火剋金、金剋木 */
const KE_NEXT: Record<WuXing, WuXing> = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

/** 十神：以日主天干推算其他天干 */
export function shiShen(dayGan: number, otherGan: number): string {
  const dmEl = GAN_WUXING[dayGan];
  const el = GAN_WUXING[otherGan];
  const samePolarity = GAN_YANG[dayGan] === GAN_YANG[otherGan];
  if (el === dmEl) return samePolarity ? "比肩" : "劫財";
  if (SHENG_NEXT[dmEl] === el) return samePolarity ? "食神" : "傷官";
  if (KE_NEXT[dmEl] === el) return samePolarity ? "偏財" : "正財";
  if (KE_NEXT[el] === dmEl) return samePolarity ? "七殺" : "正官";
  return samePolarity ? "偏印" : "正印"; // el 生 dmEl
}

function buildPillar(label: Pillar["label"], gz: GanZhi, dayGan: number, isDayPillar = false): Pillar {
  return {
    label,
    gan: TIANGAN[gz.gan],
    zhi: DIZHI[gz.zhi],
    name: ganZhiName(gz),
    ganShiShen: isDayPillar ? "日主" : shiShen(dayGan, gz.gan),
    cangGan: ZHI_CANGGAN[gz.zhi].map((g) => ({ gan: TIANGAN[g], shiShen: shiShen(dayGan, g) })),
    wuxingGan: GAN_WUXING[gz.gan],
    wuxingZhi: ZHI_WUXING[gz.zhi],
  };
}

export function computeBazi(input: BaziInput): BaziResult {
  const { y, m, d, hour, gender } = input;
  const hourUnknown = hour === null || hour === undefined;

  const yearInfo = yearGanZhi(y, m, d);
  const monthInfo = monthGanZhi(y, m, d);
  const dayGz = dayGanZhi(y, m, d);
  const hourGz = hourUnknown ? null : hourGanZhi(dayGz.gan, hourToZhi(hour as number));

  const dayGan = dayGz.gan;
  const pillars: Pillar[] = [
    buildPillar("年柱", yearInfo.gz, dayGan),
    buildPillar("月柱", monthInfo.gz, dayGan),
    buildPillar("日柱", dayGz, dayGan, true),
  ];
  if (hourGz) pillars.push(buildPillar("時柱", hourGz, dayGan));

  /* ── 五行統計（天干 1.0；藏干主氣 0.7 / 中氣 0.25 / 餘氣 0.15；月支加權 1.5 倍） ── */
  const count: Record<WuXing, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const gzList: { gz: GanZhi; isMonth: boolean }[] = [
    { gz: yearInfo.gz, isMonth: false },
    { gz: monthInfo.gz, isMonth: true },
    { gz: dayGz, isMonth: false },
  ];
  if (hourGz) gzList.push({ gz: hourGz, isMonth: false });

  const hiddenWeights = [0.7, 0.25, 0.15];
  for (const { gz, isMonth } of gzList) {
    count[GAN_WUXING[gz.gan]] += 1;
    const factor = isMonth ? 1.5 : 1;
    ZHI_CANGGAN[gz.zhi].forEach((g, i) => {
      count[GAN_WUXING[g]] += (hiddenWeights[i] ?? 0.15) * factor;
    });
  }
  const total = WUXING_ALL.reduce((s, w) => s + count[w], 0);
  const percent = {} as Record<WuXing, number>;
  WUXING_ALL.forEach((w) => {
    percent[w] = Math.round((count[w] / total) * 100);
  });

  /* ── 日主強弱（簡化）：同黨（同我+生我） vs 異黨（洩我+耗我+剋我） ── */
  const dmEl = GAN_WUXING[dayGan];
  const producesMe = WUXING_ALL.find((w) => SHENG_NEXT[w] === dmEl) as WuXing;
  const supportScore = count[dmEl] + count[producesMe];
  const opposeScore = total - supportScore;
  const strong = supportScore >= opposeScore;
  const ratio = Math.round((supportScore / total) * 100);
  const strengthText = strong
    ? `同黨（比劫＋印星）能量約佔 ${ratio}%，日主得令得勢，屬於「身強」格局：自身能量充足，適合主動輸出與承擔。`
    : `同黨（比劫＋印星）能量約佔 ${ratio}%，日主相對受剋洩，屬於「身弱」格局：適合借力使力，累積資源與後盾。`;

  /* ── 喜用神提示 ── */
  const iProduce = SHENG_NEXT[dmEl];   // 食傷
  const iControl = KE_NEXT[dmEl];      // 財
  const controlsMe = KE_NEXT[iProduce] === dmEl ? iProduce : (WUXING_ALL.find((w) => KE_NEXT[w] === dmEl) as WuXing); // 官殺
  const favorable = strong ? [iProduce, iControl, controlsMe] : [producesMe, dmEl];
  const favorableText = strong
    ? `身強宜「洩、耗、剋」：喜用五行為${favorable.join("、")}。可多接觸與這些五行相應的顏色、方位與活動，讓旺盛的能量有出口。`
    : `身弱宜「生、扶」：喜用五行為${favorable.join("、")}。可多親近與這些五行相應的顏色、方位與活動，為自己補充能量與支持。`;

  /* ── 大運：年干陰陽 + 性別定順逆，起運歲數 = 距節天數 ÷ 3 ── */
  const yearYang = GAN_YANG[yearInfo.gz.gan];
  const forward = (yearYang && gender === "M") || (!yearYang && gender === "F");
  const days = daysToJie(y, m, d, forward ? 1 : -1);
  const qiYunAge = Math.max(1, Math.round(days / 3));
  const monthIdx = (monthInfo.gz.gan * 6 + monthInfo.gz.zhi * 5) % 60; // 未使用，保留說明
  void monthIdx;
  const daYun: DaYun[] = [];
  let g = monthInfo.gz.gan;
  let z = monthInfo.gz.zhi;
  for (let i = 1; i <= 8; i++) {
    g = (g + (forward ? 1 : 9)) % 10;
    z = (z + (forward ? 1 : 11)) % 12;
    daYun.push({
      order: i,
      startAge: qiYunAge + (i - 1) * 10,
      endAge: qiYunAge + i * 10 - 1,
      name: TIANGAN[g] + DIZHI[z],
      gan: TIANGAN[g],
      zhi: DIZHI[z],
      ganShiShen: shiShen(dayGan, g),
    });
  }

  const lunar = solarToLunar(y, m, d);

  return {
    input,
    pillars,
    hourUnknown,
    dayMaster: TIANGAN[dayGan],
    dayMasterWuxing: dmEl,
    dayMasterYang: GAN_YANG[dayGan],
    shengXiao: SHENGXIAO[yearInfo.gz.zhi],
    lunarText: lunar ? `農曆${lunar.year}年${lunarDateName(lunar)}` : null,
    wuxingCount: count,
    wuxingPercent: percent,
    strong,
    supportScore: Math.round(supportScore * 100) / 100,
    opposeScore: Math.round(opposeScore * 100) / 100,
    strengthText,
    favorable,
    favorableText,
    daYun,
    daYunForward: forward,
    qiYunAge,
  };
}
