/**
 * 星座生肖運勢引擎（純函式、確定性：同輸入必得同輸出）
 * 種子規則：
 * - 每日星座：`${dateStr}|daily|${signSlug}`
 * - 每週星座：`${weekKey}|weekly|${signSlug}`（weekKey 如 2026-W30，台北時區週一起算）
 * - 每月星座：`${ymKey}|monthly|${signSlug}`（ymKey 如 2026-07）
 * - 每日生肖：`${dateStr}|animal|${animalSlug}`
 */

import {
  ZODIAC_SIGNS,
  getSign,
  getAnimal,
  type ZodiacSign,
  type ChineseZodiac,
} from "@/lib/engines/horoscope-data";
import type {
  FortuneLevel,
  HoroscopeCopy,
  LuckyColor,
  PeriodCopy,
} from "@/lib/engines/horoscope-copy";
import { hashString, pick, pickN, randInt, seededRng } from "@/lib/random";

/* ── 共用型別 ── */

export type FortuneCategoryKey = "overall" | "love" | "career" | "money" | "health";

export const FORTUNE_CATEGORIES: { key: FortuneCategoryKey; label: string }[] = [
  { key: "overall", label: "綜合運勢" },
  { key: "love", label: "愛情運勢" },
  { key: "career", label: "事業運勢" },
  { key: "money", label: "財運" },
  { key: "health", label: "健康運勢" },
];

export interface FortuneAspect {
  key: FortuneCategoryKey;
  label: string;
  level: FortuneLevel;
  text: string;
}

export interface DailyFortune {
  sign: ZodiacSign;
  date: string; // YYYY-MM-DD
  aspects: FortuneAspect[];
  luckyColor: LuckyColor;
  luckyNumber: number; // 1-99
  luckyDirection: string;
  /** 今日速配星座（必為他星座） */
  matchSign: ZodiacSign;
  goodTip: string;
  badTip: string;
}

export interface PeriodFortune {
  sign: ZodiacSign;
  periodKey: string; // 2026-W30 或 2026-07
  aspects: { key: FortuneCategoryKey; label: string; level: FortuneLevel }[];
  /** 2-3 段綜合短文（第一段必為整體運勢） */
  paragraphs: string[];
  luckyColor: LuckyColor;
  luckyNumber: number;
}

export interface AnimalFortune {
  animal: ChineseZodiac;
  date: string;
  aspects: FortuneAspect[];
  luckyColor: LuckyColor;
  luckyNumber: number;
  luckyDirection: string;
  /** 六合速配生肖 */
  bestMatch: ChineseZodiac;
  /** 相沖生肖與輕鬆版沖煞提醒 */
  conflictAnimal: ChineseZodiac;
  conflictNote: string;
  goodTip: string;
  badTip: string;
}

/* ── 內部工具 ── */

/** 指數加權：3/4 星最常見（1:2:4:4:2） */
const LEVEL_WEIGHTS: [FortuneLevel, number][] = [
  [1, 1],
  [2, 2],
  [3, 4],
  [4, 4],
  [5, 2],
];
const WEIGHT_TOTAL = LEVEL_WEIGHTS.reduce((sum, [, w]) => sum + w, 0);

function rollLevel(rng: () => number): FortuneLevel {
  let r = rng() * WEIGHT_TOTAL;
  for (const [level, w] of LEVEL_WEIGHTS) {
    r -= w;
    if (r < 0) return level;
  }
  return 3;
}

function buildAspects(rng: () => number, copy: HoroscopeCopy): FortuneAspect[] {
  return FORTUNE_CATEGORIES.map(({ key, label }) => {
    const level = rollLevel(rng);
    const pool = copy[key][level];
    return { key, label, level, text: pool.length > 0 ? pick(rng, pool) : "" };
  });
}

/** 沖煞提醒模板（輕鬆措辭，娛樂定位） */
const CONFLICT_NOTES: ((name: string) => string)[] = [
  (n) =>
    `今日與屬${n}的朋友頻率稍微對不上，聊天話題輕鬆一點，意見不同就笑笑帶過，別放在心上。`,
  (n) =>
    `今天遇到屬${n}的人，互動節奏可能有點卡卡的，多一分耐心、少一分堅持，就能相安無事。`,
  (n) =>
    `與屬${n}的夥伴共事或討論時，先聽完再回應，重要約定用文字確認一次，小磨擦自然繞道走。`,
  (n) =>
    `今日和屬${n}的人相處建議以和為貴，玩笑話點到為止，把計較的力氣拿去吃頓好料更實在。`,
  (n) =>
    `跟屬${n}的親友往來今天放輕鬆就好，不急著爭對錯，一杯飲料的距離剛剛好。`,
];

/* ── 每日星座運勢 ── */

export function getDailyFortune(signSlug: string, dateStr: string, copy: HoroscopeCopy): DailyFortune {
  const sign = getSign(signSlug);
  if (!sign) throw new Error(`未知的星座 slug：${signSlug}`);

  const rng = seededRng(hashString(`${dateStr}|daily|${signSlug}`));
  const aspects = buildAspects(rng, copy);
  const luckyColor = pick(rng, copy.colors);
  const luckyNumber = randInt(rng, 1, 99);
  const luckyDirection = pick(rng, copy.directions);
  const matchSign = pick(rng, ZODIAC_SIGNS.filter((s) => s.slug !== sign.slug));
  const [goodTip, badTip] = pickN(rng, copy.tips, 2);

  return { sign, date: dateStr, aspects, luckyColor, luckyNumber, luckyDirection, matchSign, goodTip, badTip };
}

