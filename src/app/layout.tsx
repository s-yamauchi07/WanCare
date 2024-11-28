import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Menu from "@/app/_components/Menu";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex justify-center`}>
          <div className="w-main min-h-screen bg-main">
            {children}
          </div>
          <Menu />
      </body>
    </html>
  );
}
