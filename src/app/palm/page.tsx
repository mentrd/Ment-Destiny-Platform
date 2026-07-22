import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMeta({
  title: "免費線上手相面相分析｜照片不上傳，本機分析",
  description:
    "上傳手掌或臉部照片，免費取得手相三大主線與面相五官的趣味解析，含個性、感情、事業、財運四大面向。照片全程僅在您的瀏覽器中分析，不上傳、不保存。僅供娛樂參考。",
  path: "/palm",
});

const FAQS = [
  {
    q: "我的照片會被上傳或保存嗎？",
    a: "不會。照片全程只在您的瀏覽器中讀取與顯示，用於本機分析後即結束，不會上傳到任何伺服器，也不會被保存。分享結果時，連結只帶不含照片的分析文字，別人看不到你的照片。",
  },
  {
    q: "手相要看左手還是右手？",
    a: "傳統相學常說「男左女右」，也有一派認為左手看先天、右手看後天發展。其實沒有標準答案，你可以兩隻手都試試，把它當成認識自己的趣味角度就好。",
  },
  {
    q: "手相的三大主線代表什麼？",
    a: "一般看的是生命線（活力與生活態度，不是壽命長短）、智慧線（思考與決策風格）、感情線（情感表達方式）。這些是傳統歸納的說法，本站以正向、鼓勵的角度重新詮釋。",
  },
  {
    q: "面相分析準嗎？可以當真嗎？",
    a: "面相是流傳已久的民俗文化，本站的解析為趣味重構，定位是娛樂與自我覺察，不做吉凶預言，也絕不涉及疾病或健康預測。輕鬆看待、取其鼓勵就好。",
  },
  {
    q: "怎樣的照片分析效果比較好？",
    a: "手相建議在光線充足處，讓掌紋清楚可見；面相則以正面、五官清晰的照片為佳。不過無論照片如何，結果都只是趣味參考，不必太過認真。",
  },
];

export default function PalmPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "手相面相", path: "/palm" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>🖐️</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">手相・面相</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          掌中的紋路、臉上的五官，都是傳統相學眼中的一則故事。
          上傳一張照片，用趣味的角度重新認識此刻的自己。
        </p>
        <div className="mt-8">
          <Link href="/palm/start" className="btn-gold">🔮 立即分析我的手面相</Link>
        </div>
      </section>

      {/* 隱私卡（顯眼） */}
      <section aria-labelledby="privacy-title" className="mt-2">
        <div className="rounded-2xl border border-mystic-400/40 bg-mystic-500/10 p-6 text-center sm:p-8">
          <p className="text-3xl" aria-hidden>📷</p>
          <h2 id="privacy-title" className="mt-2 font-serif text-lg font-bold text-mystic-300">
            你的照片，只屬於你
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-100">
            照片僅在您的瀏覽器中讀取與顯示，
            <span className="font-bold text-gold-300">不會上傳伺服器、不會被保存</span>。
            分析在你的裝置上完成，分享連結也只帶不含照片的結果。
          </p>
        </div>
      </section>

      {/* 你會得到什麼 */}
      <section className="mt-12" aria-labelledby="get-title">
        <h2 id="get-title" className="divider-star font-serif text-lg font-bold">✦ 你會得到的解析 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["🖐️", "手相三大主線", "生命線、智慧線、感情線的趣味短評，附傳統含義說明。"],
            ["🙂", "面相五官解讀", "眉、眼、鼻、口、耳，各給一則正向的性格描述。"],
            ["📖", "四大面向分析", "個性、感情、事業、財運，一次看見四個角度的自己。"],
            ["🎨", "SVG 圖解", "手掌主線位置或五官示意圖，搭配一句話說明其意義。"],
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
        <h2 className="font-serif text-xl font-bold text-gold-400">手中的紋路，藏著怎樣的你？</h2>
        <p className="mt-2 text-sm text-ink-300">上傳照片，一分鐘看見傳統相學眼中的自己。照片絕不上傳。</p>
        <div className="mt-5">
          <Link href="/palm/start" className="btn-gold">🖐️ 免費分析</Link>
        </div>
      </section>
    </div>
  );
}
