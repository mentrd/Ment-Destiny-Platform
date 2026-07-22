import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ZODIAC_SIGNS } from "@/lib/engines/horoscope-data";

export const metadata = pageMeta({
  title: "西洋占星本命盤｜太陽、月亮、上升星座免費查詢",
  description:
    "輸入出生年月日、時間與地點，免費計算你的太陽、月亮與上升星座，繪製個人本命盤，解析七大行星落座與綜合性格。即測即得，探索三位一體的你。",
  path: "/astrology",
});

const FAQS = [
  {
    q: "太陽、月亮、上升星座有什麼不同？",
    a: "太陽星座代表你的自我核心與人生方向，是最廣為人知的「星座」；月亮星座掌管情緒與安全感，是私底下最真實的你；上升星座則是你給人的第一印象與外在形象。三者合稱「三王」，一起看才是完整的你。",
  },
  {
    q: "不知道出生時間可以算嗎？",
    a: "可以。太陽星座只需要出生日期即可準確判斷；月亮星座會以當天中午估算，少數情況可能相差一個星座；上升星座因為每兩小時就換一個，必須有出生時間才能計算。建議向家人查詢或翻閱出生證明。",
  },
  {
    q: "為什麼需要輸入出生地點？",
    a: "上升星座是出生當下東方地平線升起的星座，與所在地的經緯度直接相關。同一時刻在台北與紐約出生，上升星座可能完全不同，因此需要出生城市來計算。",
  },
  {
    q: "這裡的星盤計算準確嗎？",
    a: "本站採用天文演算法計算行星黃經與上升點，判斷星座落點綽綽有餘。結果定位為娛樂與自我探索參考，若需要精確到度數的專業論盤，建議諮詢專業占星師。",
  },
];

export default function AstrologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "西洋占星", path: "/astrology" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>✨</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">西洋占星本命盤</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          你不只是一個太陽星座。輸入出生資料，計算你的太陽、月亮與上升星座，
          看見七大行星在天空中為你排列的獨特配置。
        </p>
        <div className="mt-8">
          <Link href="/astrology/start" className="btn-gold">🔭 開始排盤</Link>
        </div>
      </section>

      {/* 三王科普 */}
      <section className="mt-6" aria-labelledby="big3-title">
        <h2 id="big3-title" className="divider-star font-serif text-lg font-bold">✦ 認識你的三王 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>☉</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">太陽星座</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              代表自我核心、生命力與人生方向，是你「最想成為的樣子」。
              平常說的星座就是它，由出生日期決定，是性格中最穩定的主軸。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>☽</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">月亮星座</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              掌管情緒、直覺與安全感，是卸下面具後最真實的內在。
              月亮約兩天半換一個星座，同一天出生的人月亮也可能不同。
            </p>
          </div>
          <div className="card-mystic p-5">
            <p className="text-3xl" aria-hidden>↑</p>
            <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">上升星座</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              出生當下東方地平線升起的星座，決定你的第一印象與外在形象。
              約每兩小時換一個，因此需要出生時間與地點才能計算。
            </p>
          </div>
        </div>
      </section>

      {/* 12 星座速覽 */}
      <section className="mt-12" aria-labelledby="signs-title">
        <h2 id="signs-title" className="divider-star font-serif text-lg font-bold">✦ 十二星座 ✦</h2>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {ZODIAC_SIGNS.map((s) => (
            <div key={s.slug} className="card-mystic flex flex-col items-center gap-1 px-2 py-3 text-center">
              <span className="text-2xl text-gold-400" aria-hidden>{s.emoji}</span>
              <span className="text-sm font-bold">{s.name}</span>
              <span className="text-xs text-ink-500">{s.dateRange}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 流程 */}
      <section className="mt-12" aria-labelledby="how-title">
        <h2 id="how-title" className="divider-star font-serif text-lg font-bold">✦ 三步驟看懂你的星盤 ✦</h2>
        <ol className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            ["1", "輸入出生資料", "出生年月日、時間與城市。不知道時間也可以先算太陽與月亮。"],
            ["2", "計算本命盤", "以天文演算法計算七大行星黃經與上升點，繪製你的星盤輪。"],
            ["3", "閱讀解析", "太陽、月亮、上升三大解讀，行星落座表與綜合性格分析。"],
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
        <h2 className="font-serif text-xl font-bold text-gold-400">準備好認識完整的自己了嗎？</h2>
        <p className="mt-2 text-sm text-ink-300">一分鐘排出你的本命盤，太陽、月亮、上升一次看懂。</p>
        <div className="mt-5">
          <Link href="/astrology/start" className="btn-gold">✨ 免費排盤</Link>
        </div>
      </section>
    </div>
  );
}
