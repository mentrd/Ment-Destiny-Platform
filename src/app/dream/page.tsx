import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMeta({
  title: "免費線上解夢｜榮格心理學＋周公解夢夢境解析",
  description:
    "描述你的夢境，免費取得結合榮格心理學象徵觀點與周公解夢的夢境解析：捕捉夢中元素、象徵意義與自我覺察提問，附綜合心理解讀。即測即得，僅供娛樂與自我探索參考。",
  path: "/dream",
});

const FAQS = [
  {
    q: "夢境真的有意義嗎？",
    a: "從心理學的角度，夢是潛意識的表達。精神分析學派認為夢反映了白天未被處理的情緒與願望；榮格則視夢為心靈自我調節的訊息。與其問夢會不會成真，不如把夢當成認識自己的一扇窗。",
  },
  {
    q: "這個解夢是用周公解夢還是心理學？",
    a: "兩者並陳。我們以榮格心理學的「象徵」觀點為主軸，解讀夢中元素對應的內在狀態；同時保留周公解夢等民俗說法作為文化趣味參考。所有解讀都不做吉凶斷言，也不涉及健康診斷。",
  },
  {
    q: "為什麼我常夢見同一個場景或畫面？",
    a: "反覆出現的夢，往往對應一個尚未被你正視或安放的情緒課題。它就像心裡的提醒鈴，會一直響到你願意停下來聽為止。試著記錄這些夢的共同點，通常能找到線索。",
  },
  {
    q: "夢見不好的畫面，是不祥之兆嗎？",
    a: "不是。夢裡的「壞事」多半是情緒的排練或壓力的投射，而非預言。例如夢見墜落常反映失控感、夢見追趕常反映逃避的心情。它們是心在替你演出感受，請放心，不必對號入座。",
  },
  {
    q: "解夢結果可以當真嗎？",
    a: "本站解夢定位為娛樂與自我覺察工具，不是命運預測，也不構成任何醫療、心理或專業建議。取其啟發、幫助你更了解自己就好，人生的選擇權始終在你手上。",
  },
];

const SCHOOLS = [
  {
    emoji: "🧠",
    title: "榮格心理學視角",
    desc: "榮格認為夢是潛意識寫給意識的信，透過「象徵」傳遞訊息。夢中的蛇、海、追趕，往往不是字面意思，而是你內在情緒與課題的投影，幫助心靈自我平衡。",
  },
  {
    emoji: "📜",
    title: "周公解夢視角",
    desc: "周公解夢是流傳千年的民俗解夢傳統，以生活經驗歸納夢境與吉凶的對應。我們保留其中的文化趣味，但只當作參考，不做恐嚇式的吉凶斷言。",
  },
];

export default function DreamPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "解夢", path: "/dream" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>🌙</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">解夢</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          夢是心在夜裡的自言自語。說說你的夢，我們結合榮格心理學的象徵觀點與周公解夢的文化智慧，
          陪你讀懂潛意識想說的話。
        </p>
        <div className="mt-8">
          <Link href="/dream/start" className="btn-gold">🔮 立即解讀我的夢</Link>
        </div>
      </section>

      {/* 兩種視角並陳 */}
      <section className="mt-6" aria-labelledby="school-title">
        <h2 id="school-title" className="divider-star font-serif text-lg font-bold">✦ 兩種視角，一個你 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SCHOOLS.map((s) => (
            <div key={s.title} className="card-mystic p-5">
              <p className="text-2xl" aria-hidden>{s.emoji}</p>
              <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 科普：夢是怎麼形成的 */}
      <section className="mt-12" aria-labelledby="sci-title">
        <h2 id="sci-title" className="divider-star font-serif text-lg font-bold">✦ 我們為什麼會做夢？ ✦</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-ink-300">
          睡眠中的快速動眼期（REM），大腦會重新整理白天的記憶與情緒，
          把散落的畫面、感受與念頭重新剪接，於是形成了夢。
          正因為素材來自你的真實生活，夢才會成為一面折射心情的鏡子——
          它不必逐字解釋，重點是醒來時那份餘韻，往往直指你最在意的事。
        </p>
      </section>

      {/* 你會得到什麼 */}
      <section className="mt-12" aria-labelledby="get-title">
        <h2 id="get-title" className="divider-star font-serif text-lg font-bold">✦ 你會得到的完整解讀 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["🔍", "夢境元素捕捉", "自動辨識你描述中的動物、自然、人物、場景等夢中意象。"],
            ["✨", "象徵意義解析", "每個元素對應的心理象徵，並保留民俗說法作為文化參考。"],
            ["💭", "自我覺察提問", "為每個元素附上一則提問，陪你把夢連結回真實生活。"],
            ["🌙", "綜合心理解讀", "統整夢中線索，給你一段溫柔而完整的整體解讀。"],
          ].map(([emoji, t, d]) => (
            <div key={t} className="card-mystic p-5">
              <p className="text-2xl" aria-hidden>{emoji}</p>
              <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{d}</p>
            </div>
          ))}
        </div>
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
        <h2 className="font-serif text-xl font-bold text-gold-400">昨晚的夢，想對你說什麼？</h2>
        <p className="mt-2 text-sm text-ink-300">寫下你的夢境，一分鐘讀懂潛意識的訊息。</p>
        <div className="mt-5">
          <Link href="/dream/start" className="btn-gold">🌙 免費解夢</Link>
        </div>
      </section>
    </div>
  );
}
