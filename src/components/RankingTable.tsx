"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { RankingAgent } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";

type SortKey = "totalRevenue" | "successRate" | "uniqueBuyerCount" | "rating";

const categoryMap: Record<string, string> = {
  ON_CHAIN: "온체인",
  HYBRID: "하이브리드",
  OFF_CHAIN: "오프체인",
  "IP MIRROR": "IP 미러",
  ENTERTAINMENT: "엔터테인먼트",
  INFORMATION: "정보",
  PRODUCTIVITY: "생산성",
  NONE: "미분류",
  SOCIAL: "소셜",
  GAMING: "게임",
  DEFI: "디파이",
};

function categoryLabel(c: string) {
  return categoryMap[c] ?? c;
}

const PAGE_SIZE = 20;

export default function RankingTable({ agents }: { agents: RankingAgent[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("totalRevenue");
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(0);

  const categories = useMemo(() => [...new Set(agents.map((a) => a.category).filter(Boolean))], [agents]);

  const filtered = useMemo(() => {
    let list = agents;
    if (!showAll) list = list.filter((a) => (a.totalRevenue ?? 0) > 0);
    if (search) list = list.filter((a) => a.agentName?.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter((a) => a.category === category);
    list = [...list].sort((a, b) => {
      const diff = (a[sortKey] ?? 0) - (b[sortKey] ?? 0);
      return sortAsc ? diff : -diff;
    });
    return list;
  }, [agents, search, category, sortKey, sortAsc, showAll]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when filters change
  useMemo(() => setPage(0), [search, category, showAll, sortKey, sortAsc]);

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
          placeholder="에이전트 검색..."
          className="bg-black/40 border border-border rounded-lg px-3 py-2 text-sm font-mono flex-1 focus:outline-none focus:border-cyan-neon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-black/40 border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-neon"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">전체 카테고리</option>
          {categories.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
        </select>
        <button
          className={`px-3 py-2 text-sm font-mono rounded-lg border transition-colors ${showAll ? "border-cyan-neon text-cyan-neon" : "border-border text-text-secondary hover:border-cyan-neon"}`}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "수익 > 0만" : "전체 보기"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <thead className="text-text-secondary text-xs uppercase border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left">순위</th>
              <th className="px-3 py-2 text-left">에이전트</th>
              {hdr("수익", "totalRevenue")}
              {hdr("성공률", "successRate")}
              {hdr("바이어", "uniqueBuyerCount")}
              {hdr("평점", "rating")}
            </tr>
          </thead>
          <tbody>
            {paged.map((a, i) => (
              <tr key={a.agentId} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                <td className="px-3 py-3 text-text-secondary">{page * PAGE_SIZE + i + 1}</td>
                <td className="px-3 py-3">
                  <Link href={`/agent/${a.agentId}`} className="flex items-center gap-2 hover:text-cyan-neon transition-colors">
                    {a.profilePic && <img src={a.profilePic} alt="" className="w-6 h-6 rounded-full" />}
                    <span className="truncate max-w-[200px]">{a.agentName}</span>
                    <span className="text-xs text-text-secondary">{categoryLabel(a.category)}</span>
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
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm font-mono text-text-secondary">
        <span>{filtered.length}개 중 {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border border-border hover:border-cyan-neon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >이전</button>
          <button
            className="px-3 py-1 rounded border border-border hover:border-cyan-neon disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >다음</button>
        </div>
      </div>
    </div>
  );
}
