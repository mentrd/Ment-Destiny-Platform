import { TAROT_CARDS, TarotCard } from "@/lib/engines/tarot-data";
import { seededRng, shuffle } from "@/lib/random";

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
}

/**
 * 以種子抽牌：同一種子必得同一結果（供分享連結重現）。
 * 洗牌後取前 count 張，每張以 1/3 機率為逆位。
 */
export function drawCards(seed: number, count: number): DrawnCard[] {
  const rng = seededRng(seed);
  const deck = shuffle(rng, TAROT_CARDS);
  return deck.slice(0, count).map((card) => ({
    card,
    reversed: rng() < 1 / 3,
  }));
}
