import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";
import JsonLd from "@/components/JsonLd";
import RelatedFeatures from "@/components/RelatedFeatures";
import { LOT_SET_KEYS, LOT_SETS } from "@/lib/engines/lots-data";
import { faqJsonLd, pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "線上抽籤：月老、觀音、關帝、媽祖靈籤",
  description:
    "免費線上求籤：月老靈籤 50 首、觀音靈籤 60 首、關帝靈籤 50 首、媽祖靈籤 60 首。默想問題、線上搖籤、擲筊確認，即得籤詩原文、白話解說、主題解讀與建議，結果僅供娛樂與民俗文化參考。",
  path: "/lots",
});

const RITUAL_STEPS = [
  { title: "靜心", text: "找一個安靜的片刻，深呼吸三次，把紛亂的念頭慢慢放下。" },
  { title: "默想", text: "在心中向神明報上自己想請示的事，一事一問，問得越具體越好。" },
  { title: "搖籤", text: "按「開始搖籤」，誠心等待籤支躍出，就像在廟裡輕搖籤筒一樣。" },
  { title: "擲筊", text: "擲筊請示這支籤是否為給你的指引：聖筊即定籤，笑筊則回去再搖一次。" },
  { title: "讀籤", text: "細讀籤詩與白話解說，把其中的提醒帶回生活裡慢慢印證。" },
];

const FAQS = [
  {
    q: "線上抽籤和到廟裡求籤一樣嗎？",
    a: "本功能仿照傳統求籤流程設計（默想、搖籤、擲筊確認），屬於民俗文化與娛樂性質的體驗，讓你隨時隨地都能靜心求得一支籤。重要決定仍建議多方參考、回到自己的判斷。",
  },
  {
    q: "抽到下籤怎麼辦？",
    a: "下籤是善意的提醒，不是判決。它多半在提示時機尚未成熟、或做法需要調整，把籤詩的建議當作檢視現況的切入點，往往比抽到上籤更有收穫。",
  },
  {
    q: "同一件事可以重複抽嗎？",
    a: "傳統上講究「一事一問、誠心一次」，抽到的籤就是當下的提醒。若之後情境有了新的變化，再帶著新的問題來求籤即可。",
  },
  {
    q: "四套靈籤該怎麼選？",
    a: "月老靈籤主感情姻緣；觀音靈籤主人生總體與心境；關帝靈籤主事業、決斷與是非；媽祖靈籤主平安、出行與家宅。依你想請示的主題選擇即可。",
  },
  {
    q: "抽到的結果可以分享或保存嗎？",
    a: "可以。結果頁網址已含還原參數，複製連結即可讓朋友看到同一支籤，也方便自己日後回顧。",
  },
];

export default function LotsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "線上抽籤", path: "/lots" }]} />

      <header className="text-center">
        <h1 className="font-serif text-3xl font-bold text-gradient-gold sm:text-4xl">線上抽籤</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-300">
          月老、觀音、關帝、媽祖四套靈籤，共 220 首籤詩。默想你的問題、線上搖籤、擲筊確認，
          即可取得籤詩原文、白話解說與溫和的行動建議。
        </p>
      </header>

      {/* 四籤種 */}
      <section className="mt-8">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 選擇你要請示的靈籤 ✦</p>
        <div className="rise-stagger grid gap-4 sm:grid-cols-2">
          {LOT_SET_KEYS.map((key) => {
            const s = LOT_SETS[key];
            return (
              <Link
                key={key}
                href={`/lots/${key}`}
                className="card-mystic card-mystic-hover flex flex-col gap-2 p-5"
              >
                <div className="flex items-center gap-3">
                  <span aria-hidden className="text-3xl">{s.icon}</span>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-ink-100">{s.name}</h2>
                    <p className="text-xs text-ink-500">{s.deity}・共 {s.count} 首</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-ink-300">{s.intro}</p>
                <span className="mt-auto pt-1 text-sm font-medium text-gold-300">誠心求籤 →</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 求籤禮儀 */}
      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 求籤禮儀 ✦</p>
        <ol className="rise-stagger grid gap-3 sm:grid-cols-5">
          {RITUAL_STEPS.map((s, i) => (
            <li key={s.title} className="card-mystic p-4 text-center sm:text-left">
              <span className="font-serif text-lg font-bold text-gold-400">{i + 1}</span>
              <h3 className="mt-1 font-serif font-bold text-ink-100">{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mt-10">
        <p className="divider-star mb-4 text-sm font-semibold">✦ 常見問題 ✦</p>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="card-mystic group p-4">
              <summary className="cursor-pointer list-none font-medium text-ink-100 marker:content-none">
                <span aria-hidden className="mr-2 inline-block text-gold-400 transition-transform group-open:rotate-90">›</span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-ink-300">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <Disclaimer />
      <RelatedFeatures slug="lots" />
    </div>
  );
}
