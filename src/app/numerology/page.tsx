import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { NUMBER_READINGS } from "@/lib/engines/numerology-copy";

export const metadata = pageMeta({
  title: "生命靈數免費計算｜1-9 靈數與大師數完整解析",
  description:
    "輸入出生年月日，免費計算你的生命靈數（1-9）與大師數 11/22/33，解析性格、天賦、人生課題與感情模式，附九宮格先天數字盤與今年流年運勢。即測即得。",
  path: "/numerology",
});

const FAQS = [
  {
    q: "生命靈數是怎麼計算的？",
    a: "把出生年月日的每一個數字相加，反覆加總到剩下一位數（1-9），就是你的生命靈數。例如 1995 年 8 月 23 日：1+9+9+5+8+2+3=37，3+7=10，1+0=1，生命靈數就是 1。",
  },
  {
    q: "什麼是大師數 11、22、33？",
    a: "在加總過程中，若出現 11、22 或 33，傳統上稱為「大師數」，被認為帶有更強的能量與課題。大師數通常以「11/2」這樣的格式標示：11 是大師數本身，2 是它最終約化的靈數，兩層意義可以一起參考。",
  },
  {
    q: "九宮格數字盤（先天數）是什麼？",
    a: "把出生年月日中出現過的數字 1-9 標在九宮格上，出現過的稱為「先天有的數字」，代表與生俱來的特質能量；沒出現的則是這輩子可以後天補強的面向。有沒有某個數字並沒有好壞之分。",
  },
  {
    q: "流年數又是什麼？",
    a: "流年數以「當年年份＋出生月＋出生日」加總約化而得，每年不同，形成 1 到 9 的九年循環，用來參考今年的能量主題，例如開創、深耕、收成或放下。",
  },
  {
    q: "生命靈數的結果可信嗎？",
    a: "生命靈數源自古希臘畢達哥拉斯學派的數字學，是流傳已久的自我探索工具。本站結果定位為娛樂、文化與自我認識參考，不構成任何專業建議，輕鬆看待、取其啟發就好。",
  },
];

const DEMO_STEPS = [
  { label: "寫下出生日期", value: "1995 / 8 / 23" },
  { label: "全部數字相加", value: "1+9+9+5+8+2+3 = 37" },
  { label: "繼續加總", value: "3+7 = 10 → 1+0 = 1" },
  { label: "得到生命靈數", value: "1・開創者" },
];

export default function NumerologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "生命靈數", path: "/numerology" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>🔢</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">生命靈數</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          你的生日不只是日期，更是一組寫給你的密碼。
          用一分鐘算出你的生命靈數，看見性格、天賦、人生課題與感情模式的原廠設定。
        </p>
        <div className="mt-8">
          <Link href="/numerology/start" className="btn-gold">🔮 立即計算我的靈數</Link>
        </div>
      </section>

      {/* 計算原理 */}
      <section className="mt-6" aria-labelledby="how-title">
        <h2 id="how-title" className="divider-star font-serif text-lg font-bold">✦ 生命靈數怎麼算？ ✦</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-ink-300">
          生命靈數源自兩千五百年前的畢達哥拉斯數字學：把出生年月日的每個數字相加，
          反覆加總到剩下一位數（1-9）。以 1995 年 8 月 23 日為例——
        </p>
        <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {DEMO_STEPS.map((s, i) => (
            <li key={s.label} className="card-mystic p-4 text-center">
              <span className="font-serif text-xl font-bold text-gold-500/70">{i + 1}</span>
              <p className="mt-1 text-xs text-mystic-300">{s.label}</p>
              <p className="mt-1.5 font-serif text-sm font-bold text-ink-100">{s.value}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-ink-500">
          加總過程若出現 11、22、33，即為能量特別強的「大師數」，會以 11/2、22/4、33/6 的格式一併解讀。
        </p>
      </section>

      {/* 九數速覽 */}
      <section className="mt-12" aria-labelledby="numbers-title">
        <h2 id="numbers-title" className="divider-star font-serif text-lg font-bold">✦ 九個靈數，九種靈魂 ✦</h2>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
            <div key={n} className="card-mystic flex flex-col items-center gap-1 px-2 py-4 text-center">
              <span className="font-serif text-3xl font-bold text-gold-400" aria-hidden>{n}</span>
              <span className="text-sm font-bold text-ink-100">{NUMBER_READINGS[n].title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 你會得到什麼 */}
      <section className="mt-12" aria-labelledby="get-title">
        <h2 id="get-title" className="divider-star font-serif text-lg font-bold">✦ 你會得到的完整解讀 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["✨", "生命靈數與稱號", "你的主靈數 1-9（含大師數 11/22/33），與它代表的靈魂原型。"],
            ["🔲", "九宮格先天數字盤", "生日中出現過的數字亮起，一眼看見與生俱來的能量配置。"],
            ["📖", "四大面向分析", "性格、天賦、人生課題與感情模式，完整認識自己的原廠設定。"],
            ["🗓️", "今年流年數", "九年循環中你正走到哪一站？看見今年的能量主題與建議。"],
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
        <h2 className="font-serif text-xl font-bold text-gold-400">你的生日，藏著什麼數字密碼？</h2>
        <p className="mt-2 text-sm text-ink-300">只要出生年月日，一分鐘解開你的生命靈數。</p>
        <div className="mt-5">
          <Link href="/numerology/start" className="btn-gold">🔢 免費計算</Link>
        </div>
      </section>
    </div>
  );
}
