"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { RankingAgent } from "@/lib/api";

const CategoryPieChart = dynamic(() => import("@/components/Charts").then((m) => m.CategoryPieChart), { ssr: false });
const RevenueBarChart = dynamic(() => import("@/components/Charts").then((m) => m.RevenueBarChart), { ssr: false });
const SuccessRevenueScatter = dynamic(() => import("@/components/Charts").then((m) => m.SuccessRevenueScatter), { ssr: false });
const RoleDistribution = dynamic(() => import("@/components/Charts").then((m) => m.RoleDistribution), { ssr: false });

export default function AnalyticsPage() {
  const [agents, setAgents] = useState<RankingAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ranking")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAgents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-neon border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary font-mono">데이터 로딩 중...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="text-center py-20">
        <p className="text-red-400 font-mono">오류: {error}</p>
      </main>
    );
  }

  if (!agents.length) {
    return (
      <main className="text-center py-20">
        <p className="text-text-secondary font-mono">데이터 없음</p>
      </main>
    );
  }

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
