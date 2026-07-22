export type FeatureCategory = "divination" | "chart" | "fortune" | "match";

export interface FeatureDef {
  slug: string;
  name: string;
  shortName: string;
  category: FeatureCategory;
  icon: string;
  tagline: string;
  description: string;
  color: string; // 卡片點綴色
  related: string[]; // 相關推薦 feature slugs
  startPath: string; // 開始測算的入口路徑
}

export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  divination: "占卜互動",
  chart: "命盤解析",
  fortune: "運勢趨勢",
  match: "配對與探索",
};

export const FEATURES: FeatureDef[] = [
  {
    slug: "tarot",
    name: "塔羅牌占卜",
    shortName: "塔羅",
    category: "divination",
    icon: "🃏",
    tagline: "抽一張牌，聽聽內心的聲音",
    description:
      "78 張韋特塔羅完整牌庫，提供單張、三張、愛情、事業財運、是非題與每日塔羅六種牌陣，翻牌即得個人化解讀。",
    color: "#8b7ae8",
    related: ["iching", "lots", "dream"],
    startPath: "/tarot",
  },
  {
    slug: "bazi",
    name: "八字命盤",
    shortName: "八字",
    category: "chart",
    icon: "☯️",
    tagline: "四柱八字，看見你的先天格局",
    description:
      "輸入出生年月日時，排出四柱命盤、五行比例、十神與大運，提供個性、事業、財運、感情與健康分析。",
    color: "#d4af37",
    related: ["ziwei", "name", "numerology"],
    startPath: "/bazi/start",
  },
  {
    slug: "ziwei",
    name: "紫微斗數",
    shortName: "紫微",
    category: "chart",
    icon: "🌌",
    tagline: "十二宮命盤，解讀人生藍圖",
    description:
      "依農曆生辰安星排盤，產生十二宮命盤，深入分析命宮、夫妻宮、財帛宮與官祿宮等主要宮位。",
    color: "#b3a6f5",
    related: ["bazi", "astrology", "horoscope"],
    startPath: "/ziwei/start",
  },
  {
    slug: "astrology",
    name: "西洋占星",
    shortName: "占星",
    category: "chart",
    icon: "✨",
    tagline: "太陽、月亮、上升，三位一體的你",
    description:
      "計算你的太陽、月亮與上升星座，繪製個人本命盤，解析行星落座與星座性格。",
    color: "#e6c860",
    related: ["horoscope", "numerology", "match"],
    startPath: "/astrology/start",
  },
  {
    slug: "horoscope",
    name: "星座生肖運勢",
    shortName: "運勢",
    category: "fortune",
    icon: "🌠",
    tagline: "每日、每週、每月，運勢先知道",
    description:
      "12 星座與 12 生肖的每日、每週、每月運勢，含愛情、事業、財運、健康指數與幸運色、幸運數字、幸運方位。",
    color: "#e58bb0",
    related: ["astrology", "tarot", "match"],
    startPath: "/horoscope",
  },
  {
    slug: "name",
    name: "姓名學",
    shortName: "姓名",
    category: "chart",
    icon: "📜",
    tagline: "一筆一畫，藏著名字的能量",
    description:
      "姓名筆畫、五格三才與 81 數理分析，解讀個性、事業、感情與財運，並提供新生兒命名建議。",
    color: "#d4af37",
    related: ["bazi", "numerology", "match"],
    startPath: "/name/start",
  },
  {
    slug: "numerology",
    name: "生命靈數",
    shortName: "靈數",
    category: "chart",
    icon: "🔢",
    tagline: "生日裡的數字密碼",
    description:
      "由出生日期計算生命靈數與天賦數，分析性格、天賦、人生課題與感情模式。",
    color: "#8b7ae8",
    related: ["astrology", "name", "match"],
    startPath: "/numerology/start",
  },
  {
    slug: "iching",
    name: "易經卜卦",
    shortName: "卜卦",
    category: "divination",
    icon: "🪙",
    tagline: "六爻成卦，古老智慧的指引",
    description:
      "輸入想詢問的問題，以擲幣、數字或時間起卦，顯示本卦、變卦、卦辭與白話解析。",
    color: "#d4af37",
    related: ["tarot", "lots", "bazi"],
    startPath: "/iching/start",
  },
  {
    slug: "lots",
    name: "線上抽籤",
    shortName: "抽籤",
    category: "divination",
    icon: "🎋",
    tagline: "月老、觀音、關帝、媽祖靈籤",
    description:
      "默想您的問題，線上搖籤抽出籤詩，提供籤詩原文、吉凶、白話解說與建議。",
    color: "#e58bb0",
    related: ["iching", "tarot", "match"],
    startPath: "/lots",
  },
  {
    slug: "match",
    name: "愛情配對",
    shortName: "配對",
    category: "match",
    icon: "💞",
    tagline: "你們的緣分指數是幾分？",
    description:
      "姓名、生日、星座、生肖四種配對方式，顯示配對分數、相處模式、優勢與注意事項。",
    color: "#e58bb0",
    related: ["tarot", "horoscope", "name"],
    startPath: "/match",
  },
  {
    slug: "dream",
    name: "解夢",
    shortName: "解夢",
    category: "match",
    icon: "🌙",
    tagline: "夢境是潛意識寫給你的信",
    description:
      "輸入夢境內容，依關鍵字解析夢中元素的象徵意義，提供娛樂性與自我覺察向的解讀。",
    color: "#b3a6f5",
    related: ["tarot", "numerology", "horoscope"],
    startPath: "/dream/start",
  },
  {
    slug: "palm",
    name: "手相面相",
    shortName: "手面相",
    category: "match",
    icon: "🖐️",
    tagline: "掌心與五官的趣味探索",
    description:
      "上傳手掌或臉部照片（僅於您的瀏覽器端顯示、不上傳伺服器），取得娛樂性的個性、感情、事業與財運分析。",
    color: "#e6c860",
    related: ["name", "bazi", "match"],
    startPath: "/palm/start",
  },
];

export function getFeature(slug: string): FeatureDef | undefined {
  return FEATURES.find((f) => f.slug === slug);
}

export function getRelated(slug: string): FeatureDef[] {
  const f = getFeature(slug);
  if (!f) return [];
  return f.related
    .map((s) => getFeature(s))
    .filter((x): x is FeatureDef => Boolean(x))
    .slice(0, 3);
}

export function byCategory(cat: FeatureCategory): FeatureDef[] {
  return FEATURES.filter((f) => f.category === cat);
}
