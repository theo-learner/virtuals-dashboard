import { NextResponse } from "next/server";
import { fetchRanking } from "@/lib/api";

export interface CategoryScore {
  category: string;
  categoryKo: string;
  agentCount: number;
  totalRevenue: number;
  avgRevenue: number;
  avgSuccessRate: number;
  avgBuyers: number;
  totalBuyers: number;
  avgRating: number;
  topAgent: string;
  /** Higher = more opportunity */
  gapScore: number;
  revenuePerAgent: number;
  competitionIndex: number;
  demandIndex: number;
  signals: string[];
}

const categoryKoMap: Record<string, string> = {
  ON_CHAIN: "온체인",
  HYBRID: "하이브리드",
  OFF_CHAIN: "오프체인",
  ENTERTAINMENT: "엔터테인먼트",
  INFORMATION: "정보",
  PRODUCTIVITY: "생산성",
  SOCIAL: "소셜",
  GAMING: "게임",
  DEFI: "디파이",
  "IP MIRROR": "IP 미러",
  NONE: "미분류",
};

export async function GET() {
  try {
    const agents = await fetchRanking();
    if (!agents.length) {
      return NextResponse.json({ error: "데이터 없음" }, { status: 500 });
    }

    // --- Aggregate by category ---
    const catMap: Record<string, {
      count: number;
      revenue: number;
      successSum: number;
      buyersSum: number;
      ratingSum: number;
      topRevenue: number;
      topAgent: string;
      agents: typeof agents;
    }> = {};

    for (const a of agents) {
      const cat = a.category || "NONE";
      if (!catMap[cat]) {
        catMap[cat] = { count: 0, revenue: 0, successSum: 0, buyersSum: 0, ratingSum: 0, topRevenue: 0, topAgent: "", agents: [] };
      }
      const c = catMap[cat];
      c.count++;
      c.revenue += a.totalRevenue ?? 0;
      c.successSum += a.successRate ?? 0;
      c.buyersSum += a.uniqueBuyerCount ?? 0;
      c.ratingSum += a.rating ?? 0;
      c.agents.push(a);
      if ((a.totalRevenue ?? 0) > c.topRevenue) {
        c.topRevenue = a.totalRevenue ?? 0;
        c.topAgent = a.agentName;
      }
    }

    // --- Global stats for normalization ---
    const totalAgents = agents.length;
    const totalRevenue = agents.reduce((s, a) => s + (a.totalRevenue ?? 0), 0);
    const totalBuyers = agents.reduce((s, a) => s + (a.uniqueBuyerCount ?? 0), 0);
    const avgRevenueGlobal = totalRevenue / totalAgents;
    const avgBuyersGlobal = totalBuyers / totalAgents;

    // --- Compute Gap Score per category ---
    const results: CategoryScore[] = [];

    for (const [cat, c] of Object.entries(catMap)) {
      if (cat === "NONE") continue; // skip uncategorized

      const avgRevenue = c.revenue / c.count;
      const avgSuccess = c.successSum / c.count;
      const avgBuyers = c.buyersSum / c.count;
      const avgRating = c.ratingSum / c.count;
      const revenuePerAgent = avgRevenue;

      // Competition Index: how crowded (0-100, higher = more competitive)
      const shareOfAgents = c.count / totalAgents;
      const competitionIndex = Math.min(100, shareOfAgents * 300);

      // Demand Index: buyer density & revenue signal (0-100, higher = more demand)
      const buyerRatio = avgBuyers / Math.max(1, avgBuyersGlobal);
      const revenueRatio = avgRevenue / Math.max(1, avgRevenueGlobal);
      const demandIndex = Math.min(100, ((buyerRatio + revenueRatio) / 2) * 50);

      // Gap Score = Demand / Competition (high demand + low competition = opportunity)
      // Bonus for high success rate (validated category)
      const successBonus = avgSuccess > 50 ? 1.2 : avgSuccess > 30 ? 1.0 : 0.8;
      const rawGap = (demandIndex / Math.max(5, competitionIndex)) * successBonus;
      const gapScore = Math.round(rawGap * 100) / 100;

      // Generate signals
      const signals: string[] = [];
      if (demandIndex > 60 && competitionIndex < 30) signals.push("🔥 고수요 저경쟁 — 최고 기회 영역");
      else if (demandIndex > 40 && competitionIndex < 40) signals.push("✅ 양호한 기회 — 수요 대비 경쟁 적절");
      if (avgRevenue > avgRevenueGlobal * 1.5) signals.push("💰 에이전트당 수익 상위 — 높은 수익성 검증됨");
      if (avgBuyers > avgBuyersGlobal * 1.5) signals.push("👥 바이어 밀도 높음 — 활발한 사용자 기반");
      if (c.count < 10) signals.push("🌱 초기 단계 카테고리 — 선점 가능");
      if (competitionIndex > 60) signals.push("⚔️ 과밀 경쟁 — 차별화 필수");
      if (avgSuccess < 30) signals.push("⚠️ 낮은 평균 성공률 — 진입 시 주의");
      if (avgSuccess > 60) signals.push("🎯 높은 성공률 — 카테고리 자체 수요 검증됨");

      results.push({
        category: cat,
        categoryKo: categoryKoMap[cat] ?? cat,
        agentCount: c.count,
        totalRevenue: Math.round(c.revenue * 10) / 10,
        avgRevenue: Math.round(avgRevenue * 10) / 10,
        avgSuccessRate: Math.round(avgSuccess * 10) / 10,
        avgBuyers: Math.round(avgBuyers * 10) / 10,
        totalBuyers: c.buyersSum,
        avgRating: Math.round(avgRating * 10) / 10,
        topAgent: c.topAgent,
        gapScore,
        revenuePerAgent: Math.round(revenuePerAgent * 10) / 10,
        competitionIndex: Math.round(competitionIndex * 10) / 10,
        demandIndex: Math.round(demandIndex * 10) / 10,
        signals,
      });
    }

    // Sort by gapScore descending
    results.sort((a, b) => b.gapScore - a.gapScore);

    return NextResponse.json({
      categories: results,
      meta: {
        totalAgents,
        totalRevenue: Math.round(totalRevenue * 10) / 10,
        totalBuyers,
        avgRevenueGlobal: Math.round(avgRevenueGlobal * 10) / 10,
        avgBuyersGlobal: Math.round(avgBuyersGlobal * 10) / 10,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
