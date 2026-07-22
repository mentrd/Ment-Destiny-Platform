import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMeta({
  title: "易經卜卦｜免費線上占卜起卦",
  description:
    "免費線上易經卜卦：擲幣、報數字或以此刻時間起卦，即得六十四卦本卦、動爻爻辭與變卦解析，附卦辭原文與白話總解、行動建議。誠心一問，看見此刻該進該守。",
  path: "/iching",
});

const FAQS = [
  {
    q: "易經卜卦是什麼？準嗎？",
    a: "易經卜卦是流傳三千年的中華古老智慧，以六十四卦象徵天地人事的各種處境與變化。它的價值不在「預言」，而在於幫你跳出當下的思緒，換一個角度看清處境與心念。本站結果定位為娛樂、文化與自我探索參考，不構成任何專業建議，輕鬆看待、取其啟發就好。",
  },
  {
    q: "什麼是本卦、動爻與變卦？",
    a: "起卦後得到的卦叫「本卦」，代表事情當下的整體處境。六爻之中變動的爻稱為「動爻」，是變化的關鍵所在；動爻爻辭往往就是這一卦要對你說的重點。動爻翻轉後形成的新卦稱為「變卦」，象徵情勢將往哪個方向發展。若六爻皆安定、無動爻，則以本卦卦辭為主要參考。",
  },
  {
    q: "三種起卦方式有什麼不同？該選哪一種？",
    a: "擲幣起卦沿用古法以三枚銅錢擲六次成卦，最有儀式感；數字起卦取自梅花易數，憑直覺報出三個數字即可成卦，最為快速；時間起卦以問題浮現的此刻年月日時起卦，講究「當下即徵兆」。三者並無高下之分，選一個你最有感覺的即可，重點始終是誠心。",
  },
  {
    q: "占卜前要注意什麼？",
    a: "一事一問、問得越具體越好，避免一次問太多事情。心態上宜「不誠不占、不疑不占」——想清楚真正想問的，再誠心默念問題後起卦。同一件事不宜反覆重複占問，第一次得到的卦通常最為清晰。",
  },
  {
    q: "占到不好的卦怎麼辦？",
    a: "易經沒有絕對的「壞卦」。每一卦都同時描述處境與應對之道，看似艱難的卦往往正提醒你此刻宜守、宜慎、宜等待時機。卦象呈現的是趨勢與心法，真正的決定與行動仍在你自己手中。",
  },
];

const METHODS = [
  {
    icon: "🪙",
    title: "擲幣起卦",
    desc: "沿用古法，以三枚銅錢擲六次、由下而上逐爻成卦。最具儀式感，適合想靜心慢慢求卦的你。",
  },
  {
    icon: "🔢",
    title: "數字起卦",
    desc: "取自梅花易數，憑直覺報出三個數字（1–999），即刻定出上卦、下卦與動爻。快速直接。",
  },
  {
    icon: "🕐",
    title: "時間起卦",
    desc: "以問題浮現的「此刻」年月日時起卦——念頭湧現的那一刻，本身就是天地給的徵兆。",
  },
];

export default function IchingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "易經卜卦", path: "/iching" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>☯</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">易經卜卦</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          三千年的古老智慧，濃縮於六十四卦。
          誠心默念心中的一個問題，起一卦，看見此刻的處境、變化的關鍵，以及該進、該守的方向。
        </p>
        <div className="mt-8">
          <Link href="/iching/start" className="btn-gold">☯ 立即誠心起卦</Link>
        </div>
      </section>

      {/* 易經與六十四卦科普 */}
      <section className="mt-6" aria-labelledby="about-title">
        <h2 id="about-title" className="divider-star font-serif text-lg font-bold">✦ 易經與六十四卦 ✦</h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-300">
          <p>
            《易經》是中華文化最古老的典籍之一，以陰爻（⚋）與陽爻（⚊）兩種符號為基礎，三爻疊成八卦、
            兩卦相重成六十四卦。每一卦都以一種「情境」象徵天地人事的處境與變化，配上凝練的卦辭與爻辭，
            兩千多年來被無數人用來映照心念、輔助抉擇。
          </p>
          <p>
            卜卦時起出的卦叫「<span className="text-gold-300">本卦</span>」，描述事情當下的整體樣貌；
            其中變動的爻稱為「<span className="text-gold-300">動爻</span>」，是變化的樞紐，動爻爻辭往往就是這一卦最想提醒你的話；
            動爻翻轉後形成的新卦則是「<span className="text-gold-300">變卦</span>」，象徵情勢將往哪個方向推移。
            若六爻皆安定、無動爻，便以本卦卦辭為主。
          </p>
        </div>
      </section>

      {/* 三種起卦方式 */}
      <section className="mt-12" aria-labelledby="methods-title">
        <h2 id="methods-title" className="divider-star font-serif text-lg font-bold">✦ 三種起卦方式 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {METHODS.map((m) => (
            <div key={m.title} className="card-mystic p-5 text-center">
              <p className="text-3xl" aria-hidden>{m.icon}</p>
              <h3 className="mt-2 font-serif text-lg font-bold text-gold-400">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 求卦心態提醒 */}
      <section className="mt-12" aria-labelledby="mindset-title">
        <h2 id="mindset-title" className="divider-star font-serif text-lg font-bold">✦ 求卦前，先靜一靜心 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["🎯", "一事一問", "一次只問一件事，問得越具體，卦象越能為你對焦。"],
            ["🙏", "誠心默念", "不誠不占、不疑不占。想清楚真正想問的，再誠心默念後起卦。"],
            ["🔁", "不重複占問", "同一件事不宜反覆求問，第一次得到的卦通常最清晰。"],
            ["🌱", "沒有壞卦", "看似艱難的卦，往往正提醒你此刻宜守、宜慎、宜等待時機。"],
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
        <h2 className="font-serif text-xl font-bold text-gold-400">此刻，你心中有什麼想問的？</h2>
        <p className="mt-2 text-sm text-ink-300">誠心默念一個問題，起一卦，看見該進該守的方向。</p>
        <div className="mt-5">
          <Link href="/iching/start" className="btn-gold">☯ 免費起卦</Link>
        </div>
      </section>
    </div>
  );
}
