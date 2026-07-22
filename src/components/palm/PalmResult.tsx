import {
  GENDER_LABELS,
  HAND_LABELS,
  MODE_LABELS,
  type Gender,
  type Hand,
  type PalmAnalysis,
  type PalmMode,
} from "@/lib/engines/palm";
import ResultShell from "@/components/ResultShell";
import PalmDiagram from "@/components/palm/PalmDiagram";

interface Props {
  analysis: PalmAnalysis;
  mode: PalmMode;
  hand: Hand;
  gender: Gender;
  /** 僅本次於本機上傳時才有；分享連結開啟時為 null，改以示意圖替代 */
  photoPreview: string | null;
}

const PRIVACY_NOTE =
  "你的照片全程僅在本機瀏覽器中讀取與顯示，不會上傳伺服器、不會被保存；分享連結只帶不含照片的分析結果。";

export default function PalmResult({ analysis, mode, hand, gender, photoPreview }: Props) {
  const modeLabel = MODE_LABELS[mode];
  const title = mode === "palm" ? `你的手相解析` : `你的面相解析`;
  const meta =
    mode === "palm"
      ? `${HAND_LABELS[hand]}・${GENDER_LABELS[gender]}`
      : `${GENDER_LABELS[gender]}`;
  const summary = analysis.aspects[0]?.text.slice(0, 80) ?? `${modeLabel}趣味解析`;

  return (
    <ResultShell
      feature="palm"
      featureName="手相面相"
      title={title}
      summary={summary}
      retryHref="/palm/start"
    >
      {/* 標題 */}
      <header className="mb-6 text-center">
        <p className="animate-float-slow text-4xl" aria-hidden>{mode === "palm" ? "🖐️" : "🔮"}</p>
        <h1 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
          <span className="text-gradient-gold">{title}</span>
        </h1>
        <p className="mt-2 text-xs text-mystic-300">{meta}</p>
      </header>

      {/* 照片預覽 或 示意圖替代 */}
      <section aria-label="影像" className="card-mystic overflow-hidden p-4">
        {photoPreview ? (
          <figure className="text-center">
            <div className="mx-auto max-w-xs overflow-hidden rounded-xl border border-gold-500/20">
              {/* 本機 dataURL 預覽，未經伺服器 */}
              <img
                src={photoPreview}
                alt={`你上傳的${modeLabel}照片`}
                className="h-auto w-full object-contain"
              />
            </div>
            <figcaption className="mt-2 text-xs text-ink-500">
              📷 此照片僅顯示於你的瀏覽器，未上傳、未保存
            </figcaption>
          </figure>
        ) : (
          <div className="text-center">
            <div className="mx-auto max-w-[220px]">
              <PalmDiagram mode={mode} legend={[]} />
            </div>
            <p className="mt-2 text-xs text-ink-500">
              從分享連結開啟時不含照片，改以{modeLabel}示意圖呈現。
            </p>
          </div>
        )}
      </section>

      {/* 主線 / 五官 趣味短評 */}
      <section aria-label={mode === "palm" ? "三大主線" : "五官"} className="mt-6">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">
          ✦ {mode === "palm" ? "三大主線" : "五官"}趣味短評 ✦
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {analysis.lines.map((l) => (
            <article key={l.key} className="card-mystic p-5">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>{l.icon}</span>
                <h3 className="font-serif text-lg font-bold text-ink-100">{l.name}</h3>
              </div>
              <p className="mt-1 text-xs text-mystic-300">{l.meaning}</p>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{l.comment}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 四段分析 */}
      <section aria-label="四大面向" className="mt-6">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">✦ 個性・感情・事業・財運 ✦</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {analysis.aspects.map((a) => (
            <article key={a.key} className="card-mystic p-5">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>{a.icon}</span>
                <h3 className="font-serif text-lg font-bold text-gold-400">{a.label}</h3>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{a.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SVG 圖解 */}
      <section aria-label="圖解" className="card-mystic mt-6 p-5">
        <h2 className="divider-star mb-4 font-serif text-lg font-bold">
          ✦ {mode === "palm" ? "手掌主線圖解" : "五官位置圖解"} ✦
        </h2>
        <PalmDiagram
          mode={mode}
          legend={analysis.lines.map((l) => ({
            key: l.key,
            name: l.name,
            icon: l.icon,
            meaning: l.meaning,
          }))}
        />
      </section>

      {/* 隱私聲明 */}
      <section className="mt-6 rounded-2xl border border-mystic-400/30 bg-mystic-500/5 p-5">
        <p className="text-sm font-bold text-mystic-300">🔒 隱私聲明</p>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{PRIVACY_NOTE}</p>
        <p className="mt-2 text-xs leading-relaxed text-ink-500">
          本{modeLabel}解析為傳統相學的趣味重構，僅供娛樂與自我覺察參考，沒有吉凶預言，更不涉及健康診斷。
        </p>
      </section>
    </ResultShell>
  );
}
