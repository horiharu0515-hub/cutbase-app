import type { Metadata } from "next";
// Googleフォントを読み込み（日本語対応）
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// フォントの設定
const notoSansJP = Noto_Sans_JP({ 
  subsets: ["latin"],
  weight: ["400", "700"], // 通常と太字
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
        {children}
      </body>
    </html>
  );
}