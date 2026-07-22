/**
 * 西洋占星簡化天文計算引擎（無外部套件）
 * - 太陽黃經：J2000 低精度公式（誤差 < 0.01°）
 * - 月亮黃經：低精度級數主要項（誤差約 0.3°，足夠判星座）
 * - 水金火木土：JPL 平均軌道要素（含線性變率）+ 克卜勒方程，誤差數度內
 * - 上升星座：恆星時 LST + 緯度標準公式
 * 定位為娛樂與自我探索用途，精度足以判斷星座落點。
 */

import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/engines/horoscope-data";

/* ── 城市表（時區為標準時，未含日光節約時間） ───────────── */

export interface City {
  name: string;
  lat: number; // 北緯正
  lon: number; // 東經正
  tz: number; // UTC 偏移（小時）
}

export const CITIES: City[] = [
  { name: "台北市", lat: 25.03, lon: 121.56, tz: 8 },
  { name: "新北市", lat: 25.01, lon: 121.46, tz: 8 },
  { name: "基隆市", lat: 25.13, lon: 121.74, tz: 8 },
  { name: "桃園市", lat: 24.99, lon: 121.3, tz: 8 },
  { name: "新竹市", lat: 24.8, lon: 120.97, tz: 8 },
  { name: "苗栗縣", lat: 24.56, lon: 120.82, tz: 8 },
  { name: "台中市", lat: 24.15, lon: 120.67, tz: 8 },
  { name: "彰化縣", lat: 24.08, lon: 120.54, tz: 8 },
  { name: "南投縣", lat: 23.96, lon: 120.69, tz: 8 },
  { name: "雲林縣", lat: 23.71, lon: 120.43, tz: 8 },
  { name: "嘉義市", lat: 23.48, lon: 120.45, tz: 8 },
  { name: "台南市", lat: 23.0, lon: 120.23, tz: 8 },
  { name: "高雄市", lat: 22.63, lon: 120.3, tz: 8 },
  { name: "屏東縣", lat: 22.68, lon: 120.49, tz: 8 },
  { name: "宜蘭縣", lat: 24.76, lon: 121.75, tz: 8 },
  { name: "花蓮縣", lat: 23.99, lon: 121.6, tz: 8 },
  { name: "台東縣", lat: 22.76, lon: 121.14, tz: 8 },
  { name: "澎湖縣", lat: 23.57, lon: 119.58, tz: 8 },
  { name: "金門縣", lat: 24.44, lon: 118.32, tz: 8 },
  { name: "連江縣（馬祖）", lat: 26.16, lon: 119.95, tz: 8 },
  { name: "香港", lat: 22.32, lon: 114.17, tz: 8 },
  { name: "澳門", lat: 22.2, lon: 113.55, tz: 8 },
  { name: "北京", lat: 39.9, lon: 116.41, tz: 8 },
  { name: "上海", lat: 31.23, lon: 121.47, tz: 8 },
  { name: "新加坡", lat: 1.35, lon: 103.82, tz: 8 },
  { name: "吉隆坡", lat: 3.14, lon: 101.69, tz: 8 },
  { name: "曼谷", lat: 13.76, lon: 100.5, tz: 7 },
  { name: "東京", lat: 35.68, lon: 139.69, tz: 9 },
  { name: "大阪", lat: 34.69, lon: 135.5, tz: 9 },
  { name: "首爾", lat: 37.57, lon: 126.98, tz: 9 },
  { name: "雪梨", lat: -33.87, lon: 151.21, tz: 10 },
  { name: "倫敦", lat: 51.51, lon: -0.13, tz: 0 },
  { name: "巴黎", lat: 48.86, lon: 2.35, tz: 1 },
  { name: "紐約", lat: 40.71, lon: -74.01, tz: -5 },
  { name: "洛杉磯", lat: 34.05, lon: -118.24, tz: -8 },
  { name: "舊金山", lat: 37.77, lon: -122.42, tz: -8 },
  { name: "溫哥華", lat: 49.28, lon: -123.12, tz: -8 },
  { name: "多倫多", lat: 43.65, lon: -79.38, tz: -5 },
];

/* ── 行星基礎資料 ───────────────────────── */

export type PlanetId = "sun" | "moon" | "mercury" | "venus" | "mars" | "jupiter" | "saturn";

export const PLANETS: { id: PlanetId; name: string; symbol: string }[] = [
  { id: "sun", name: "太陽", symbol: "☉" },
  { id: "moon", name: "月亮", symbol: "☽" },
  { id: "mercury", name: "水星", symbol: "☿" },
  { id: "venus", name: "金星", symbol: "♀" },
  { id: "mars", name: "火星", symbol: "♂" },
  { id: "jupiter", name: "木星", symbol: "♃" },
  { id: "saturn", name: "土星", symbol: "♄" },
];

