/**
 * 易經卜卦引擎：擲幣（大衍蓍草簡化的三枚銅錢法）、數字（梅花易數）、時間起卦
 * binary 約定：6 位字串，初爻（最下爻）在最左，1=陽爻、0=陰爻
 */

import { seededRng } from "@/lib/random";
import { HEXAGRAMS, type Hexagram } from "@/lib/engines/iching-data";

export interface CastResult {
  /** 六爻爻值，由初爻到上爻：6=老陰、7=少陽、8=少陰、9=老陽 */
  lineValues: number[];
  /** 本卦 */
  present: Hexagram;
  /** 動爻索引（0=初爻 … 5=上爻） */
  changingLines: number[];
  /** 變卦（無動爻時為 null） */
  transformed: Hexagram | null;
}

/** 先天八卦數 → 三爻（由下而上）：1乾 2兌 3離 4震 5巽 6坎 7艮 8坤 */
const TRIGRAM_BY_NUMBER: Record<number, string> = {
  1: "111", // 乾 ☰
  2: "110", // 兌 ☱（下爻在左）
  3: "101", // 離 ☲
  4: "100", // 震 ☳
  5: "011", // 巽 ☴
  6: "010", // 坎 ☵
  7: "001", // 艮 ☶
  8: "000", // 坤 ☷
};

const BY_BINARY = new Map<string, Hexagram>(HEXAGRAMS.map((h) => [h.binary, h]));

/** 依 binary（初爻在左）查卦 */
export function findHexagram(binary: string): Hexagram {
  const hex = BY_BINARY.get(binary);
  if (!hex) throw new Error(`找不到卦象：${binary}`);
  return hex;
}

/** 由六爻爻值組出本卦/變卦與動爻 */
function fromLineValues(lineValues: number[]): CastResult {
  const presentBinary = lineValues.map((v) => (v % 2 === 1 ? "1" : "0")).join(""); // 7/9 陽、6/8 陰
  const changingLines = lineValues
    .map((v, i) => (v === 6 || v === 9 ? i : -1))
    .filter((i) => i >= 0);
  const present = findHexagram(presentBinary);
  let transformed: Hexagram | null = null;
  if (changingLines.length > 0) {
    const bits = presentBinary.split("");
    for (const i of changingLines) bits[i] = bits[i] === "1" ? "0" : "1";
    transformed = findHexagram(bits.join(""));
  }
  return { lineValues, present, changingLines, transformed };
}

/**
 * 擲幣起卦：以種子模擬三枚銅錢 × 6 次。
 * 每枚銅錢：字面（陰）記 2、花面（陽）記 3；三枚之和 6=老陰、7=少陽、8=少陰、9=老陽。
 * 同一 seed 永遠得到相同結果，供分享連結重現。
 */
export function castByCoins(seed: number | string): CastResult {
  const rng = seededRng(seed);
  const lineValues: number[] = [];
  for (let i = 0; i < 6; i++) {
    let sum = 0;
    for (let c = 0; c < 3; c++) sum += rng() < 0.5 ? 2 : 3;
    lineValues.push(sum);
  }
  return fromLineValues(lineValues);
}

/** 將某一爻設定為動爻後回傳爻值（陽→9 老陽、陰→6 老陰；其餘為 7/8 靜爻） */
function lineValuesFromBinary(binary: string, changingIndex: number): number[] {
  return binary.split("").map((bit, i) => {
    const yang = bit === "1";
    if (i === changingIndex) return yang ? 9 : 6;
    return yang ? 7 : 8;
  });
}

/**
 * 數字起卦（梅花易數）：
 * 上卦 = n1 % 8、下卦 = n2 % 8（餘 0 作 8），動爻 = n3 % 6（餘 0 作 6）。
 * 先天八卦數：1乾 2兌 3離 4震 5巽 6坎 7艮 8坤。
 */
export function castByNumbers(n1: number, n2: number, n3: number): CastResult {
  const upperNo = n1 % 8 || 8;
  const lowerNo = n2 % 8 || 8;
  const moving = n3 % 6 || 6; // 1-6，由初爻起算
  const binary = TRIGRAM_BY_NUMBER[lowerNo] + TRIGRAM_BY_NUMBER[upperNo]; // 下卦在前三位（初爻在左）
  return fromLineValues(lineValuesFromBinary(binary, moving - 1));
}

/**
 * 時間起卦（簡化版，直接以國曆數字計）：
 * 上卦 =（年+月+日）% 8、下卦 =（年+月+日+時）% 8（餘 0 作 8），
 * 動爻 =（年+月+日+時）% 6（餘 0 作 6）。
 */
export function castByTime(y: number, m: number, d: number, h: number): CastResult {
  const upperNo = (y + m + d) % 8 || 8;
  const lowerNo = (y + m + d + h) % 8 || 8;
  const moving = (y + m + d + h) % 6 || 6;
  const binary = TRIGRAM_BY_NUMBER[lowerNo] + TRIGRAM_BY_NUMBER[upperNo];
  return fromLineValues(lineValuesFromBinary(binary, moving - 1));
}

/** 爻值中文標記（顯示用） */
export function lineValueLabel(v: number): string {
  switch (v) {
    case 6:
      return "老陰（動）";
    case 7:
      return "少陽";
    case 8:
      return "少陰";
    case 9:
      return "老陽（動）";
    default:
      return "";
  }
}

/** 爻位名稱（0=初爻 … 5=上爻） */
export const LINE_POSITION_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"] as const;
