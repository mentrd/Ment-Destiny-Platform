# 🔮 星語命理 StarWhisper — 整合式線上算命平台

整合 **塔羅、八字、紫微斗數、西洋占星、星座生肖運勢、姓名學、生命靈數、易經卜卦、線上抽籤、愛情配對、解夢、手面相** 十二大功能的響應式命理網站，含會員系統與後台內容管理。

> 定位：娛樂、文化與自我探索。所有結果不構成醫療、法律、投資等專業建議。

## 快速開始

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 產線建置
```

## 後台管理

- 路徑：`/admin`（登入頁 `/admin/login`）
- 預設帳密：`admin` / `starwhisper2026`（**正式環境務必以環境變數覆蓋**）

## 環境變數（.env.local）

| 變數 | 說明 | 預設 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 站台網址（SEO canonical / sitemap） | `http://localhost:3000` |
| `AUTH_SECRET` | Session 簽章密鑰（正式環境必改） | dev 內建值 |
| `ADMIN_USER` / `ADMIN_PASS` | 後台管理員帳密 | `admin` / `starwhisper2026` |

## 專案結構

```
docs/                     # 交付文件：競品分析、規格書、IA、UI/UX
src/
  app/                    # 頁面（App Router）
    [12 大功能]/           # 各功能：介紹頁 / start 輸入頁 / result 結果頁
    horoscope/            # 每日/每週/每月運勢 + 生肖
    articles/             # 命理知識文章
    me/                   # 會員中心、歷史紀錄、收藏
    admin/                # 後台管理（獨立登入）
    api/                  # auth / history / favorites / stats / admin API
  components/             # 共用元件（ResultShell、RitualLoading、分享…）
  lib/
    engines/              # 命理演算引擎與內容資料庫（純 TS，無外部依賴）
    db.ts                 # JSON 檔案資料庫（data/db、data/content）
data/
  db/                     # 會員、紀錄、統計（執行時自動建立）
  content/                # 後台覆寫的內容（塔羅牌義、籤詩、文案、文章…）
```

## 資料與隱私設計

- 未登入者的測算紀錄只存瀏覽器 localStorage，不上傳伺服器
- 手相/面相照片**僅於瀏覽器端讀取**，絕不上傳、不保存
- 會員密碼以 scrypt 加鹽雜湊；會員可自行刪除紀錄與帳號
- 分享連結僅含重現結果所需的最小參數（`?d=` URL-safe Base64）

## 交付文件

| 文件 | 路徑 |
|---|---|
| 競品網站與功能分析 | `docs/01-競品分析.md` |
| 網站功能規格書 | `docs/02-功能規格書.md` |
| 資訊架構與使用流程圖 | `docs/03-資訊架構與使用流程.md` |
| UI／UX 設計 | `docs/04-UI-UX設計.md` |
