import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "분석 | Analytics",
  description: "Virtuals Protocol AI 에이전트 카테고리 분포, 수익 차트, 성공률 분석.",
  openGraph: {
    title: "Virtuals Analytics",
    description: "Category distribution, revenue charts & success rate analysis.",
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
