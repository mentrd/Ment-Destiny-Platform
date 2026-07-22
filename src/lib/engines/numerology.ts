/**
 * 生命靈數計算引擎
 * - 生命靈數（Life Path）：出生年月日全部數字相加，反覆加總至個位數
 * - 大師數（Master Number）：加總過程若出現 11 / 22 / 33 則記錄
 * - 生日數（Birthday）：出生「日」約化至個位數
 * - 天賦數（Talent）：年、月、日各自約化後相加，再約化至個位數
 * - 流年數（Personal Year）：當年年份 + 生月 + 生日，約化至個位數
 * 定位為娛樂與自我探索用途。
 */

export interface NumerologyResult {
  /** 生命靈數（1-9） */
  lifePath: number;
  /** 加總過程出現的大師數（11/22/33），沒有則為 null */
  master: 11 | 22 | 33 | null;
  /** 生日數（出生日約化，1-9） */
  birthday: number;
  /** 天賦數（年月日各自約化再相加約化，1-9） */
  talent: number;
  /** 流年數（nowYear + 生月 + 生日約化，1-9） */
  personalYear: number;
  /** 出生日期（YYYYMMDD）中出現過的數字 1-9，遞增排序 */
  digitsPresent: number[];
}

/** 單一數字各位數相加 */
function digitSum(n: number): number {
  let s = 0;
  let x = Math.abs(Math.trunc(n));
  while (x > 0) {
    s += x % 10;
    x = Math.floor(x / 10);
  }
  return s;
}

/** 反覆加總至個位數（1-9） */
function reduceToDigit(n: number): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9) x = digitSum(x);
  return x;
}

const MASTER_NUMBERS = [11, 22, 33] as const;

/**
 * 計算生命靈數結果。
 * @param y 出生西元年（四位數）
 * @param m 出生月（1-12）
 * @param d 出生日（1-31）
 * @param nowYear 流年計算基準年（傳入以保持結果確定性；未傳則採當下年份）
 */
export function computeNumerology(
  y: number,
  m: number,
  d: number,
  nowYear: number = new Date().getFullYear()
): NumerologyResult {
  const dateStr = `${String(y).padStart(4, "0")}${String(m).padStart(2, "0")}${String(d).padStart(2, "0")}`;

  // 生命靈數：全部數字相加，過程中偵測大師數
  let master: 11 | 22 | 33 | null = null;
  let total = 0;
  for (const ch of dateStr) total += Number(ch);
  while (total > 9) {
    if (master === null && (MASTER_NUMBERS as readonly number[]).includes(total)) {
      master = total as 11 | 22 | 33;
    }
    total = digitSum(total);
  }
  const lifePath = total;

  // 生日數
  const birthday = reduceToDigit(d);

  // 天賦數：年、月、日各自約化再相加約化
  const talent = reduceToDigit(reduceToDigit(digitSum(y)) + reduceToDigit(m) + reduceToDigit(d));

  // 流年數：本年 + 生月 + 生日
  const personalYear = reduceToDigit(digitSum(nowYear) + reduceToDigit(m) + reduceToDigit(d));

  // 出生日期中出現過的 1-9
  const present = new Set<number>();
  for (const ch of dateStr) {
    const n = Number(ch);
    if (n >= 1 && n <= 9) present.add(n);
  }
  const digitsPresent = [...present].sort((a, b) => a - b);

  return { lifePath, master, birthday, talent, personalYear, digitsPresent };
}
