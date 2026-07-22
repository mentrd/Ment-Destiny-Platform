import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMeta({
  title: "紫微斗數免費排盤｜十二宮、十四主星與生年四化解析",
  description:
    "輸入出生年月日與時辰，免費排出紫微斗數命盤：命宮身宮、五行局、十四主星入十二宮與生年四化（祿權科忌），重點解析命宮、夫妻、財帛、官祿四大宮位。",
  path: "/ziwei",
});

const FAQS = [
  {
    q: "紫微斗數和八字有什麼不同？",
    a: "兩者都以出生時間推命，但方法不同。八字把年月日時化成八個字，看五行生剋與十神；紫微斗數則先換算農曆，安十四主星與眾多輔星入十二宮，像一張人生的「星空地圖」，命宮、夫妻、財帛、官祿等宮位各管一個生活領域，論述更具象、分工更細。",
  },
  {
    q: "為什麼紫微斗數一定要出生時辰？",
    a: "紫微斗數的第一步就是用出生月份與時辰定出命宮位置，再由命宮推五行局、安紫微星，整張盤都從時辰出發，因此缺少時辰便無法排盤。若真的查不到時辰，可以先體驗不需時辰的八字命盤。",
  },
  {
    q: "宮位裡沒有主星是不是不好？",
    a: "不是。十四顆主星分布在十二宮中，必然有些宮位沒有主星坐守，這在傳統上稱為「空宮」，解讀時會「借」對面宮位的星曜來參看。空宮反而代表該領域彈性大、可塑性高，受環境與際遇影響較深，並非缺陷。",
  },
  {
    q: "四化（祿權科忌）是什麼意思？",
    a: "四化是依出生年的天干，讓四顆星分別「化祿、化權、化科、化忌」：化祿主資源與順遂、化權主掌控與企圖心、化科主名聲與貴人、化忌則是特別在意的課題所在。四化落在哪個宮位，該領域便帶有相應的能量色彩。",
  },
];

export default function ZiweiPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "紫微斗數", path: "/ziwei" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>🌌</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">紫微斗數</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          被譽為「天下第一神數」的東方星命學。以出生時辰安十四主星入十二宮，
          排出一張屬於你的星空地圖，看見性格、感情、財富與事業的星曜配置。
        </p>
        <div className="mt-8">
          <Link href="/ziwei/start" className="btn-gold">🌌 開始排盤</Link>
        </div>
      </section>

      {/* 原理科普 */}
      <section className="mt-6" aria-labelledby="basics-title">
        <h2 id="basics-title" className="divider-star font-serif text-lg font-bold">✦ 紫微斗數在看什麼 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>🏛️</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">十二宮位</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              命盤分成命宮、兄弟、夫妻、子女、財帛、疾厄、遷移、交友、官祿、田宅、福德、父母十二宮，
              各自對應一個生活領域。命宮由出生月份與時辰決定，是整張盤的起點。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>⭐</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">十四主星</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              紫微、天機、太陽、武曲、天同、廉貞、天府、太陰、貪狼、巨門、天相、天梁、七殺、破軍。
              主星落在哪個宮位，就為該領域定下主旋律，例如七殺坐命者敢衝敢拚。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>🔢</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">五行局</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              由命宮干支的納音五行定出水二局、木三局、金四局、土五局、火六局，
              決定紫微星的安放位置，也象徵人生節奏的快慢與格局的質地。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>🎯</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">生年四化</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              依出生年干，四顆星分別化祿（資源）、化權（企圖）、化科（名聲）、化忌（課題），
              像四枚能量印記蓋在不同宮位上，點出人生中最有感的四個領域。
            </p>
          </div>
        </div>
      </section>

      {/* 流程 */}
      <section className="mt-12" aria-labelledby="how-title">
        <h2 id="how-title" className="divider-star font-serif text-lg font-bold">✦ 三步驟看懂你的星盤 ✦</h2>
        <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["1", "輸入出生資料", "出生年月日、時辰與性別。紫微斗數必須有出生時辰。"],
            ["2", "換算農曆排盤", "西曆換算農曆，定命宮身宮與五行局，安主星、輔星與四化。"],
            ["3", "閱讀解析", "十二宮命盤一覽，命宮、夫妻、財帛、官祿四大宮位深入解讀。"],
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
        <h2 className="font-serif text-xl font-bold text-gold-400">想知道你的命宮主星是哪一顆嗎？</h2>
        <p className="mt-2 text-sm text-ink-300">一分鐘排出十二宮命盤，主星、四化、五行局一次看懂。</p>
        <div className="mt-5">
          <Link href="/ziwei/start" className="btn-gold">🌌 免費排盤</Link>
        </div>
      </section>
    </div>
  );
}
