import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClientErrorBoundary } from "@/components/ClientErrorBoundary";
import { LocaleProvider } from "@/lib/LocaleContext";

export const metadata: Metadata = {
  title: {
    default: "버추얼스 프로토콜 대시보드 | Virtuals Protocol aGDP",
    template: "%s | Virtuals Dashboard",
  },
  description: "버추얼스 프로토콜 aGDP 리더보드 & AI 에이전트 분석 대시보드. 실시간 랭킹, 수익, 성공률 모니터링.",
  keywords: ["Virtuals Protocol", "aGDP", "AI Agent", "Leaderboard", "Dashboard", "버추얼스", "에이전트"],
  authors: [{ name: "Virtuals Dashboard" }],
  metadataBase: new URL("https://virtuals-dashboard.vercel.app"),
  openGraph: {
    title: "Virtuals Protocol aGDP Dashboard",
    description: "Real-time AI agent rankings, revenue analytics & insights for the Virtuals Protocol ecosystem.",
    url: "https://virtuals-dashboard.vercel.app",
    siteName: "Virtuals Dashboard",
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtuals Protocol aGDP Dashboard",
    description: "Real-time AI agent rankings & analytics for Virtuals Protocol.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-accent-primary focus:text-white focus:px-4 focus:py-2 focus:rounded">Skip to content</a>
        <LocaleProvider>
          <Navbar />
          <ClientErrorBoundary>
            {children}
          </ClientErrorBoundary>
        </LocaleProvider>
      </body>
    </html>
  );
}
