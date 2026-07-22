/**
 * 農曆 / 干支換算共用引擎（純演算法，無外部套件）
 * - 西曆 → 四柱干支（年柱以立春分界、月柱以十二節分界、日柱以基準日推算、時柱五鼠遁）
 * - 節氣時刻以太陽視黃經低精度天文公式 + 二分法求解（誤差遠小於一小時，1900-2050 適用）
 * - solarToLunar：西曆 → 農曆（1900-2050 壓縮資料表，常見公開演算法）
 */

/* ── 基礎常數 ─────────────────────────────── */

export const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"] as const;
export const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"] as const;

export type WuXing = "木" | "火" | "土" | "金" | "水";

/** 天干五行（甲乙木、丙丁火、戊己土、庚辛金、壬癸水） */
export const GAN_WUXING: WuXing[] = ["木", "木", "火", "火", "土", "土", "金", "金", "水", "水"];
/** 天干陰陽（true=陽） */
export const GAN_YANG: boolean[] = [true, false, true, false, true, false, true, false, true, false];
/** 地支五行 */
export const ZHI_WUXING: WuXing[] = ["水", "土", "木", "木", "土", "火", "火", "土", "金", "金", "土", "水"];
/** 地支陰陽（true=陽） */
export const ZHI_YANG: boolean[] = [true, false, true, false, true, false, true, false, true, false, true, false];

/** 地支藏干表（依主氣、中氣、餘氣排序，值為天干索引） */
export const ZHI_CANGGAN: number[][] = [
  [9],        // 子：癸
  [5, 9, 7],  // 丑：己癸辛
  [0, 2, 4],  // 寅：甲丙戊
  [1],        // 卯：乙
  [4, 1, 9],  // 辰：戊乙癸
  [2, 4, 6],  // 巳：丙戊庚
  [3, 5],     // 午：丁己
  [5, 3, 1],  // 未：己丁乙
  [6, 8, 4],  // 申：庚壬戊
  [7],        // 酉：辛
  [4, 7, 3],  // 戌：戊辛丁
  [8, 0],     // 亥：壬甲
];

/** 生肖（對應地支） */
export const SHENGXIAO = ["鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猴", "雞", "狗", "豬"] as const;

/** 十二時辰名（對應地支） */
export const SHICHEN_NAMES = DIZHI.map((z, i) => {
  const start = (23 + i * 2) % 24;
  return `${z}時（${String(start).padStart(2, "0")}:00-${String((start + 2) % 24).padStart(2, "0")}:00）`;
});

export interface GanZhi {
  gan: number; // 天干索引 0-9
  zhi: number; // 地支索引 0-11
}

export function ganZhiName(gz: GanZhi): string {
  return TIANGAN[gz.gan] + DIZHI[gz.zhi];
}

/** 由干支索引求六十甲子序（0=甲子…59=癸亥） */
export function jiaziIndex(gan: number, zhi: number): number {
  return (6 * gan - 5 * zhi + 60) % 60;
}

/* ── 儒略日 ───────────────────────────────── */

/** 西曆（格里曆）→ 儒略日數（中午 12:00 的整數 JDN） */
export function toJDN(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

/* ── 節氣（十二節）：太陽視黃經低精度公式 ── */

const RAD = Math.PI / 180;

/** 太陽幾何黃經（度），jd 為儒略日（含小數，TT≈UT 足夠） */
function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * RAD;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M) +
    0.000289 * Math.sin(3 * M);
  let lon = (L0 + C) % 360;
  if (lon < 0) lon += 360;
  return lon;
}

/** 十二節：索引 0-11 對應 立春/驚蟄/清明/立夏/芒種/小暑/立秋/白露/寒露/立冬/大雪/小寒 */
export const JIE_NAMES = [
  "立春", "驚蟄", "清明", "立夏", "芒種", "小暑",
  "立秋", "白露", "寒露", "立冬", "大雪", "小寒",
] as const;
/** 各節太陽黃經目標值 */
const JIE_LON = [315, 345, 15, 45, 75, 105, 135, 165, 195, 225, 255, 285];
/** 各節所在的西曆月份 */
const JIE_MONTH = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1];

/** 角度差 lon-target 正規化到 (-180,180] */
function lonDiff(lon: number, target: number): number {
  let d = (lon - target) % 360;
  if (d <= -180) d += 360;
  if (d > 180) d -= 360;
  return d;
}

