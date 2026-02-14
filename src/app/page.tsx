import { fetchRanking } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";
import StatCard from "@/components/StatCard";
import RankingTable from "@/components/RankingTable";

export default async function Home() {
  const agents = await fetchRanking();

  const totalAgents = agents.length;
  const totalRevenue = agents.reduce((s, a) => s + (a.totalRevenue ?? 0), 0);
  const avgSuccess = agents.length ? agents.reduce((s, a) => s + (a.successRate ?? 0), 0) / agents.length : 0;
  const totalBuyers = agents.reduce((s, a) => s + (a.uniqueBuyerCount ?? 0), 0);

  return (
    <main>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🤖" label="총 에이전트" value={totalAgents.toString()} />
        <StatCard icon="💰" label="총 수익" value={formatNumber(totalRevenue) + " V"} />
        <StatCard icon="✅" label="평균 성공률" value={formatPercent(avgSuccess)} />
        <StatCard icon="👥" label="총 바이어" value={formatNumber(totalBuyers)} />
      </div>
      <RankingTable agents={agents} />
    </main>
  );
}
