"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ScatterChart, Scatter, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import type { RankingAgent } from "@/lib/api";

const COLORS = ["#00FFD1", "#8B5CF6", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#10B981", "#F97316"];

export function CategoryPieChart({ agents }: { agents: RankingAgent[] }) {
  const data = Object.entries(
    agents.reduce((acc, a) => { acc[a.category || "Unknown"] = (acc[a.category || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-mono text-text-secondary uppercase mb-4">카테고리 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={((props: Record<string, unknown>) => `${props.name ?? ""} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`) as never} labelLine={false} fontSize={11}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(0,255,209,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueBarChart({ agents }: { agents: RankingAgent[] }) {
  const data = [...agents].sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0)).slice(0, 20)
    .map((a) => ({ name: a.agentName?.slice(0, 12) ?? "", revenue: a.totalRevenue ?? 0 }));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-mono text-text-secondary uppercase mb-4">수익 상위 20</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} angle={-45} textAnchor="end" height={80} />
          <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <Tooltip contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(0,255,209,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }} />
          <Bar dataKey="revenue" fill="#00FFD1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SuccessRevenueScatter({ agents }: { agents: RankingAgent[] }) {
  const data = agents.filter((a) => a.totalRevenue > 0).map((a) => ({
    x: (a.successRate ?? 0) * 100,
    y: a.totalRevenue ?? 0,
    name: a.agentName,
  }));

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-mono text-text-secondary uppercase mb-4">성공률 vs 수익</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="x" name="성공률 %" tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <YAxis dataKey="y" name="수익" tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <Tooltip contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} fill="#8B5CF6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RoleDistribution({ agents }: { agents: RankingAgent[] }) {
  const data = Object.entries(
    agents.reduce((acc, a) => { acc[a.role || "Unknown"] = (acc[a.role || "Unknown"] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-mono text-text-secondary uppercase mb-4">역할 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#94a3b8" }} width={100} />
          <Tooltip contentStyle={{ background: "#0a0a0f", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }} />
          <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
