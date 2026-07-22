/**
 * 解夢分析引擎：關鍵字比對 + 綜合心理向解讀
 * 定位：娛樂與自我覺察，禁止恐嚇式解讀與疾病預測
 */

import { DREAM_DICT, type DreamCategory, type DreamEntry } from "@/lib/engines/dream-data";
import { pick, seededRng } from "@/lib/random";

export interface DreamAnalysis {
  hits: DreamEntry[];
  matchedWords: string[];
}

/**
 * 以子字串比對夢境描述中的關鍵字。
 * 每條字典項取「命中的最長關鍵詞」計分，依關鍵詞長度降冪排序，最多回傳 6 條。
 */
export function analyzeDream(text: string): DreamAnalysis {
  const scored: { entry: DreamEntry; word: string }[] = [];
  for (const entry of DREAM_DICT) {
    let best = "";
    for (const kw of entry.keywords) {
      if (kw && kw.length > best.length && text.includes(kw)) best = kw;
    }
    if (best) scored.push({ entry, word: best });
  }
  scored.sort((a, b) => b.word.length - a.word.length);
  const top = scored.slice(0, 6);
  return {
    hits: top.map((s) => s.entry),
    matchedWords: [...new Set(top.map((s) => s.word))],
  };
}

/* ============ 綜合解讀模板池 ============ */

const OPENINGS = [
  "這個夢像一封潛意識寫給你的信。",
  "夢是心在夜裡的自言自語。",
  "夜裡浮現的畫面，往往映照著白天沒說出口的心事。",
  "夢境不必逐字解釋，它更像一面折射心情的鏡子。",
] as const;

const CATEGORY_SENTENCES: Record<DreamCategory, readonly string[]> = {
  動物: [
    "夢中的動物常代表你本能面的情緒能量，牠的姿態正呼應你近期壓抑或渴望釋放的部分。",
    "動物入夢，多半是直覺與本能在對你說話，提醒你別只用理智過日子。",
    "這些動物形象可能是你性格中某個少被看見的面向，正等著被你承認與安放。",
  ],
  自然: [
    "自然景象往往對應你內在的情緒氣候，晴雨風浪都是心境的隱喻。",
    "夢裡的天地山水，常反映你此刻感受到的環境氛圍與掌控感。",
    "自然元素提醒你留意情緒的流動：它需要出口，而不是堤防。",
  ],
  人物: [
    "夢中出現的人物，常常是你自身某個面向的投影，或一段需要被整理的關係。",
    "與其問夢裡的他想做什麼，不如問：他喚起了你什麼樣的感覺？",
    "人物入夢，多半代表你近期在人際或情感上有想說卻未說的話。",
  ],
  場景: [
    "夢的場景像一座心境舞台，暗示你目前所處的人生階段與安全感狀態。",
    "熟悉或陌生的空間，反映你對現況的歸屬感與想逃離或想回去的心情。",
    "場景的氛圍往往比劇情更誠實，它透露了你面對現實處境的真實感受。",
  ],
  行為: [
    "夢中的動作反映你面對壓力時的因應姿態：想追、想逃、想飛，都是心的語言。",
    "這些行為多半對應你近期的掌控感——哪裡使不上力，夢就替你演出來。",
    "行為類的夢常是情緒的排練場，讓你在安全的地方先體驗一次選擇。",
  ],
  物品: [
    "夢中的物品常象徵你在意的資源與價值：得到、失去或損壞，都值得回味。",
    "物品承載著你賦予它的意義，它出現在夢裡，代表某件事的份量比你以為的重。",
    "留意你和物品互動的方式，那往往對應你近期對安全感與擁有的態度。",
  ],
  身體: [
    "與身體有關的夢，多半關於自我形象與界線，而非真實的健康預告，請放心。",
    "身體是自我的容器，夢見它的變化，常反映你對自己狀態或形象的在意。",
    "這類夢在提醒你：好好感受自己，包括疲憊、緊繃與需要被照顧的部分。",
  ],
  情緒: [
    "夢中放大的情緒，是白天被縮小的感受在夜裡討回話語權。",
    "情緒本身沒有對錯，夢只是替你把它演得更清楚，好讓你正視它。",
    "醒來時殘留的感覺是最珍貴的線索，它比劇情更接近你的真心。",
  ],
} as const;

const CLOSINGS = [
  "不妨把夢記下來，過幾天回頭再看，你會更清楚它想提醒你什麼。",
  "與其追問吉凶，不如問問自己：這個夢讓我想起了誰、想起了什麼？",
  "把夢當作一次溫柔的自我對話，答案不在夢裡，而在你醒來後的選擇。",
  "給自己幾分鐘安靜下來，感受夢留下的餘韻，那就是最好的解讀起點。",
] as const;

const GENERIC_OVERALLS = [
  "你的夢由非常個人化的意象組成，這其實很珍貴——它代表潛意識用只屬於你的語言在說話。試著回想夢裡最強烈的一幕與醒來時的情緒：是安心、緊張還是惆悵？那份感覺往往直指你近期最在意的事。把它寫下來，答案會慢慢浮現。",
  "這個夢沒有落在常見的符號裡，代表它更貼近你獨特的生命經驗。與其查字典，不如問自己三個問題：夢裡的我在做什麼？我最想改變哪個瞬間？醒來後第一個念頭是什麼？順著這些線索，你會比任何解夢書更懂這個夢。",
  "夢境是潛意識的私人劇場，有些戲碼只演給你一個人看。請留意夢裡反覆出現的顏色、聲音或感覺，它們常比情節更有意義。今晚睡前可以在心裡對自己說：「我願意記得我的夢」，連續幾天記錄下來，模式自然會浮現。",
] as const;

/**
 * 依命中類別組句，產生 100-150 字綜合心理向解讀。
 * 同一組 hits + seed 產生相同結果（分享連結可重現）。
 */
export function generateOverall(hits: DreamEntry[], seed: number | string): string {
  const rng = seededRng(seed);
  if (hits.length === 0) return pick(rng, GENERIC_OVERALLS);

  const categories: DreamCategory[] = [];
  for (const h of hits) {
    if (!categories.includes(h.category)) categories.push(h.category);
  }
  const used = categories.slice(0, 2);
  const parts: string[] = [pick(rng, OPENINGS)];
  for (const c of used) parts.push(pick(rng, CATEGORY_SENTENCES[c]));
  parts.push(pick(rng, CLOSINGS));
  return parts.join("");
}
