"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { RankingAgent } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";
import { t } from "@/lib/i18n";

type SortKey = "totalRevenue" | "successRate" | "uniqueBuyerCount" | "rating";
type ViewMode = "table" | "card";

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
  const [viewMode, setViewMode] = useState<ViewMode>("table");

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

  useMemo(() => setPage(0), [search, category, showAll, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const hdr = (label: string, key: SortKey) => (
    <th className="px-3 py-2 cursor-pointer hover:text-accent-primary transition-colors text-right" onClick={() => toggleSort(key)}>
      {label} {sortKey === key ? (sortAsc ? "↑" : "↓") : ""}
    </th>
  );

  const pillBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      className={`px-4 py-2 text-xs font-mono rounded-full border transition-all ${
        active
          ? "border-accent-primary bg-accent-primary/20 text-accent-primary"
          : "border-border text-text-secondary hover:border-accent-primary/50 hover:text-text-primary"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="glass-card p-5">
      {/* Search & Filters */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              placeholder={t("common.search")}
              aria-label={t("common.search")}
              className="w-full bg-black/30 border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent-primary transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="bg-black/30 border border-border rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-accent-primary transition-colors"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label={t("common.allCategories")}
          >
            <option value="">{t("common.allCategories")}</option>
            {categories.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
          </select>
        </div>

        {/* Pill filters + view toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {pillBtn(showAll ? t("common.revenuePositive") : t("common.all"), true, () => setShowAll(!showAll))}
          </div>
          <div className="flex gap-1 bg-black/30 rounded-xl p-1 border border-border">
            <button
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${viewMode === "table" ? "bg-accent-primary/20 text-accent-primary" : "text-text-secondary hover:text-text-primary"}`}
              onClick={() => setViewMode("table")}
              title="테이블 뷰"
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
            >☰</button>
            <button
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${viewMode === "card" ? "bg-accent-primary/20 text-accent-primary" : "text-text-secondary hover:text-text-primary"}`}
              onClick={() => setViewMode("card")}
              title="카드 뷰"
              aria-label="Card view"
              aria-pressed={viewMode === "card"}
            >⊞</button>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-mono">
            <thead className="text-text-secondary text-xs uppercase border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left">{t("table.rank")}</th>
                <th className="px-3 py-2 text-left">{t("table.agent")}</th>
                {hdr(t("table.revenue"), "totalRevenue")}
                {hdr(t("table.successRate"), "successRate")}
                {hdr(t("table.buyers"), "uniqueBuyerCount")}
                {hdr(t("table.rating"), "rating")}
              </tr>
            </thead>
            <tbody>
              {paged.map((a, i) => (
                <tr key={a.agentId} className="border-b border-border/30 hover:bg-accent-primary/5 transition-colors">
                  <td className="px-3 py-3 text-text-secondary">{page * PAGE_SIZE + i + 1}</td>
                  <td className="px-3 py-3">
                    <Link href={`/agent/${a.agentId}`} className="flex items-center gap-2 hover:text-accent-primary transition-colors">
                      {a.profilePic && <Image src={a.profilePic} alt={a.agentName || ""} width={28} height={28} className="w-7 h-7 rounded-full ring-1 ring-accent-primary/30" loading="lazy" />}
                      <div className="flex flex-col">
                        <span className="truncate max-w-[200px]">{a.agentName}</span>
                        <span className="text-xs text-text-secondary">{categoryLabel(a.category)}</span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3 text-right text-accent-primary font-semibold">{formatNumber(a.totalRevenue ?? 0)}</td>
                  <td className="px-3 py-3 text-right">
                    <span className={`${(a.successRate ?? 0) > 0.7 ? "text-accent-green" : "text-text-secondary"}`}>
                      {formatPercent(a.successRate ?? 0)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">{a.uniqueBuyerCount ?? 0}</td>
                  <td className="px-3 py-3 text-right text-violet-accent">{(a.rating ?? 0).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View */}
      {viewMode === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {paged.map((a, i) => (
            <Link
              key={a.agentId}
              href={`/agent/${a.agentId}`}
              className="glass-card p-4 flex items-center gap-4 hover:border-accent-primary/40 transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-transparent pointer-events-none" />
              <div className="relative flex-shrink-0">
                {a.profilePic ? (
                  <Image src={a.profilePic} alt={a.agentName || ""} width={48} height={48} className="w-12 h-12 rounded-xl ring-2 ring-accent-primary/20 group-hover:ring-accent-primary/50 transition-all" loading="lazy" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-accent-primary/15 flex items-center justify-center text-lg">🤖</div>
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-bg-primary ${(a.successRate ?? 0) > 0.7 ? "bg-accent-green" : (a.successRate ?? 0) > 0.3 ? "bg-yellow-500" : "bg-error"}`} />
              </div>
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold truncate text-sm">{a.agentName}</span>
                  <span className="text-xs text-text-secondary ml-2">#{page * PAGE_SIZE + i + 1}</span>
                </div>
                <span className="text-xs text-text-secondary">{categoryLabel(a.category)}</span>
              </div>
              <div className="relative text-right flex-shrink-0">
                <div className="text-sm font-bold text-accent-primary font-mono">{formatNumber(a.totalRevenue ?? 0)}</div>
                <div className="text-xs text-accent-green font-mono">{formatPercent(a.successRate ?? 0)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm font-mono text-text-secondary">
        <span>{filtered.length}개 중 {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span>
        <div className="flex gap-2">
          <button
            className="px-4 py-1.5 rounded-xl border border-border hover:border-accent-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >{t("common.prev")}</button>
          <button
            className="px-4 py-1.5 rounded-xl border border-border hover:border-accent-primary hover:text-accent-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >{t("common.next")}</button>
        </div>
      </div>
    </div>
  );
}
