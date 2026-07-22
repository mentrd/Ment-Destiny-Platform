/**
 * 姓名學計算引擎：五格三才 + 81 數理 + 新生兒命名建議
 * 定位為娛樂、文化與自我探索用途，不作任何保證式論斷。
 *
 * 五格規則：
 *  - 天格：單姓 = 姓筆畫 + 1；複姓 = 兩字筆畫和
 *  - 人格：姓氏末字 + 名首字
 *  - 地格：名字筆畫和（單名 = 名字 + 1）
 *  - 外格：總格 - 人格 + 1（單姓單名固定為 2）
 *  - 總格：全部筆畫和
 * 五行取筆畫尾數：1,2 木／3,4 火／5,6 土／7,8 金／9,0 水
 */

import {
  STROKES,
  FALLBACK_STROKES,
  COMPOUND_SURNAMES,
  NAME_POOL,
  num81Of,
  type Num81Level,
} from "@/lib/engines/name-data";
import { seededRng, pickN, shuffle } from "@/lib/random";

export type Wuxing = "木" | "火" | "土" | "金" | "水";

export interface Grid {
  value: number;
  wuxing: Wuxing;
  level: Num81Level;
  note: string;
}

export interface Sancai {
  combo: string;
  level: Num81Level;
  comment: string;
}

export interface NameResult {
  surname: string;
  given: string;
  grids: {
    天格: Grid;
    人格: Grid;
    地格: Grid;
    外格: Grid;
    總格: Grid;
  };
  sancai: Sancai;
  /** 未收錄、以估算筆畫計算的字 */
  missingChars: string[];
}

/* ── 五行工具 ───────────────────────── */

/** 相生：木生火、火生土、土生金、金生水、水生木 */
const SHENG: Record<Wuxing, Wuxing> = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };

/** 由筆畫尾數判五行 */
export function wuxingOf(value: number): Wuxing {
  const d = ((value % 10) + 10) % 10;
  if (d === 1 || d === 2) return "木";
  if (d === 3 || d === 4) return "火";
  if (d === 5 || d === 6) return "土";
  if (d === 7 || d === 8) return "金";
  return "水"; // 9, 0
}

/** 兩五行的關係：相同 / 相生 / 相剋 */
export function wuxingRelation(a: Wuxing, b: Wuxing): "同" | "生" | "剋" {
  if (a === b) return "同";
  if (SHENG[a] === b || SHENG[b] === a) return "生";
  return "剋";
}

/* ── 筆畫與姓名切分 ───────────────────────── */

function strokeOf(ch: string): { n: number; missing: boolean } {
  const n = STROKES[ch];
  if (n === undefined) return { n: FALLBACK_STROKES, missing: true };
  return { n, missing: false };
}

/** 切分姓與名（優先比對複姓表） */
export function splitName(name: string): { surname: string; given: string } {
  const chars = [...name];
  if (chars.length >= 3 && COMPOUND_SURNAMES.includes(chars.slice(0, 2).join(""))) {
    return { surname: chars.slice(0, 2).join(""), given: chars.slice(2).join("") };
  }
  return { surname: chars[0] ?? "", given: chars.slice(1).join("") };
}

function grid(value: number): Grid {
  const e = num81Of(value);
  return { value, wuxing: wuxingOf(value), level: e.level, note: e.note };
}

/* ── 三才 ───────────────────────── */

function sancaiOf(tian: Wuxing, ren: Wuxing, di: Wuxing): Sancai {
  const r1 = wuxingRelation(tian, ren);
  const r2 = wuxingRelation(ren, di);
  const keCount = [r1, r2].filter((r) => r === "剋").length;
  const shengCount = [r1, r2].filter((r) => r === "生").length;

  let level: Num81Level;
  let comment: string;
  const flow = `${tian}→${ren}→${di}`;

  if (keCount === 0 && shengCount > 0) {
    level = "吉";
    comment = `三才配置 ${flow} 五行相生流暢，天、人、地之氣層層相扶，根基穩固、發展較為順遂，行事上也較容易遇到願意拉你一把的貴人。`;
  } else if (keCount === 0) {
    level = "半吉";
    comment = `三才配置 ${flow} 五行同氣，個性與行事風格鮮明一致，穩定踏實但略缺變化，多接納不同的聲音，會讓路走得更寬。`;
  } else if (keCount === 1) {
    level = "半吉";
    comment = `三才配置 ${flow} 一生一剋，順與逆交錯，過程可能起伏，只要穩住節奏、以長補短，仍能漸入佳境、把波折化為經驗。`;
  } else {
    level = "凶";
    comment = `三才配置 ${flow} 五行彼此相剋，內在拉扯較明顯，做事偶感阻力；放緩步調、多留意身心平衡，把壓力轉成砥礪自己的力量。`;
  }
  return { combo: `${tian}${ren}${di}`, level, comment };
}

