import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "인사이트 | Insights",
  description: "AI 기반 Virtuals Protocol 에이전트 시장 분석 리포트.",
  openGraph: {
    title: "Virtuals Insights",
    description: "AI-powered market analysis reports for Virtuals Protocol agents.",
  },
};

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
