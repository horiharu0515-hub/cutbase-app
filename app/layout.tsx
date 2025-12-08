import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
// さっき作った門番を読み込み
import AuthGuard from "./components/AuthGuard";

const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "CutBase | 動画編集者のためのSNS",
  description: "つくる人が、つながる場所。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        {/* アプリ全体を門番で包む */}
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}