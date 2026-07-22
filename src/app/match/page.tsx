import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMeta({
  title: "愛情配對免費測｜姓名、生日、星座、生肖緣分指數",
  description:
    "四種免費愛情配對：姓名五行、生日靈數、星座元素與生肖合沖，即時算出你們的緣分指數、相處模式、優勢與注意事項。娛樂與自我探索，一分鐘測給你看。",
  path: "/match",
});

const CARDS = [
  {
    href: "/match/name",
    emoji: "📜",
    title: "姓名配對",
    desc: "以雙方人格五行的相生相剋，看你們個性契合的程度。",
  },
  {
    href: "/match/birthday",
    emoji: "🎂",
    title: "生日配對",
    desc: "用兩人的生命靈數，解讀靈魂頻率與相處的默契。",
  },
  {
    href: "/match/zodiac",
    emoji: "✨",
    title: "星座配對",
    desc: "從星座元素（火土風水）與模式，看你們的化學反應。",
  },
  {
    href: "/match/animal",
    emoji: "🐾",
    title: "生肖配對",
    desc: "依生肖的六合、三合與相沖，測你們的緣分磁場。",
  },
];

const FAQS = [
  {
    q: "愛情配對是怎麼算的？",
    a: "四種配對各有依據：姓名看雙方人格的五行生剋、生日看兩人的生命靈數相容度、星座看元素與模式的搭配、生肖看六合三合與相沖。系統會綜合換算成 0 到 100 的緣分指數與相處建議。",
  },
  {
    q: "分數低就代表沒緣分嗎？",
    a: "當然不是。分數反映的是「先天磁場的契合傾向」，而非感情的成敗。許多低分組合靠著理解與經營反而走得長久；分數只是自我覺察的起點，用心相處才是關鍵。",
  },
  {
    q: "同樣兩個人算出來會一樣嗎？",
    a: "會的。本站配對為確定性計算，相同的輸入一定得到相同的結果與文案，所以你可以把結果連結分享給對方，看到的緣分指數會完全一致。",
  },
  {
    q: "配對結果可以當作交往依據嗎？",
    a: "本站所有結果僅供娛樂、文化與自我探索參考，不構成任何專業建議。感情是兩個人真實相處出來的，別讓一個分數決定你的心意喔。",
  },
];

export default function MatchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "愛情配對", path: "/match" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>💞</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">愛情配對</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          你們的緣分指數，是幾分？姓名、生日、星座、生肖四種角度，
          一分鐘測出你們的相處模式、優勢與需要留意的地方。
        </p>
      </section>

      {/* 四配對卡 */}
      <section aria-label="配對方式" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link key={c.href} href={c.href} className="card-mystic card-mystic-hover flex items-start gap-4 p-5">
            <span className="text-3xl" aria-hidden>{c.emoji}</span>
            <span>
              <span className="block font-serif text-lg font-bold text-gold-400">{c.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-300">{c.desc}</span>
            </span>
          </Link>
        ))}
      </section>

      {/* 說明 */}
      <section className="mt-12" aria-labelledby="how-title">
        <h2 id="how-title" className="divider-star font-serif text-lg font-bold">✦ 一個分數，四種視角 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["📜", "五行相生", "姓名配對以人格五行的木火土金水生剋，看個性的契合。"],
            ["🔢", "靈數頻率", "生日配對用生命靈數的相容矩陣，看靈魂的共振。"],
            ["🌟", "元素搭配", "星座配對從火土風水元素與模式，看化學反應。"],
            ["🀄", "生肖合沖", "生肖配對依六合、三合、相沖，看緣分的磁場。"],
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
        <h2 className="font-serif text-xl font-bold text-gold-400">想知道你們有多合拍？</h2>
        <p className="mt-2 text-sm text-ink-300">選一種配對方式，一分鐘揭曉你們的緣分指數。</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href="/match/name" className="btn-gold">💞 開始配對</Link>
        </div>
      </section>
    </div>
  );
}
