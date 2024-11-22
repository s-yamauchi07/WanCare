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
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex justify-center min-h-screen`}>
          <div className="w-main min-h-screen bg-main flex justify-center">
            {children}
          </div>
          <Menu />
      </body>
    </html>
  );
}
