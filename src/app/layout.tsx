import type { Metadata } from "next";
import "./globals.css";
import { Sawarabi_Gothic } from "next/font/google";
import Menu from "@/app/_components/Menu";
import './globals.css';

const SawarabiGothic = Sawarabi_Gothic({
  weight: "400",
  subsets: ["latin"]
}) 

export const metadata: Metadata = {
  title: "WanCare",
  description: "小さな変化も見逃さない。犬の健康管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${SawarabiGothic.className} antialiased min-h-screen flex justify-center`}>
          <div className="w-main min-h-full bg-main">
            {children}
          </div>
          <Menu />
      </body>
    </html>
  );
}