/* ── 主計算 ───────────────────────── */

export function computeName(name: string): NameResult {
  const clean = [...name.trim()].filter((c) => c.trim().length > 0).join("");
  const { surname, given } = splitName(clean);
  const surChars = [...surname];
  const givChars = [...given];

  const missing = new Set<string>();
  const sVals = surChars.map((c) => {
    const r = strokeOf(c);
    if (r.missing) missing.add(c);
    return r.n;
  });
  const gVals = givChars.map((c) => {
    const r = strokeOf(c);
    if (r.missing) missing.add(c);
    return r.n;
  });

  const s = sVals.length; // 1 或 2
  const g = gVals.length;

  const sSum = sVals.reduce((a, b) => a + b, 0);
  const gSum = gVals.reduce((a, b) => a + b, 0);
  const sLast = sVals[s - 1] ?? 0;
  const gFirst = gVals[0] ?? 0;

  const 天 = s >= 2 ? sSum : sSum + 1;
  const 人 = sLast + gFirst;
  const 地 = g >= 2 ? gSum : gSum + 1;
  const 總 = sSum + gSum;
  let 外 = 總 - 人 + 1;
  if (s === 1 && g === 1) 外 = 2;

  const grids = {
    天格: grid(天),
    人格: grid(人),
    地格: grid(地),
    外格: grid(外),
    總格: grid(總),
  };

  const sancai = sancaiOf(grids.天格.wuxing, grids.人格.wuxing, grids.地格.wuxing);

  return {
    surname,
    given,
    grids,
    sancai,
    missingChars: [...missing],
  };
}

/* ── 新生兒命名建議 ───────────────────────── */

export interface NameCombo {
  /** 名兩字目標筆畫 */
  strokes: [number, number];
  ren: number;
  di: number;
  zong: number;
  /** 名首字候選 */
  firstChars: string[];
  /** 名次字候選 */
  secondChars: string[];
}

/** 依筆畫反查候選字（限命名字庫，依性別） */
function buildPool(gender: "male" | "female"): Map<number, string[]> {
  const map = new Map<number, string[]>();
  const seen = new Set<string>();
  for (const ch of NAME_POOL[gender]) {
    if (seen.has(ch)) continue;
    seen.add(ch);
    const n = STROKES[ch];
    if (n === undefined) continue;
    const arr = map.get(n) ?? [];
    arr.push(ch);
    map.set(n, arr);
  }
  return map;
}

/**
 * 產生 3 組吉利筆畫組合（人格、地格、總格皆為吉），
 * 每組配 4-6 個依性別與筆畫反查的候選字。
 */
export function suggestName(surname: string, gender: "male" | "female"): NameCombo[] {
  const surChars = [...surname.trim()];
  const sVals = surChars.map((c) => strokeOf(c).n);
  const sSum = sVals.reduce((a, b) => a + b, 0);
  const sLast = sVals[sVals.length - 1] ?? 0;

  const pool = buildPool(gender);
  const strokesWithEnough = [...pool.entries()]
    .filter(([, chars]) => chars.length >= 3)
    .map(([n]) => n);

  const valid: NameCombo[] = [];
  for (const a of strokesWithEnough) {
    for (const b of strokesWithEnough) {
      const ren = sLast + a;
      const di = a + b;
      const zong = sSum + a + b;
      if (num81Of(ren).level !== "吉") continue;
      if (num81Of(di).level !== "吉") continue;
      if (num81Of(zong).level !== "吉") continue;
      valid.push({
        strokes: [a, b],
        ren,
        di,
        zong,
        firstChars: [],
        secondChars: [],
      });
    }
  }

  // 以姓氏為種子挑 3 組，盡量讓首字筆畫不同以增變化
  const rng = seededRng(`${surname}|${gender}`);
  const shuffled = shuffle(rng, valid);
  const chosen: NameCombo[] = [];
  const usedFirst = new Set<number>();
  for (const c of shuffled) {
    if (chosen.length >= 3) break;
    if (usedFirst.has(c.strokes[0])) continue;
    usedFirst.add(c.strokes[0]);
    chosen.push(c);
  }
  // 不足 3 組時補足
  for (const c of shuffled) {
    if (chosen.length >= 3) break;
    if (chosen.includes(c)) continue;
    chosen.push(c);
  }

  return chosen.map((c) => {
    const [a, b] = c.strokes;
    const rngA = seededRng(`${surname}|${gender}|${a}|first`);
    const rngB = seededRng(`${surname}|${gender}|${b}|second`);
    return {
      ...c,
      firstChars: pickN(rngA, pool.get(a) ?? [], 6),
      secondChars: pickN(rngB, pool.get(b) ?? [], 6),
    };
  });
}
