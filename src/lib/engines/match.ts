/**
 * 愛情配對計算引擎：姓名、生日、星座、生肖四種配對。
 * 皆為確定性計算（相同輸入必得相同結果），文案由 match-copy 依分數帶選取。
 * 娛樂與自我探索定位，不作任何保證式論斷。
 */

import { computeName, wuxingRelation } from "@/lib/engines/name";
import { getSign, getAnimal } from "@/lib/engines/horoscope-data";
import { hashString, seededRng } from "@/lib/random";
import { getMatchCopy, type MatchType } from "@/lib/engines/match-copy";

export interface MatchResult {
  score: number;
  mode: string;
  strengths: string[];
  cautions: string[];
  tip: string;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

/** hash 微調：回傳 -range..+range 的確定性整數 */
function jitter(seed: string, range: number): number {
  const span = range * 2 + 1;
  return (hashString(seed) % span) - range;
}

/** 由分數 + 型別 + 種子組出完整結果 */
function assemble(type: MatchType, score: number, seed: string): MatchResult {
  const rng = seededRng(`${type}|${seed}`);
  const copy = getMatchCopy(rng, type, score);
  return {
    score,
    mode: copy.mode,
    strengths: [...copy.strengths],
    cautions: [...copy.cautions],
    tip: copy.tip,
  };
}

/* ── 姓名配對：雙方人格五行相生剋 ───────────────────────── */

export function matchName(nameA: string, nameB: string): MatchResult {
  const wa = computeName(nameA).grids.人格.wuxing;
  const wb = computeName(nameB).grids.人格.wuxing;
  const rel = wuxingRelation(wa, wb);

  let base: number;
  if (rel === "生") base = 84;
  else if (rel === "同") base = 74;
  else base = 56;

  const score = clamp(base + jitter(`${nameA}♥${nameB}`, 8), 30, 96);
  return assemble("name", score, `${nameA}♥${nameB}`);
}

/* ── 生日配對：生命靈數 9×9 相容矩陣 ───────────────────────── */

function reduceToDigit(n: number): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9) {
    let s = 0;
    while (x > 0) {
      s += x % 10;
      x = Math.floor(x / 10);
    }
    x = s;
  }
  return x === 0 ? 9 : x;
}

function lifePath(y: number, m: number, d: number): number {
  const str = `${y}${m}${d}`;
  let total = 0;
  for (const ch of str) total += Number(ch);
  return reduceToDigit(total);
}

/**
 * 生命靈數相容矩陣（1-9，對稱）。數值為基礎分數。
 * 依數字學常見的相處傾向自建：相近／互補的組合較高，張力大的較低。
 */
const NUM_MATRIX: number[][] = [
  //        1   2   3   4   5   6   7   8   9
  /* 1 */[78, 82, 80, 62, 74, 66, 60, 70, 72],
  /* 2 */[82, 76, 74, 84, 64, 88, 70, 72, 80],
  /* 3 */[80, 74, 78, 58, 86, 82, 62, 60, 84],
  /* 4 */[62, 84, 58, 74, 60, 80, 82, 78, 56],
  /* 5 */[74, 64, 86, 60, 72, 66, 84, 70, 62],
  /* 6 */[66, 88, 82, 80, 66, 80, 72, 78, 90],
  /* 7 */[60, 70, 62, 82, 84, 72, 76, 64, 74],
  /* 8 */[70, 72, 60, 78, 70, 78, 64, 80, 68],
  /* 9 */[72, 80, 84, 56, 62, 90, 74, 68, 82],
];

export function matchBirthday(
  a: { y: number; m: number; d: number },
  b: { y: number; m: number; d: number }
): MatchResult {
  const na = lifePath(a.y, a.m, a.d);
  const nb = lifePath(b.y, b.m, b.d);
  const base = NUM_MATRIX[na - 1][nb - 1];
  const seed = `${a.y}-${a.m}-${a.d}♥${b.y}-${b.m}-${b.d}`;
  const score = clamp(base + jitter(seed, 5), 30, 96);
  return assemble("birthday", score, seed);
}

/* ── 星座配對：元素 + 模式 ───────────────────────── */

const COMPLEMENTARY: [string, string][] = [
  ["fire", "air"],
  ["earth", "water"],
];

function isComplementary(a: string, b: string): boolean {
  return COMPLEMENTARY.some(
    ([x, y]) => (a === x && b === y) || (a === y && b === x)
  );
}

export function matchZodiac(slugA: string, slugB: string): MatchResult {
  const sa = getSign(slugA);
  const sb = getSign(slugB);
  const seed = `${slugA}♥${slugB}`;
  if (!sa || !sb) return assemble("zodiac", 60, seed);

  const sameElement = sa.element === sb.element;
  let base: number;
  if (sameElement) base = 86;
  else if (isComplementary(sa.element, sb.element)) base = 80;
  else base = 60;

  // 模式修正：同模式易較勁 (-4)，不同模式較互補 (+3)
  const modeAdj = sa.mode === sb.mode ? -4 : 3;
  let score = base + modeAdj + jitter(seed, 4);

  // 保底：同元素 80+、互補元素 75+
  if (sameElement) score = Math.max(score, 80);
  else if (isComplementary(sa.element, sb.element)) score = Math.max(score, 75);

  return assemble("zodiac", clamp(score, 40, 96), seed);
}

/* ── 生肖配對：六合、三合、相沖 ───────────────────────── */

const TRIADS: string[][] = [
  ["monkey", "rat", "dragon"], // 申子辰
  ["tiger", "horse", "dog"], // 寅午戌
  ["snake", "rooster", "ox"], // 巳酉丑
  ["pig", "rabbit", "goat"], // 亥卯未
];

function sameTriad(a: string, b: string): boolean {
  return TRIADS.some((t) => t.includes(a) && t.includes(b));
}

export function matchAnimal(slugA: string, slugB: string): MatchResult {
  const aa = getAnimal(slugA);
  const ab = getAnimal(slugB);
  const seed = `${slugA}♥${slugB}`;
  if (!aa || !ab) return assemble("animal", 60, seed);

  let score: number;
  const j = jitter(seed, 4);

  if (aa.bestMatch === slugB || ab.bestMatch === slugA) {
    // 六合
    score = clamp(92 + (j % 4), 90, 97);
  } else if (aa.conflict === slugB || ab.conflict === slugA) {
    // 相沖
    score = clamp(42 + j, 35, 50);
  } else if (sameTriad(slugA, slugB)) {
    // 三合
    score = clamp(86 + (j % 5), 83, 93);
  } else {
    // 其他
    score = clamp(70 + j, 60, 80);
  }

  return assemble("animal", score, seed);
}
