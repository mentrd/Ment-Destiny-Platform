import Breadcrumbs from "@/components/Breadcrumbs";
import { pageMeta, SITE } from "@/lib/site";

export const metadata = pageMeta({
  title: "隱私權政策",
  description: "星語命理隱私權政策：說明我們如何蒐集、使用與保護您的個人資料，包含姓名、生日、出生時間、出生地與照片的處理方式。",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ name: "隱私權政策", path: "/privacy" }]} />
      <h1 className="font-serif text-3xl font-bold text-gradient-gold">隱私權政策</h1>
      <p className="mt-2 text-sm text-ink-500">最後更新日期：2026 年 7 月 19 日</p>

      <div className="prose-mystic mt-6">
        <p>
          歡迎使用 {SITE.name}（以下稱「本平台」）。我們非常重視您的隱私。本政策說明我們在您使用各項算命與命理功能時，
          如何蒐集、使用、保存與保護您的個人資料。使用本平台即表示您已閱讀並同意本政策。
        </p>

        <h2>一、我們蒐集哪些資料</h2>
        <ul>
          <li><strong>測算輸入資料</strong>：姓名、出生年月日、出生時間、出生地、性別、您輸入的問題與夢境描述等。</li>
          <li><strong>會員資料</strong>（僅註冊會員）：Email、暱稱、密碼（以不可逆雜湊方式儲存）、您選填的預設生日。</li>
          <li><strong>使用統計</strong>：各功能的使用次數與分享次數。此類統計為匿名彙總，不與特定個人連結。</li>
          <li><strong>照片</strong>：手相與面相功能中您上傳的照片<strong>僅在您的瀏覽器本機讀取與顯示，不會上傳至伺服器，也不會被保存</strong>。</li>
        </ul>

        <h2>二、資料如何被使用與保存</h2>
        <ul>
          <li><strong>未登入使用者</strong>：您的測算輸入與結果僅保存在您瀏覽器的本機儲存空間（localStorage），不會上傳至伺服器。清除瀏覽器資料即可完全刪除。</li>
          <li><strong>登入會員</strong>：您可選擇將測算紀錄與收藏同步至帳號，以便跨裝置查看。這些資料僅用於向您本人提供服務。</li>
          <li>測算輸入資料僅用於即時產生分析結果，<strong>不會用於行銷、廣告投放或提供給第三方</strong>。</li>
          <li>分享連結僅包含呈現結果所需的最小資料，且會員可自行決定是否分享。</li>
        </ul>

        <h2>三、您的權利</h2>
        <ul>
          <li>您可隨時於「會員中心」查詢、更正您的個人資料。</li>
          <li>您可刪除任一筆歷史紀錄與收藏，或一鍵清除全部紀錄。</li>
          <li>您可刪除帳號；刪除後我們將移除您的會員資料及所有測算紀錄，且無法復原。</li>
          <li>未登入者可透過清除瀏覽器資料，移除所有本機保存的紀錄。</li>
        </ul>

        <h2>四、Cookie 與類似技術</h2>
        <p>
          本平台使用必要性 Cookie 維持您的登入狀態（HttpOnly session cookie）。我們不使用追蹤型 Cookie 進行跨站行為分析。
        </p>

        <h2>五、資料安全</h2>
        <p>
          密碼以加鹽雜湊（scrypt）方式儲存，任何人（包含平台管理者）皆無法還原您的原始密碼。
          我們採取合理的技術與管理措施保護您的資料，但請理解沒有任何網路傳輸可保證絕對安全。
        </p>

        <h2>六、未成年人</h2>
        <p>若您未滿 18 歲，請在法定代理人閱讀並同意本政策後再使用本平台。</p>

        <h2>七、政策修訂</h2>
        <p>本政策修訂時將於本頁公告並更新「最後更新日期」。重大變更將於首頁明顯處提示。</p>

        <h2>八、聯絡我們</h2>
        <p>對本政策有任何疑問，或欲行使個資相關權利，請透過「聯絡我們」頁面與我們聯繫。</p>
      </div>
    </div>
  );
}
