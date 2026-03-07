import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { PageShell } from "@/components/layout/page-shell";

const inter = Inter({ subsets: ["latin"] });
const pressStart2P = Press_Start_2P({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://syncx.app"),
  title: "SyncX | Sync once, publish everywhere",
  description: "SyncX 帮助加密内容创作者将影响力一键同步到 X、币安广场 与更多平台。",
  icons: {
    icon: "/syncx-pixel-icon.png",
  },
  openGraph: {
    images: "/banner-v5.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} ${pressStart2P.variable}`}>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
