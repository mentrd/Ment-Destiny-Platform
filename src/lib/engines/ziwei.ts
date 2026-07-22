/**
 * 紫微斗數排盤引擎
 * 流程：西曆 → 農曆 → 定命宮身宮 → 五行局（命宮納音）→ 安紫微 → 十四主星 → 輔星 → 生年四化
 * 僅供娛樂與自我探索參考。
 */

import {
  TIANGAN, DIZHI, hourToZhi, jiaziIndex,
  solarToLunar, type LunarDate,
} from "./lunar";

export interface ZiweiInput {
  y: number;
  m: number;
  d: number;
  /** 出生小時 0-23（紫微必須有時辰） */
  hour: number;
  gender: "M" | "F";
}

export type SiHuaType = "祿" | "權" | "科" | "忌";

export interface ZiweiPalace {
  /** 宮名：命宮/兄弟/夫妻/子女/財帛/疾厄/遷移/交友/官祿/田宅/福德/父母 */
  name: string;
  zhi: string;       // 地支字
  zhiIndex: number;  // 地支索引 0-11（子=0）
  gan: string;       // 宮干字
  mainStars: string[];
  subStars: string[];
  sihua: { star: string; type: SiHuaType }[];
  isShenGong: boolean; // 身宮所在
}

export interface ZiweiResult {
  /** 由命宮起，依 命宮/兄弟/夫妻/子女/財帛/疾厄/遷移/交友/官祿/田宅/福德/父母 排序 */
  palaces: ZiweiPalace[];
  mingGongZhi: string;
  shenGongZhi: string;
  wuxingJu: string;       // 例：「土五局」
  lunar: LunarDate;
  yearGanZhiName: string; // 生年干支（依農曆年）
  input: ZiweiInput;
}

export const PALACE_NAMES = [
  "命宮", "兄弟", "夫妻", "子女", "財帛", "疾厄",
  "遷移", "交友", "官祿", "田宅", "福德", "父母",
] as const;

/* ── 六十甲子納音五行（每兩柱一組，共 30 組） ── */
const NAYIN_WUXING = [
  "金", "火", "木", "土", "金", "火", "水", "土", "金", "木",
  "水", "土", "火", "木", "水", "金", "火", "木", "土", "金",
  "火", "水", "土", "金", "木", "水", "土", "火", "木", "水",
] as const;

/** 五行局數：水二、木三、金四、土五、火六 */
const JU_NUM: Record<string, number> = { 水: 2, 木: 3, 金: 4, 土: 5, 火: 6 };
const JU_CN = ["", "", "二", "三", "四", "五", "六"];

/* ── 星曜安置表 ── */

/** 紫微星系：相對紫微的位移（逆行） */
const ZIWEI_SERIES: [string, number][] = [
  ["紫微", 0], ["天機", -1], ["太陽", -3], ["武曲", -4], ["天同", -5], ["廉貞", -8],
];
/** 天府星系：相對天府的位移（順行） */
const TIANFU_SERIES: [string, number][] = [
  ["天府", 0], ["太陰", 1], ["貪狼", 2], ["巨門", 3], ["天相", 4], ["天梁", 5], ["七殺", 6], ["破軍", 10],
];

/** 祿存所在地支（依年干）：甲寅 乙卯 丙巳 丁午 戊巳 己午 庚申 辛酉 壬亥 癸子 */
const LUCUN_BY_GAN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
/** 天魁（依年干）：甲戊庚→丑、乙己→子、丙丁→亥、辛→午、壬癸→卯 */
const KUI_BY_GAN = [1, 0, 11, 11, 1, 0, 1, 6, 3, 3];
/** 天鉞（依年干）：甲戊庚→未、乙己→申、丙丁→酉、辛→寅、壬癸→巳 */
const YUE_BY_GAN = [7, 8, 9, 9, 7, 8, 7, 2, 5, 5];

/** 火星/鈴星起點（依年支三合組）：由起點起子時，順數至生時 */
function fireBellStart(yearZhi: number): [number, number] {
  if ([2, 6, 10].includes(yearZhi)) return [1, 3];   // 寅午戌：火起丑、鈴起卯
  if ([8, 0, 4].includes(yearZhi)) return [2, 10];   // 申子辰：火起寅、鈴起戌
  if ([5, 9, 1].includes(yearZhi)) return [3, 10];   // 巳酉丑：火起卯、鈴起戌
  return [9, 10];                                     // 亥卯未：火起酉、鈴起戌
}

/** 生年四化表（依年干）：[祿, 權, 科, 忌] */
const SIHUA_BY_GAN: [string, string, string, string][] = [
  ["廉貞", "破軍", "武曲", "太陽"], // 甲
  ["天機", "天梁", "紫微", "太陰"], // 乙
  ["天同", "天機", "文昌", "廉貞"], // 丙
  ["太陰", "天同", "天機", "巨門"], // 丁
  ["貪狼", "太陰", "右弼", "天機"], // 戊
  ["武曲", "貪狼", "天梁", "文曲"], // 己
  ["太陽", "武曲", "太陰", "天同"], // 庚
  ["巨門", "太陽", "文曲", "文昌"], // 辛
  ["天梁", "紫微", "左輔", "武曲"], // 壬
  ["破軍", "巨門", "太陰", "貪狼"], // 癸
];
const SIHUA_TYPES: SiHuaType[] = ["祿", "權", "科", "忌"];

