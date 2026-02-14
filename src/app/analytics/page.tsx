import { fetchRanking } from "@/lib/api";
import { CategoryPieChart, RevenueBarChart, SuccessRevenueScatter, RoleDistribution } from "@/components/Charts";

export default async function AnalyticsPage() {
  const agents = await fetchRanking();

  return (
    <main>
      <h1 className="text-2xl font-bold font-mono mb-6">
        <span className="text-cyan-neon glow-cyan">Analytics</span>
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
