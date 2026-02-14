"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { RankingAgent } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";

type SortKey = "totalRevenue" | "successRate" | "uniqueBuyerCount" | "rating";

export default function RankingTable({ agents }: { agents: RankingAgent[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("totalRevenue");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(() => [...new Set(agents.map((a) => a.category).filter(Boolean))], [agents]);

  const filtered = useMemo(() => {
    let list = agents;
    if (search) list = list.filter((a) => a.agentName?.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter((a) => a.category === category);
    list = [...list].sort((a, b) => {
      const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [agents, search, category, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const hdr = (label: string, key: SortKey) => (
    <th className="px-3 py-2 cursor-pointer hover:text-cyan-neon transition-colors text-right" onClick={() => toggleSort(key)}>
      {label} {sortKey === key ? (sortAsc ? "↑" : "↓") : ""}
    </th>
  );

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          placeholder="Search agents..."
          className="bg-black/40 border border-border rounded-lg px-3 py-2 text-sm font-mono flex-1 focus:outline-none focus:border-cyan-neon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-black/40 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-neon"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead className="text-text-secondary text-xs uppercase border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Agent</th>
              {hdr("Revenue", "totalRevenue")}
              {hdr("Success", "successRate")}
              {hdr("Buyers", "uniqueBuyerCount")}
              {hdr("Rating", "rating")}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 100).map((a, i) => (
              <tr key={a.agentId} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                <td className="px-3 py-3 text-text-secondary">{i + 1}</td>
                <td className="px-3 py-3">
                  <Link href={`/agent/${a.agentId}`} className="flex items-center gap-2 hover:text-cyan-neon transition-colors">
                    {a.profilePic && <img src={a.profilePic} alt="" className="w-6 h-6 rounded-full" />}
                    <span className="truncate max-w-[200px]">{a.agentName}</span>
                  </Link>
                </td>
                <td className="px-3 py-3 text-right text-cyan-neon">{formatNumber(a.totalRevenue ?? 0)}</td>
                <td className="px-3 py-3 text-right">{formatPercent(a.successRate ?? 0)}</td>
                <td className="px-3 py-3 text-right">{a.uniqueBuyerCount ?? 0}</td>
                <td className="px-3 py-3 text-right text-violet-accent">{(a.rating ?? 0).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
