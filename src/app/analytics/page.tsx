"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { fetchRanking, type RankingAgent } from "@/lib/api";

const CategoryPieChart = dynamic(() => import("@/components/Charts").then((m) => m.CategoryPieChart), { ssr: false });
const RevenueBarChart = dynamic(() => import("@/components/Charts").then((m) => m.RevenueBarChart), { ssr: false });
const SuccessRevenueScatter = dynamic(() => import("@/components/Charts").then((m) => m.SuccessRevenueScatter), { ssr: false });
const RoleDistribution = dynamic(() => import("@/components/Charts").then((m) => m.RoleDistribution), { ssr: false });

export default function AnalyticsPage() {
  const [agents, setAgents] = useState<RankingAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking().then((data) => { setAgents(data); setLoading(false); });
  }, []);

  if (loading) return <main><p className="text-text-secondary font-mono">로딩 중...</p></main>;
  if (!agents.length) return <main><p className="text-text-secondary font-mono">데이터 없음</p></main>;

  return (
    <main>
      <h1 className="text-2xl font-bold font-mono mb-6">
        <span className="text-cyan-neon glow-cyan">분석</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CategoryPieChart agents={agents} />
        <RevenueBarChart agents={agents} />
        <SuccessRevenueScatter agents={agents} />
        <RoleDistribution agents={agents} />
      </div>
    </main>
  );
}