export interface PlanetPosition {
  id: PlanetId;
  name: string;
  symbol: string;
  /** 黃經（度，0-360） */
  lon: number;
  sign: ZodiacSign;
  /** 星座內度數（0-30） */
  degreeInSign: number;
}

export interface AscendantPosition {
  lon: number;
  sign: ZodiacSign;
  degreeInSign: number;
}

export interface ChartInput {
  y: number;
  m: number;
  d: number;
  hour: number;
  minute: number;
  cityIndex: number;
  /** 不知道出生時間：以當地中午 12:00 估算，不計算上升 */
  unknownTime?: boolean;
}

export interface Chart {
  planets: PlanetPosition[]; // 依 PLANETS 順序：日月水金火木土
  sun: PlanetPosition;
  moon: PlanetPosition;
  ascendant: AscendantPosition | null;
  city: City;
  unknownTime: boolean;
}

/* ── 基礎數學 ───────────────────────── */

const DEG = Math.PI / 180;
const norm360 = (x: number) => ((x % 360) + 360) % 360;

/** 由黃經取得星座（黃經 / 30） */
export function signFromLongitude(lon: number): ZodiacSign {
  return ZODIAC_SIGNS[Math.floor(norm360(lon) / 30) % 12];
}

/** 西曆轉儒略日（UT，小時可含小數） */
function julianDay(y: number, m: number, d: number, utHours: number): number {
  let Y = y;
  let M = m;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5 + utHours / 24;
}

/* ── 太陽黃經（低精度，誤差 < 0.01°） ───────────────────────── */

export function sunLongitude(jd: number): number {
  const n = jd - 2451545.0;
  const L = 280.46 + 0.9856474 * n; // 平黃經
  const g = (357.528 + 0.9856003 * n) * DEG; // 平近點角
  return norm360(L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g));
}

/* ── 月亮黃經（低精度級數，誤差約 0.3°） ───────────────────────── */

export function moonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const s = (x: number) => Math.sin(x * DEG);
  return norm360(
    218.32 +
      481267.8813 * T +
      6.29 * s(134.9 + 477198.85 * T) -
      1.27 * s(259.2 - 413335.38 * T) +
      0.66 * s(235.7 + 890534.23 * T) +
      0.21 * s(269.9 + 954397.7 * T) -
      0.19 * s(357.5 + 35999.05 * T) -
      0.11 * s(186.6 + 966404.05 * T)
  );
}

/* ── 行星：JPL 平均軌道要素（J2000，含每儒略世紀變率） ───────────── */

interface OrbitalElements {
  a: number; da: number; // 半長軸（AU）
  e: number; de: number; // 離心率
  i: number; di: number; // 軌道傾角（度）
  L: number; dL: number; // 平黃經（度）
  wbar: number; dwbar: number; // 近日點黃經（度）
  O: number; dO: number; // 升交點黃經（度）
}

const ORBITS: Record<"mercury" | "venus" | "earth" | "mars" | "jupiter" | "saturn", OrbitalElements> = {
  mercury: { a: 0.38709927, da: 0.00000037, e: 0.20563593, de: 0.00001906, i: 7.00497902, di: -0.00594749, L: 252.2503235, dL: 149472.67411175, wbar: 77.45779628, dwbar: 0.16047689, O: 48.33076593, dO: -0.12534081 },
  venus: { a: 0.72333566, da: 0.0000039, e: 0.00677672, de: -0.00004107, i: 3.39467605, di: -0.0007889, L: 181.9790995, dL: 58517.81538729, wbar: 131.60246718, dwbar: 0.00268329, O: 76.67984255, dO: -0.27769418 },
  earth: { a: 1.00000261, da: 0.00000562, e: 0.01671123, de: -0.00004392, i: -0.00001531, di: -0.01294668, L: 100.46457166, dL: 35999.37244981, wbar: 102.93768193, dwbar: 0.32327364, O: 0, dO: 0 },
  mars: { a: 1.52371034, da: 0.00001847, e: 0.0933941, de: 0.00007882, i: 1.84969142, di: -0.00813131, L: -4.55343205, dL: 19140.30268499, wbar: -23.94362959, dwbar: 0.44441088, O: 49.55953891, dO: -0.29257343 },
  jupiter: { a: 5.202887, da: -0.00011607, e: 0.04838624, de: -0.00013253, i: 1.30439695, di: -0.00183714, L: 34.39644051, dL: 3034.74612775, wbar: 14.72847983, dwbar: 0.21252668, O: 100.47390909, dO: 0.20469106 },
  saturn: { a: 9.53667594, da: -0.0012506, e: 0.05386179, de: -0.00050991, i: 2.48599187, di: 0.00193609, L: 49.95424423, dL: 1222.49362201, wbar: 92.59887831, dwbar: -0.41897216, O: 113.66242448, dO: -0.28867794 },
};