/* ── 週運 / 月運 ── */

function buildPeriodFortune(
  sign: ZodiacSign,
  seedKey: string,
  periodKey: string,
  copy: HoroscopeCopy,
  periodCopy: PeriodCopy
): PeriodFortune {
  const rng = seededRng(hashString(seedKey));
  const aspects = FORTUNE_CATEGORIES.map(({ key, label }) => ({ key, label, level: rollLevel(rng) }));

  // 2-3 段綜合短文：整體必有，再從其餘四類抽 1-2 類
  const paragraphs = [pick(rng, periodCopy.overall)];
  const extraKeys = pickN(
    rng,
    ["love", "career", "money", "health"] as const,
    randInt(rng, 1, 2)
  );
  for (const key of extraKeys) paragraphs.push(pick(rng, periodCopy[key]));

  const luckyColor = pick(rng, copy.colors);
  const luckyNumber = randInt(rng, 1, 99);
  return { sign, periodKey, aspects, paragraphs, luckyColor, luckyNumber };
}

export function getWeeklyFortune(
  signSlug: string,
  weekKey: string,
  copy: HoroscopeCopy,
  periodCopy: PeriodCopy
): PeriodFortune {
  const sign = getSign(signSlug);
  if (!sign) throw new Error(`未知的星座 slug：${signSlug}`);
  return buildPeriodFortune(sign, `${weekKey}|weekly|${signSlug}`, weekKey, copy, periodCopy);
}

export function getMonthlyFortune(
  signSlug: string,
  ymKey: string,
  copy: HoroscopeCopy,
  periodCopy: PeriodCopy
): PeriodFortune {
  const sign = getSign(signSlug);
  if (!sign) throw new Error(`未知的星座 slug：${signSlug}`);
  return buildPeriodFortune(sign, `${ymKey}|monthly|${signSlug}`, ymKey, copy, periodCopy);
}

/* ── 每日生肖運勢 ── */

export function getAnimalFortune(animalSlug: string, dateStr: string, copy: HoroscopeCopy): AnimalFortune {
  const animal = getAnimal(animalSlug);
  if (!animal) throw new Error(`未知的生肖 slug：${animalSlug}`);

  const rng = seededRng(hashString(`${dateStr}|animal|${animalSlug}`));
  const aspects = buildAspects(rng, copy);
  const luckyColor = pick(rng, copy.colors);
  const luckyNumber = randInt(rng, 1, 99);
  const luckyDirection = pick(rng, copy.directions);
  const [goodTip, badTip] = pickN(rng, copy.tips, 2);

  const bestMatch = getAnimal(animal.bestMatch)!;
  const conflictAnimal = getAnimal(animal.conflict)!;
  const conflictNote = pick(rng, CONFLICT_NOTES)(conflictAnimal.name);

  return {
    animal,
    date: dateStr,
    aspects,
    luckyColor,
    luckyNumber,
    luckyDirection,
    bestMatch,
    conflictAnimal,
    conflictNote,
    goodTip,
    badTip,
  };
}

/* ── 台北時區日期 / 週 / 月 key 工具 ── */

/** 今天（Asia/Taipei）的 YYYY-MM-DD */
export function taipeiTodayStr(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Asia/Taipei" });
}

/** 由 YYYY-MM-DD 取得 ISO 週 key（週一起算），如 2026-W30 */
export function weekKeyOf(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  // 移到本週四（ISO 週歸屬以週四所在年份為準）
  const dayNum = (date.getUTCDay() + 6) % 7; // 週一=0
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const isoYear = date.getUTCFullYear();
  const jan4 = new Date(Date.UTC(isoYear, 0, 4));
  const week =
    1 +
    Math.round(
      ((date.getTime() - jan4.getTime()) / 86400000 - 3 + ((jan4.getUTCDay() + 6) % 7)) / 7
    );
  return `${isoYear}-W${String(week).padStart(2, "0")}`;
}

/** 由 YYYY-MM-DD 取得該週（週一至週日）的起訖日期字串 */
export function weekRangeOf(dateStr: string): { start: string; end: string } {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const dayNum = (date.getUTCDay() + 6) % 7;
  const monday = new Date(date);
  monday.setUTCDate(date.getUTCDate() - dayNum);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const fmt = (dt: Date) => `${dt.getUTCMonth() + 1}/${dt.getUTCDate()}`;
  return { start: fmt(monday), end: fmt(sunday) };
}

/** 由 YYYY-MM-DD 取得月 key，如 2026-07 */
export function monthKeyOf(dateStr: string): string {
  return dateStr.slice(0, 7);
}

/** YYYY-MM-DD → 「2026年7月19日 星期日」（顯示用，與時區無關） */
export function formatDateZh(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("zh-TW", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

/** YYYY-MM-DD → 「7/19」（標題用） */
export function formatMonthDay(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${m}/${d}`;
}
