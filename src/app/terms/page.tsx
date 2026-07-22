import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMeta, SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "使用條款",
  description: "星語命理使用條款：使用本平台服務前，請詳細閱讀本服務條款內容。",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "使用條款", path: "/terms" }]} />
      <h1 className="font-serif text-3xl font-bold text-gradient-gold">使用條款</h1>
      <p className="mt-2 text-sm text-ink-500">最後更新日期：2026 年 7 月 19 日</p>

      <div className="prose-mystic mt-6">
        <h2>一、服務內容與定位</h2>
        <p>
          {SITE.name} 提供塔羅占卜、八字命盤、紫微斗數、西洋占星、姓名學、生命靈數、易經卜卦、線上抽籤、
          運勢查詢、愛情配對、解夢及手面相分析等線上互動內容。
          <strong>所有內容均屬娛樂、文化與自我探索性質</strong>，不構成醫療、法律、財務、投資或任何專業建議。
        </p>

        <h2>二、使用規範</h2>
        <ul>
          <li>您應提供真實、正確的註冊資料，並妥善保管帳號密碼。</li>
          <li>不得以自動化程式大量存取本平台，或從事干擾服務運作的行為。</li>
          <li>不得將本平台內容用於詐欺、恐嚇或其他違法用途。</li>
          <li>分享測算結果時，請尊重他人隱私，勿未經同意公開涉及第三人的個人資料。</li>
        </ul>

        <h2>三、智慧財產權</h2>
        <p>
          本平台的介面設計、文案、解讀內容與程式碼均受著作權保護。您可基於個人非商業目的分享測算結果，
          但不得擅自重製、改作或散布本平台之整體內容。
        </p>

        <h2>四、免責事項</h2>
        <ul>
          <li>測算結果由演算法依您的輸入產生，僅供參考，本平台不保證其準確性或適用性。</li>
          <li>您依測算結果所做的任何決定，其後果由您自行承擔。重大決策請諮詢相關領域的專業人士。</li>
          <li>本平台得因維護或不可抗力暫停服務，對因此造成的損失不負賠償責任。</li>
        </ul>

        <h2>五、帳號終止</h2>
        <p>違反本條款者，本平台得暫停或終止其帳號。您亦可隨時於會員中心刪除帳號。</p>

        <h2>六、準據法</h2>
        <p>本條款之解釋與適用，以中華民國法律為準據法。</p>
      </div>
    </div>
  );
}
