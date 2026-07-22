/**
 * 手相／面相分析引擎（娛樂定位）
 * 照片絕不上傳：僅以瀏覽器端計算出的 photoHash 作為亂數種子，
 * 相同照片 + 選項會得到相同結果，分享連結可重現。
 */

import { hashString, pick, seededRng } from "@/lib/random";
import {
  CAREER_POOL,
  FACE_FEATURES,
  LOVE_POOL,
  PALM_LINES,
  PERSONALITY_POOL,
  WEALTH_POOL,
} from "@/lib/engines/palm-copy";

export type Hand = "L" | "R";
export type Gender = "M" | "F";
export type PalmMode = "palm" | "face";

export interface PalmInput {
  photoHash: number;
  hand: Hand;
  gender: Gender;
  mode: PalmMode;
}

export interface AspectReading {
  key: "personality" | "love" | "career" | "wealth";
  label: string;
  icon: string;
  text: string;
}

export interface LineReading {
  key: string;
  name: string;
  icon: string;
  meaning: string;
  comment: string;
}

export interface PalmAnalysis {
  mode: PalmMode;
  /** palm 模式：三大主線短評；face 模式：五官短評 */
  lines: LineReading[];
  /** 個性／感情／事業／財運 */
  aspects: AspectReading[];
}

export const HAND_LABELS: Record<Hand, string> = { L: "左手", R: "右手" };
export const GENDER_LABELS: Record<Gender, string> = { M: "男性", F: "女性" };
export const MODE_LABELS: Record<PalmMode, string> = { palm: "手相", face: "面相" };

export function analyzePalm(input: PalmInput): PalmAnalysis {
  const rng = seededRng(
    hashString(`palm|${input.photoHash >>> 0}|${input.hand}|${input.gender}|${input.mode}`)
  );
  const defs = input.mode === "palm" ? PALM_LINES : FACE_FEATURES;
  const lines: LineReading[] = defs.map((d) => ({
    key: d.key,
    name: d.name,
    icon: d.icon,
    meaning: d.meaning,
    comment: pick(rng, d.pool),
  }));
  const aspects: AspectReading[] = [
    { key: "personality", label: "個性特質", icon: "✨", text: pick(rng, PERSONALITY_POOL) },
    { key: "love", label: "感情運勢", icon: "💞", text: pick(rng, LOVE_POOL) },
    { key: "career", label: "事業發展", icon: "🚀", text: pick(rng, CAREER_POOL) },
    { key: "wealth", label: "財運理財", icon: "💰", text: pick(rng, WEALTH_POOL) },
  ];
  return { mode: input.mode, lines, aspects };
}