/**
 * 求某年第 jieIdx 節（0=立春…11=小寒）的時刻。
 * 回傳台北時間（UTC+8）：{ y, m, d, hour }（小時含小數）。
 * 注意：小寒(11) 落在西曆隔年 1 月，此處 year 指「節氣所屬西曆年」。
 */
export function jieqiDate(year: number, jieIdx: number): { y: number; m: number; d: number; hour: number; jdn: number } {
  const month = JIE_MONTH[jieIdx];
  const target = JIE_LON[jieIdx];
  // 搜尋範圍：該月 1 日至 15 日（各節必落於 3-9 日附近）
  let lo = toJDN(year, month, 1) - 0.5; // 當日 00:00 UT
  let hi = lo + 15;
  // 二分法找 lonDiff 由負轉正的交點
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (lonDiff(sunLongitude(mid), target) < 0) lo = mid;
    else hi = mid;
  }
  const jdUt = (lo + hi) / 2;
  const jdLocal = jdUt + 8 / 24; // 轉台北時間
  const z = Math.floor(jdLocal + 0.5);
  const frac = jdLocal + 0.5 - z;
  const date = fromJDN(z);
  return { ...date, hour: frac * 24, jdn: z };
}

/** 儒略日數 → 西曆年月日 */
export function fromJDN(jdn: number): { y: number; m: number; d: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const dd = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * dd / 4);
  const mm = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * mm + 2) / 5) + 1;
  const month = mm + 3 - 12 * Math.floor(mm / 10);
  const year = 100 * b + dd - 4800 + Math.floor(mm / 10);
  return { y: year, m: month, d: day };
}

/* ── 四柱干支 ─────────────────────────────── */

/**
 * 日柱：以 1949-10-01（甲子日）為基準推算。
 * 驗證基準：2000-01-01 為戊午日、1900-01-01 為甲戌日。
 */
export function dayGanZhi(y: number, m: number, d: number): GanZhi {
  const base = 2433191; // JDN of 1949-10-01（甲子日）
  const idx = ((toJDN(y, m, d) - base) % 60 + 60) % 60;
  return { gan: idx % 10, zhi: idx % 12 };
}

/** 年柱：以立春為分界。回傳 { gz, year }（year 為干支所屬年份） */
export function yearGanZhi(y: number, m: number, d: number): { gz: GanZhi; year: number } {
  const lichun = jieqiDate(y, 0); // 該年立春（台北時間）
  let gy = y;
  if (m < lichun.m || (m === lichun.m && d < lichun.d)) gy = y - 1;
  return { gz: { gan: ((gy - 4) % 10 + 10) % 10, zhi: ((gy - 4) % 12 + 12) % 12 }, year: gy };
}

/**
 * 月柱：以十二節分界 + 五虎遁月。
 * 回傳 { gz, monthNum }，monthNum 1-12（1=寅月）。
 */
export function monthGanZhi(y: number, m: number, d: number): { gz: GanZhi; monthNum: number } {
  const jdn = toJDN(y, m, d);
  // 找出日期所屬的節氣月：從前一年立冬附近往後掃描各節
  // 節序（jieIdx 0-11）對應月支：立春→寅(1)…小寒→丑(12)
  let monthNum = 0;
  // 候選節：本年 12 節 + 前一年大雪/小寒（小寒屬本年1月）
  const marks: { jdn: number; num: number }[] = [];
  for (let k = 0; k < 12; k++) {
    // 小寒(11) 的月份是 1 月，屬「本西曆年」
    const jq = jieqiDate(y, k);
    marks.push({ jdn: jq.jdn, num: k + 1 }); // 立春=1(寅)…小寒=12(丑)
  }
  // 前一年大雪（11 月支子，num=11）與小寒（num=12）覆蓋年初
  const prevDaxue = jieqiDate(y - 1, 10);
  const prevXiaohan = jieqiDate(y, 11); // 小寒本就在本年 1 月
  marks.push({ jdn: prevDaxue.jdn, num: 11 });
  marks.push({ jdn: prevXiaohan.jdn, num: 12 });
  marks.sort((a, b) => a.jdn - b.jdn);
  for (const mk of marks) {
    if (jdn >= mk.jdn) monthNum = mk.num;
  }
  if (monthNum === 0) monthNum = 11; // 一月小寒前 → 前一年子月
  const zhi = (monthNum + 1) % 12; // 1(寅)→2
  const yg = yearGanZhi(y, m, d).gz.gan;
  const gan = ((yg % 5) * 2 + 2 + (monthNum - 1)) % 10; // 五虎遁
  return { gz: { gan, zhi }, monthNum };
}