/** 由軌道要素求日心黃道直角座標（AU） */
function heliocentric(el: OrbitalElements, T: number): [number, number, number] {
  const a = el.a + el.da * T;
  const e = el.e + el.de * T;
  const i = (el.i + el.di * T) * DEG;
  const L = el.L + el.dL * T;
  const wbar = el.wbar + el.dwbar * T;
  const O = (el.O + el.dO * T) * DEG;
  const w = wbar * DEG - O; // 近日點幅角
  const M = norm360(L - wbar) * DEG; // 平近點角

  // 克卜勒方程疊代
  let E = M;
  for (let k = 0; k < 30; k++) E = M + e * Math.sin(E);

  const xp = a * (Math.cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const cw = Math.cos(w), sw = Math.sin(w);
  const cO = Math.cos(O), sO = Math.sin(O);
  const ci = Math.cos(i), si = Math.sin(i);

  return [
    (cw * cO - sw * sO * ci) * xp + (-sw * cO - cw * sO * ci) * yp,
    (cw * sO + sw * cO * ci) * xp + (-sw * sO + cw * cO * ci) * yp,
    sw * si * xp + cw * si * yp,
  ];
}

/** 行星地心黃經（度） */
export function planetLongitude(id: "mercury" | "venus" | "mars" | "jupiter" | "saturn", jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const p = heliocentric(ORBITS[id], T);
  const ea = heliocentric(ORBITS.earth, T);
  return norm360(Math.atan2(p[1] - ea[1], p[0] - ea[0]) / DEG);
}

/* ── 上升星座 ───────────────────────── */

export function ascendantLongitude(jd: number, latDeg: number, lonEastDeg: number): number {
  const n = jd - 2451545.0;
  const gmst = norm360(280.46061837 + 360.98564736629 * n); // 格林威治恆星時（度）
  const lst = norm360(gmst + lonEastDeg) * DEG; // 當地恆星時（RAMC）
  const eps = (23.4393 - 0.0000004 * n) * DEG; // 黃赤交角
  const phi = latDeg * DEG;
  const asc = Math.atan2(Math.cos(lst), -(Math.sin(lst) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)));
  return norm360(asc / DEG);
}

/* ── 主計算 ───────────────────────── */

function toPosition(id: PlanetId, lon: number): PlanetPosition {
  const meta = PLANETS.find((p) => p.id === id)!;
  const L = norm360(lon);
  return {
    id,
    name: meta.name,
    symbol: meta.symbol,
    lon: Math.round(L * 100) / 100,
    sign: signFromLongitude(L),
    degreeInSign: Math.round((L % 30) * 10) / 10,
  };
}

export function computeChart(input: ChartInput): Chart {
  const city = CITIES[input.cityIndex] ?? CITIES[0];
  const unknownTime = Boolean(input.unknownTime);
  const hour = unknownTime ? 12 : input.hour;
  const minute = unknownTime ? 0 : input.minute;
  const ut = hour + minute / 60 - city.tz; // 當地時間轉 UT
  const jd = julianDay(input.y, input.m, input.d, ut);

  const sun = toPosition("sun", sunLongitude(jd));
  const moon = toPosition("moon", moonLongitude(jd));
  const planets: PlanetPosition[] = [
    sun,
    moon,
    toPosition("mercury", planetLongitude("mercury", jd)),
    toPosition("venus", planetLongitude("venus", jd)),
    toPosition("mars", planetLongitude("mars", jd)),
    toPosition("jupiter", planetLongitude("jupiter", jd)),
    toPosition("saturn", planetLongitude("saturn", jd)),
  ];

  let ascendant: AscendantPosition | null = null;
  if (!unknownTime) {
    const ascLon = ascendantLongitude(jd, city.lat, city.lon);
    ascendant = {
      lon: Math.round(ascLon * 100) / 100,
      sign: signFromLongitude(ascLon),
      degreeInSign: Math.round((ascLon % 30) * 10) / 10,
    };
  }

  return { planets, sun, moon, ascendant, city, unknownTime };
}
