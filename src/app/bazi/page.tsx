import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMeta({
  title: "八字命盤免費排盤｜四柱、五行、日主強弱與大運分析",
  description:
    "輸入出生年月日與時辰，免費排出你的八字四柱命盤：天干地支、十神藏干、五行比例、日主強弱、喜用神與十年大運，附個性、事業、財運、感情與生活作息五大面向解讀。",
  path: "/bazi",
});

const FAQS = [
  {
    q: "八字是什麼？怎麼排出來的？",
    a: "八字又稱四柱命理，將出生的年、月、日、時換算成四組天干地支，共八個字。年柱以立春分界、月柱以節氣分界、日柱由曆法推算、時柱依日干配時辰（五鼠遁）。透過八字的五行生剋與十神關係，可以看出一個人的性格傾向與能量分布。",
  },
  {
    q: "不知道出生時辰可以排八字嗎？",
    a: "可以。時辰未知時會以年、月、日三柱排盤，日主、生肖、五行比例、身強身弱與大運仍可推算，只是少了時柱的細節。建議向家人詢問或查閱出生證明，補上時辰後結果會更完整。",
  },
  {
    q: "身強、身弱是什麼意思？身弱是不是比較不好？",
    a: "身強身弱指的是日主（代表你自己的那個天干）在整個命盤中得到的支持多寡，是能量結構的描述，沒有好壞之分。身強適合主動輸出與承擔，身弱適合借力使力、累積資源，兩種格局各有相應的喜用五行與發揮方式。",
  },
  {
    q: "八字結果會決定我的命運嗎？",
    a: "不會。本站的八字排盤與解讀定位為娛樂、文化與自我探索參考，呈現的是傳統命理對性格與能量傾向的描述方式，不構成任何醫療、投資或人生決策建議。命運始終掌握在自己手中。",
  },
];

export default function BaziPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "八字命盤", path: "/bazi" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>☯</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">八字命盤</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          出生那一刻的年、月、日、時，化成八個字的天地密碼。
          排出你的四柱命盤，看見五行能量的分布、日主的強弱與十年一運的人生節奏。
        </p>
        <div className="mt-8">
          <Link href="/bazi/start" className="btn-gold">☯ 開始排盤</Link>
        </div>
      </section>

      {/* 原理科普 */}
      <section className="mt-6" aria-labelledby="basics-title">
        <h2 id="basics-title" className="divider-star font-serif text-lg font-bold">✦ 八字在看什麼 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>🀄</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">四柱八字</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              年、月、日、時各配一組天干地支，合計八個字。年柱以立春為界、月柱以節氣為界，
              因此八字的「年」與「月」和日曆上的不完全相同，這正是排盤的精妙之處。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>🌊</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">五行生剋</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              木、火、土、金、水五種能量相生相剋，構成命盤的動態平衡。
              統計八字中五行的比重，可以看出你能量的長處與短板，以及適合補強的方向。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>👤</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">日主與十神</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              日柱的天干代表「你自己」，稱為日主。其他干支與日主的生剋關係化為十神：
              比肩、食神、正財、正官、正印等，描繪出性格、人際與資源的互動樣貌。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>🛤️</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">大運流轉</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              從月柱出發，依年干陰陽與性別順排或逆排，每十年換一柱大運。
              大運像人生的季節，呈現不同階段的能量氛圍與課題。
            </p>
          </div>
        </div>
      </section>

      {/* 流程 */}
      <section className="mt-12" aria-labelledby="how-title">
        <h2 id="how-title" className="divider-star font-serif text-lg font-bold">✦ 三步驟看懂你的八字 ✦</h2>
        <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["1", "輸入出生資料", "出生年月日、時辰與性別。不知道時辰也可以先以三柱排盤。"],
            ["2", "推算四柱命盤", "依節氣與曆法換算天干地支，統計五行、判斷日主強弱與喜用神。"],
            ["3", "閱讀解讀", "四柱表、五行圖與大運列，加上個性、事業、財運、感情等五大面向分析。"],
          ].map(([n, t, d]) => (
            <li key={n} className="card-mystic p-5">
              <span className="font-serif text-2xl font-bold text-gold-500/70">{n}</span>
              <h3 className="mt-1 font-bold">{t}</h3>
              <p className="mt-1 text-sm text-ink-300">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-12" aria-labelledby="faq-title">
        <h2 id="faq-title" className="divider-star font-serif text-lg font-bold">✦ 常見問題 ✦</h2>
        <div className="mt-5 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card-mystic group p-4">
              <summary className="cursor-pointer list-none font-bold text-ink-100">
                <span className="mr-2 text-gold-400" aria-hidden>Q</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-6 text-sm leading-relaxed text-ink-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card-mystic mt-12 p-8 text-center">
        <h2 className="font-serif text-xl font-bold text-gold-400">想知道自己的日主是哪個字嗎？</h2>
        <p className="mt-2 text-sm text-ink-300">一分鐘排出四柱命盤，五行、強弱、大運一次看懂。</p>
        <div className="mt-5">
          <Link href="/bazi/start" className="btn-gold">☯ 免費排盤</Link>
        </div>
      </section>
    </div>
  );
}
