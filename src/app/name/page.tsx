import Link from "next/link";
import { pageMeta, faqJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = pageMeta({
  title: "姓名學免費分析｜五格三才、81 數理與新生兒命名",
  description:
    "輸入姓名，免費分析天格、人格、地格、外格、總格五格與三才配置，附 81 數理吉凶批註，解讀個性、事業、感情與財運，並提供新生兒吉利筆畫命名建議。即測即得。",
  path: "/name",
});

const FAQS = [
  {
    q: "姓名學的五格是怎麼算出來的？",
    a: "以姓名每個字的康熙筆畫為基礎：天格為單姓加一（複姓則為兩字相加）、人格為姓氏末字加名首字、地格為名字筆畫和（單名加一）、外格為總格減人格加一、總格為全部筆畫相加。五格各自對應一個數理與五行。",
  },
  {
    q: "三才配置是什麼？",
    a: "三才指天格、人格、地格三者的五行（木火土金水）搭配關係。三者相生流暢視為吉、五行相同為半吉、彼此相剋則較有張力。三才反映先天基礎與性格運勢的整體協調度。",
  },
  {
    q: "81 數理吉凶準嗎？",
    a: "81 數理源自日本熊崎氏姓名學，將 1 到 81 每個數字賦予吉、半吉或凶的意涵。它是流傳已久的文化參考，本站結果定位為娛樂與自我探索，輕鬆看待、取其啟發即可，不構成任何專業建議。",
  },
  {
    q: "如果名字有罕見字算得出來嗎？",
    a: "本站收錄常用繁體字的康熙筆畫；若遇到未收錄的罕見字，會以估算筆畫（12 畫）計算，並在結果中標示提醒你。若你知道正確筆畫，可自行對照調整參考。",
  },
  {
    q: "新生兒命名功能怎麼用？",
    a: "輸入寶寶的姓氏與性別，系統會依五格數理反查出人格、地格、總格皆為吉的筆畫組合，並提供符合筆畫與性別的候選字，讓你挑選喜歡的字自由搭配，作為命名時的靈感參考。",
  },
];

const GRID_INTRO = [
  ["天格", "祖先傳下的姓氏之數，代表先天根基與家世，影響較為間接。"],
  ["人格", "姓名的核心主星，主導個性、才華與一生運勢，是分析重點。"],
  ["地格", "又稱前運，影響三十六歲前的際遇，也反映家庭與感情。"],
  ["外格", "代表社交、人際與外在環境，看你在外的助力與緣分。"],
  ["總格", "又稱後運，主導三十六歲後與一生總體的格局走向。"],
];

export default function NamePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <JsonLd data={faqJsonLd(FAQS)} />
      <Breadcrumbs items={[{ name: "姓名學", path: "/name" }]} />

      {/* Hero */}
      <section className="py-8 text-center sm:py-12">
        <p className="mb-3 animate-float-slow text-5xl" aria-hidden>📜</p>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="text-gradient-gold">姓名學</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-300">
          一筆一畫，都藏著名字的能量。用五格三才與 81 數理，
          看見名字為你設定的性格、事業、感情與財運，也為新生命找一個好名字。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/name/start" className="btn-gold">🔍 分析我的姓名</Link>
          <Link href="/name/start?mode=baby" className="btn-ghost">🍼 新生兒命名</Link>
        </div>
      </section>

      {/* 五格科普 */}
      <section className="mt-6" aria-labelledby="grid-title">
        <h2 id="grid-title" className="divider-star font-serif text-lg font-bold">✦ 姓名五格是什麼？ ✦</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-ink-300">
          姓名學把名字的筆畫換算成五個「格」，每一格對應一個數理與五行，
          分別對應人生的不同面向——
        </p>
        <div className="mt-5 space-y-3">
          {GRID_INTRO.map(([name, desc]) => (
            <div key={name} className="card-mystic flex items-start gap-4 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 font-serif text-base font-bold text-gold-400">
                {name.slice(0, 1)}
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-gold-400">{name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-300">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 三才科普 */}
      <section className="mt-12" aria-labelledby="sancai-title">
        <h2 id="sancai-title" className="divider-star font-serif text-lg font-bold">✦ 三才配置 ✦</h2>
        <div className="card-mystic mt-5 p-6 text-center">
          <p className="font-serif text-2xl font-bold tracking-widest text-gradient-gold">
            天 → 人 → 地
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-300">
            三才是天格、人格、地格三者的五行搭配。當五行層層相生（如木生火、火生土），
            氣場流暢、基礎穩固視為吉；五行相同為半吉，穩定但略缺變化；彼此相剋則張力較大，
            需要多一點磨合。三才反映一個人先天的協調度與整體運勢基調。
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
            <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-gold-300">相生・吉</span>
            <span className="rounded-full border border-mystic-400/40 bg-mystic-500/10 px-3 py-1 text-mystic-300">相同・半吉</span>
            <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-3 py-1 text-rose-400">相剋・凶</span>
          </div>
        </div>
      </section>

      {/* 你會得到什麼 */}
      <section className="mt-12" aria-labelledby="get-title">
        <h2 id="get-title" className="divider-star font-serif text-lg font-bold">✦ 你會得到的完整分析 ✦</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            ["🖐️", "五格數理", "天、人、地、外、總五格的數字、五行與吉凶，一眼看懂格局。"],
            ["🔺", "三才配置", "天人地五行的相生相剋關係與評語，看見先天協調度。"],
            ["📖", "81 數理批註", "每一格對應的 1-81 數理吉凶與詳細意涵解說。"],
            ["💫", "四大面向", "依人格五行解讀個性、事業、感情與財運的原廠設定。"],
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
        <h2 className="font-serif text-xl font-bold text-gold-400">你的名字，藏著什麼樣的能量？</h2>
        <p className="mt-2 text-sm text-ink-300">只要姓名兩個字，一分鐘看見五格三才與數理格局。</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link href="/name/start" className="btn-gold">📜 免費分析姓名</Link>
          <Link href="/name/start?mode=baby" className="btn-ghost">🍼 幫寶寶取名</Link>
        </div>
      </section>
    </div>
  );
}
