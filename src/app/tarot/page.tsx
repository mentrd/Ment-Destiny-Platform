import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import RelatedFeatures from "@/components/RelatedFeatures";
import { faqJsonLd, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "塔羅牌占卜｜免費線上塔羅",
  description:
    "免費線上塔羅牌占卜：78 張韋特塔羅完整牌庫，提供單張、三張（過去現在未來）、愛情、事業財運、是非題與每日塔羅六種牌陣。默想問題、洗牌抽牌、翻牌即得正逆位牌義解讀，結果僅供娛樂與自我探索參考。",
  path: "/tarot",
});

const MODES = [
  {
    href: "/tarot/single",
    icon: "🃏",
    title: "單張塔羅",
    desc: "針對一件具體的事抽一張牌，快速得到清晰的指引。",
  },
  {
    href: "/tarot/three",
    icon: "🕰️",
    title: "三張牌陣",
    desc: "以「過去・現在・未來」看一件事的來龍去脈與走向。",
  },
  {
    href: "/tarot/love",
    icon: "💞",
    title: "愛情塔羅",
    desc: "從我的心態、對方心態到關係走向，看清這段感情。",
  },
  {
    href: "/tarot/career",
    icon: "💼",
    title: "事業財運",
    desc: "釐清現況、眼前阻礙與可行的建議方向。",
  },
  {
    href: "/tarot/yesno",
    icon: "⚖️",
    title: "是非題",
    desc: "把問題化成一句是非題，看塔羅給你的傾向。",
  },
  {
    href: "/tarot/daily",
    icon: "🌙",
    title: "每日塔羅",
    desc: "抽一張今日指引牌，作為一天的提醒與陪伴。",
  },
];

const STEPS = [
  { title: "默想", text: "靜下心，在心中默想你想請示的問題，一次一個問題最清楚。" },
  { title: "洗牌", text: "按「開始洗牌」，讓牌卡在扇形中展開，交由當下的直覺帶路。" },
  { title: "抽牌", text: "憑感覺輕觸吸引你的牌，選出牌陣需要的張數。" },
  { title: "解讀", text: "翻牌後細讀正逆位牌義與關鍵字，把提醒帶回生活裡印證。" },
];

const FAQS = [
  {
    q: "線上塔羅牌占卜準嗎？",
    a: "塔羅是一套象徵系統，透過牌面圖像引導你梳理當下的處境與心境。本功能定位為娛樂與自我探索，牌義提供的是思考的切入點，而非命定的答案，重要決定仍請回到自己的判斷。",
  },
  {
    q: "正位和逆位有什麼不同？",
    a: "正位多半代表能量順暢地展現，逆位則常提示能量受阻、內化或需要調整的面向。逆位不等於壞事，很多時候它給的提醒反而更貼近你此刻真正需要留意的地方。",
  },
  {
    q: "同一個問題可以一直重抽嗎？",
    a: "建議一個問題誠心抽一次。若不斷重抽通常只會讓思緒更亂；等情境有了新的變化，再帶著新的問題來抽牌會更有意義。",
  },
  {
    q: "六種牌陣該怎麼選？",
    a: "想快速得到方向選單張；想看事情的時間脈絡選三張；感情主題選愛情塔羅；工作與財務選事業財運；需要一個明確傾向選是非題；想要每天的提醒選每日塔羅。",
  },
  {
    q: "抽到的結果可以分享或保存嗎？",
    a: "可以。結果頁的網址已含還原參數，複製連結即可讓朋友看到同一次的抽牌結果，也方便自己日後回顧。",
  },
];

export default function TarotPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "塔羅牌占卜", path: "/tarot" }]} />

      <header className="text-center">
        <span aria-hidden className="text-4xl">🃏</span>
        <h1 className="mt-2 font-serif text-3xl font-bold text-gradient-gold sm:text-4xl">
          塔羅牌占卜
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-300">
          78 張韋特塔羅完整牌庫，六種牌陣任你選擇。默想你的問題、洗牌抽牌，翻牌即得正逆位牌義與關鍵字解讀，
          讓塔羅陪你聽聽內心的聲音。
        </p>
      </header>

      {/* 六種模式 */}
      <section className="mt-8">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 選擇你的牌陣 ✦</p>
        <div className="rise-stagger grid gap-4 sm:grid-cols-2">
          {MODES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="card-mystic card-mystic-hover flex flex-col gap-2 p-5"
            >
              <div className="flex items-center gap-3">
                <span aria-hidden className="text-3xl">{m.icon}</span>
                <h2 className="font-serif text-lg font-bold text-ink-100">{m.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-ink-300">{m.desc}</p>
              <span className="mt-auto pt-1 text-sm font-medium text-gold-300">開始占卜 →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 占卜流程 */}
      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 占卜流程 ✦</p>
        <ol className="rise-stagger grid gap-3 sm:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card-mystic p-4 text-center sm:text-left">
              <span className="font-serif text-lg font-bold text-gold-400">{i + 1}</span>
              <h3 className="mt-1 font-serif font-bold text-ink-100">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 關於塔羅 */}
      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 關於塔羅牌 ✦</p>
        <div className="card-mystic p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-300">
            塔羅牌共 78 張，分為 22 張「大阿爾克那」與 56 張「小阿爾克那」。大阿爾克那描繪人生重要的課題與階段，
            小阿爾克那則以權杖、聖杯、寶劍、錢幣四個牌組，對應熱情、情感、思緒與物質等日常面向。
            占卜時，牌面圖像與正逆位共同構成一則故事，引導你從新的角度看待眼前的處境。它不預言命運，
            而是幫你把混亂的心緒攤開來，看清自己真正在意的是什麼。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 常見問題 ✦</p>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card-mystic group p-4">
              <summary className="cursor-pointer list-none font-medium text-ink-100 marker:content-none">
                <span
                  aria-hidden
                  className="mr-2 inline-block text-gold-400 transition-transform group-open:rotate-90"
                >
                  ›
                </span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-ink-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Disclaimer />
      <RelatedFeatures slug="tarot" />
    </div>
  );
}
