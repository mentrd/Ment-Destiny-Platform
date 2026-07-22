import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMeta, SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "免責聲明",
  description: "星語命理免責聲明：本平台所有算命與命理內容僅供娛樂、文化與自我探索參考。",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "免責聲明", path: "/disclaimer" }]} />
      <h1 className="font-serif text-3xl font-bold text-gradient-gold">免責聲明</h1>

      <div className="prose-mystic mt-6">
        <p>
          {SITE.name}（以下稱「本平台」）所提供之塔羅占卜、八字、紫微斗數、占星、姓名學、生命靈數、
          易經卜卦、靈籤、運勢、配對、解夢、手面相等所有內容，均為
          <strong>娛樂、文化推廣與自我探索用途</strong>。請以輕鬆的心情體驗，並理解以下事項：
        </p>
        <ul>
          <li><strong>非專業建議</strong>：所有測算結果不構成醫療、心理治療、法律、財務或投資建議。</li>
          <li><strong>健康問題請就醫</strong>：任何身體或心理不適，請諮詢合格醫療人員，切勿以任何命理內容替代正規醫療。</li>
          <li><strong>重大決策請審慎</strong>：婚姻、置產、投資、職涯等重大決定，請綜合客觀資訊與專業意見判斷，切勿單憑測算結果行事。</li>
          <li><strong>結果非承諾</strong>：本平台不保證、也從不宣稱任何結果能預測未來、帶來財富或改變感情關係。</li>
          <li><strong>理性看待吉凶</strong>：籤詩、卦象與運勢中的「吉凶」是傳統文化中的提醒語彙，並非對現實的判定。</li>
          <li><strong>自我探索工具</strong>：我們鼓勵您把這些古老的符號系統當作認識自己、整理思緒的鏡子——最終做決定的，永遠是您自己。</li>
        </ul>
        <p>若您在使用過程中感到持續的焦慮或困擾，建議暫停使用，並與信任的親友或專業人士聊聊。</p>
      </div>
    </div>
  );
}