/** 小時（0-23）→ 時支索引 */
export function hourToZhi(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2) % 12;
}

/** 時柱：五鼠遁時（dayGan 為日干索引，zhiIdx 為時支索引） */
export function hourGanZhi(dayGan: number, zhiIdx: number): GanZhi {
  const gan = ((dayGan % 5) * 2 + zhiIdx) % 10;
  return { gan, zhi: zhiIdx };
}

/**
 * 距出生最近的「節」：dir=1 找下一個節、dir=-1 找上一個節。
 * 回傳與出生日相距的天數（>=0）。供八字起運歲數估算。
 */
export function daysToJie(y: number, m: number, d: number, dir: 1 | -1): number {
  const jdn = toJDN(y, m, d);
  const all: number[] = [];
  for (const yy of [y - 1, y, y + 1]) {
    for (let k = 0; k < 12; k++) all.push(jieqiDate(yy, k).jdn);
  }
  all.sort((a, b) => a - b);
  if (dir === 1) {
    for (const j of all) if (j > jdn) return j - jdn;
  } else {
    for (let i = all.length - 1; i >= 0; i--) if (all[i] <= jdn) return jdn - all[i];
  }
  return 15; // 理論上不會到這
}

/* ── 農曆換算（1900-2050 資料表） ─────────── */

/**
 * 農曆年資料表（1900-2050），常見公開編碼：
 * 低 4 位：閏月月份（0 表無閏月）；
 * 第 4-15 位：該年 12 個月大小（1=30 天，0=29 天，由高位往低對應正月→臘月）；
 * 第 16 位：閏月大小（1=30 天）。
 */
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, // 1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
  0x14b63, // 2050
];

/** 農曆某年閏月月份（0 表無閏） */
export function leapMonth(y: number): number {
  return LUNAR_INFO[y - 1900] & 0xf;
}

/** 農曆某年閏月天數 */
function leapDays(y: number): number {
  if (!leapMonth(y)) return 0;
  return LUNAR_INFO[y - 1900] & 0x10000 ? 30 : 29;
}

/** 農曆某年某月（非閏）天數 */
export function lunarMonthDays(y: number, m: number): number {
  return LUNAR_INFO[y - 1900] & (0x10000 >> m) ? 30 : 29;
}

/** 農曆某年總天數 */
function lunarYearDays(y: number): number {
  let sum = 348; // 12 * 29
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    if (LUNAR_INFO[y - 1900] & i) sum += 1;
  }
  return sum + leapDays(y);
}

export interface LunarDate {
  year: number;   // 農曆年
  month: number;  // 農曆月 1-12
  day: number;    // 農曆日 1-30
  isLeap: boolean; // 是否閏月
}

const CN_MONTHS = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "臘"];
const CN_DAY_TENS = ["初", "十", "廿", "三"];
const CN_NUMS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

export function lunarDateName(ld: LunarDate): string {
  const monthName = `${ld.isLeap ? "閏" : ""}${CN_MONTHS[ld.month - 1]}月`;
  let dayName: string;
  if (ld.day === 10) dayName = "初十";
  else if (ld.day === 20) dayName = "二十";
  else if (ld.day === 30) dayName = "三十";
  else dayName = CN_DAY_TENS[Math.floor(ld.day / 10)] + CN_NUMS[(ld.day % 10) - 1];
  return `${monthName}${dayName}`;
}

/**
 * 西曆 → 農曆（適用 1900-02-01 至 2051-01 前後）。
 * 基準：1900-01-31 為農曆 1900 年正月初一。
 */
export function solarToLunar(y: number, m: number, d: number): LunarDate | null {
  let offset = toJDN(y, m, d) - toJDN(1900, 1, 31);
  if (offset < 0 || y > 2051) return null;

  let ly = 1900;
  while (ly < 2051 && offset >= lunarYearDays(ly)) {
    offset -= lunarYearDays(ly);
    ly++;
  }

  const leap = leapMonth(ly);
  let isLeap = false;
  let lm = 1;
  for (; lm <= 12; lm++) {
    const days = lunarMonthDays(ly, lm);
    if (offset < days) break;
    offset -= days;
    // 該月結束後若適逢閏月，插入閏月
    if (leap === lm) {
      const ld = leapDays(ly);
      if (offset < ld) {
        isLeap = true;
        break;
      }
      offset -= ld;
    }
  }
  return { year: ly, month: lm, day: offset + 1, isLeap };
}
