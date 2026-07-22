import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileTabBar from "@/components/MobileTabBar";
import Starfield from "@/components/Starfield";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

const notoSans = Noto_Sans_TC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerif = Noto_Serif_TC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

interface SeoConfig {
  siteTitleTemplate?: string;
  defaultDescription?: string;
  ogImageUrl?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  // 後台「SEO 設定」可覆寫全站預設（data/content/seo.json）
  const { readContent } = await import("@/lib/db");
  const seo = await readContent<SeoConfig>("seo", {});
  const defaultTitle =
    seo.siteTitleTemplate?.replace("%s", "").trim() ||
    `${SITE.name}｜免費線上算命：塔羅占卜、八字、紫微斗數、星座運勢`;
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: defaultTitle,
      template: seo.siteTitleTemplate?.includes("%s") ? seo.siteTitleTemplate : `%s｜${SITE.name}`,
    },
    description: seo.defaultDescription || SITE.description,
    keywords: [
      "免費算命", "線上算命", "塔羅占卜", "八字命盤", "紫微斗數",
      "星座運勢", "姓名學", "生命靈數", "易經卜卦", "觀音靈籤", "月老靈籤", "愛情配對",
    ],
    openGraph: {
      siteName: SITE.name,
      locale: "zh_TW",
      type: "website",
      ...(seo.ogImageUrl ? { images: [seo.ogImageUrl] } : {}),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-TW" className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE.name,
            alternateName: SITE.nameEn,
            url: SITE.url,
            description: SITE.description,
            inLanguage: "zh-Hant-TW",
            publisher: {
              "@type": "Organization",
              name: SITE.name,
              url: SITE.url,
            },
          }}
        />
        <Starfield />
        <Header />
        <main className="relative z-10 flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  );
}
