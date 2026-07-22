/** 12 星座與 12 生肖基礎資料（全站共用契約） */

export interface ZodiacSign {
  slug: string;
  name: string;
  emoji: string;
  dateRange: string; // 顯示用
  element: "fire" | "earth" | "air" | "water";
  mode: "cardinal" | "fixed" | "mutable";
  ruler: string;
  /** [月, 日] 起訖（含） */
  start: [number, number];
  end: [number, number];
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { slug: "aries", name: "牡羊座", emoji: "♈", dateRange: "3/21 - 4/19", element: "fire", mode: "cardinal", ruler: "火星", start: [3, 21], end: [4, 19] },
  { slug: "taurus", name: "金牛座", emoji: "♉", dateRange: "4/20 - 5/20", element: "earth", mode: "fixed", ruler: "金星", start: [4, 20], end: [5, 20] },
  { slug: "gemini", name: "雙子座", emoji: "♊", dateRange: "5/21 - 6/21", element: "air", mode: "mutable", ruler: "水星", start: [5, 21], end: [6, 21] },
  { slug: "cancer", name: "巨蟹座", emoji: "♋", dateRange: "6/22 - 7/22", element: "water", mode: "cardinal", ruler: "月亮", start: [6, 22], end: [7, 22] },
  { slug: "leo", name: "獅子座", emoji: "♌", dateRange: "7/23 - 8/22", element: "fire", mode: "fixed", ruler: "太陽", start: [7, 23], end: [8, 22] },
  { slug: "virgo", name: "處女座", emoji: "♍", dateRange: "8/23 - 9/22", element: "earth", mode: "mutable", ruler: "水星", start: [8, 23], end: [9, 22] },
  { slug: "libra", name: "天秤座", emoji: "♎", dateRange: "9/23 - 10/23", element: "air", mode: "cardinal", ruler: "金星", start: [9, 23], end: [10, 23] },
  { slug: "scorpio", name: "天蠍座", emoji: "♏", dateRange: "10/24 - 11/22", element: "water", mode: "fixed", ruler: "冥王星", start: [10, 24], end: [11, 22] },
  { slug: "sagittarius", name: "射手座", emoji: "♐", dateRange: "11/23 - 12/21", element: "fire", mode: "mutable", ruler: "木星", start: [11, 23], end: [12, 21] },
  { slug: "capricorn", name: "摩羯座", emoji: "♑", dateRange: "12/22 - 1/19", element: "earth", mode: "cardinal", ruler: "土星", start: [12, 22], end: [1, 19] },
  { slug: "aquarius", name: "水瓶座", emoji: "♒", dateRange: "1/20 - 2/18", element: "air", mode: "fixed", ruler: "天王星", start: [1, 20], end: [2, 18] },
  { slug: "pisces", name: "雙魚座", emoji: "♓", dateRange: "2/19 - 3/20", element: "water", mode: "mutable", ruler: "海王星", start: [2, 19], end: [3, 20] },
];

export function getSign(slug: string): ZodiacSign | undefined {
  return ZODIAC_SIGNS.find((s) => s.slug === slug);
}

/** 由西曆月日判斷星座 */
export function signFromDate(month: number, day: number): ZodiacSign {
  for (const s of ZODIAC_SIGNS) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) return s;
    } else {
      // 跨年（摩羯）
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return s;
    }
  }
  return ZODIAC_SIGNS[9]; // capricorn fallback
}

export interface ChineseZodiac {
  slug: string;
  name: string;
  emoji: string;
  /** 地支 */
  branch: string;
  /** 六合生肖 slug */
  bestMatch: string;
  /** 相沖生肖 slug */
  conflict: string;
}

export const CHINESE_ZODIAC: ChineseZodiac[] = [
  { slug: "rat", name: "鼠", emoji: "🐭", branch: "子", bestMatch: "ox", conflict: "horse" },
  { slug: "ox", name: "牛", emoji: "🐮", branch: "丑", bestMatch: "rat", conflict: "goat" },
  { slug: "tiger", name: "虎", emoji: "🐯", branch: "寅", bestMatch: "pig", conflict: "monkey" },
  { slug: "rabbit", name: "兔", emoji: "🐰", branch: "卯", bestMatch: "dog", conflict: "rooster" },
  { slug: "dragon", name: "龍", emoji: "🐲", branch: "辰", bestMatch: "rooster", conflict: "dog" },
  { slug: "snake", name: "蛇", emoji: "🐍", branch: "巳", bestMatch: "monkey", conflict: "pig" },
  { slug: "horse", name: "馬", emoji: "🐴", branch: "午", bestMatch: "goat", conflict: "rat" },
  { slug: "goat", name: "羊", emoji: "🐑", branch: "未", bestMatch: "horse", conflict: "ox" },
  { slug: "monkey", name: "猴", emoji: "🐵", branch: "申", bestMatch: "snake", conflict: "tiger" },
  { slug: "rooster", name: "雞", emoji: "🐔", branch: "酉", bestMatch: "dragon", conflict: "rabbit" },
  { slug: "dog", name: "狗", emoji: "🐶", branch: "戌", bestMatch: "rabbit", conflict: "dragon" },
  { slug: "pig", name: "豬", emoji: "🐷", branch: "亥", bestMatch: "tiger", conflict: "snake" },
];

export function getAnimal(slug: string): ChineseZodiac | undefined {
  return CHINESE_ZODIAC.find((a) => a.slug === slug);
}

/** 由西曆年份粗算生肖（未考慮立春分界，運勢頁用；八字引擎另以立春精算） */
export function animalFromYear(year: number): ChineseZodiac {
  return CHINESE_ZODIAC[(((year - 4) % 12) + 12) % 12];
}
