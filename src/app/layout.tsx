import type { Metadata } from "next";
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-heading",
  display: "swap",
});

// 本番ドメインが未確定のため、NEXT_PUBLIC_SITE_URL未設定時はmetadataBase自体を省略する
// （URLを創作しない）。設定方法はsrc/lib/site-config.tsを参照。
const SITE_DESCRIPTION =
  "くらべて、自分の軸でえらぶ。「えらぶ。」は、独自指標AXIS SCORE™で「結局どっちを選べばいいか」に結論を出す比較サイトです。";

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${zenKaku.variable}`}>
      <body className="bg-brand-bg font-body text-brand-ink antialiased">
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