/**
 * 依五行局與農曆日安紫微星。
 * 商 = ceil(日/局數)，借數 b = 局數×商 − 日；由寅起前進(商−1)格，b 為偶則再順行 b 格、奇則逆行 b 格。
 */
export function ziweiPosition(ju: number, day: number): number {
  const q = Math.ceil(day / ju);
  const b = q * ju - day;
  const offset = b % 2 === 0 ? b : -b;
  return ((2 + (q - 1) + offset) % 12 + 12) % 12;
}

export function computeZiwei(input: ZiweiInput): ZiweiResult {
  const { y, m, d, hour } = input;
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new Error("紫微斗數需要出生時辰（0-23 時）。");
  }

  const lunar = solarToLunar(y, m, d);
  if (!lunar) throw new Error("超出可換算的日期範圍（約 1900–2050 年），無法排盤。");

  /* 閏月常見處理：前半視同本月、十六日起視同下月 */
  let month = lunar.month;
  if (lunar.isLeap && lunar.day > 15) month = (month % 12) + 1;

  const hz = hourToZhi(hour); // 時支索引

  /* ── 命宮 / 身宮：寅起正月順數生月；由生月宮起子時，逆（命）順（身）數生時 ── */
  const monthPalace = (2 + month - 1) % 12;
  const mingZhi = ((monthPalace - hz) % 12 + 12) % 12;
  const shenZhi = (monthPalace + hz) % 12;

  /* ── 生年干支（依農曆年） ── */
  const yGan = ((lunar.year - 4) % 10 + 10) % 10;
  const yZhi = ((lunar.year - 4) % 12 + 12) % 12;

  /* ── 宮干：五虎遁（年干定寅宮干，順布十二宮） ── */
  const yinGan = ((yGan % 5) * 2 + 2) % 10;
  const ganOfZhi = (z: number) => (yinGan + ((z - 2 + 12) % 12)) % 10;

  /* ── 五行局：命宮干支納音 ── */
  const mingGan = ganOfZhi(mingZhi);
  const nayin = NAYIN_WUXING[Math.floor(jiaziIndex(mingGan, mingZhi) / 2)];
  const ju = JU_NUM[nayin];
  const wuxingJu = `${nayin}${JU_CN[ju]}局`;

  /* ── 安星 ── */
  const mainByZhi: string[][] = Array.from({ length: 12 }, () => []);
  const subByZhi: string[][] = Array.from({ length: 12 }, () => []);
  const put = (arr: string[][], zhi: number, star: string) => arr[((zhi % 12) + 12) % 12].push(star);

  const ziwei = ziweiPosition(ju, lunar.day);
  for (const [star, off] of ZIWEI_SERIES) put(mainByZhi, ziwei + off + 24, star);

  const tianfu = ((4 - ziwei) % 12 + 12) % 12; // 與紫微對稱於寅申軸
  for (const [star, off] of TIANFU_SERIES) put(mainByZhi, tianfu + off, star);

  /* 輔星 */
  put(subByZhi, 4 + month - 1, "左輔");          // 辰起正月順數生月
  put(subByZhi, 10 - (month - 1) + 24, "右弼");  // 戌起正月逆數生月
  put(subByZhi, 10 - hz + 24, "文昌");           // 戌起子時逆數生時
  put(subByZhi, 4 + hz, "文曲");                 // 辰起子時順數生時
  const lucun = LUCUN_BY_GAN[yGan];
  put(subByZhi, lucun, "祿存");
  put(subByZhi, lucun + 1, "擎羊");
  put(subByZhi, lucun - 1 + 12, "陀羅");
  put(subByZhi, KUI_BY_GAN[yGan], "天魁");
  put(subByZhi, YUE_BY_GAN[yGan], "天鉞");
  put(subByZhi, 11 - hz + 12, "地空");           // 亥起子時逆數生時
  put(subByZhi, 11 + hz, "地劫");                // 亥起子時順數生時
  const [fireStart, bellStart] = fireBellStart(yZhi);
  put(subByZhi, fireStart + hz, "火星");
  put(subByZhi, bellStart + hz, "鈴星");

  /* ── 生年四化：找出四化星所在宮位 ── */
  const sihuaByZhi: { star: string; type: SiHuaType }[][] = Array.from({ length: 12 }, () => []);
  SIHUA_BY_GAN[yGan].forEach((star, i) => {
    for (let z = 0; z < 12; z++) {
      if (mainByZhi[z].includes(star) || subByZhi[z].includes(star)) {
        sihuaByZhi[z].push({ star, type: SIHUA_TYPES[i] });
        return;
      }
    }
  });

  /* ── 組十二宮（命宮起逆行安宮名） ── */
  const palaces: ZiweiPalace[] = PALACE_NAMES.map((name, i) => {
    const z = ((mingZhi - i) % 12 + 12) % 12;
    return {
      name,
      zhi: DIZHI[z],
      zhiIndex: z,
      gan: TIANGAN[ganOfZhi(z)],
      mainStars: mainByZhi[z],
      subStars: subByZhi[z],
      sihua: sihuaByZhi[z],
      isShenGong: z === shenZhi,
    };
  });

  return {
    palaces,
    mingGongZhi: DIZHI[mingZhi],
    shenGongZhi: DIZHI[shenZhi],
    wuxingJu,
    lunar,
    yearGanZhiName: TIANGAN[yGan] + DIZHI[yZhi],
    input,
  };
}
