import { fetchRanking, fetchVirtuals } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";
import Link from "next/link";

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [ranking, virtuals] = await Promise.all([fetchRanking(), fetchVirtuals()]);

  const agent = ranking.find((a) => a.agentId === id);
  const virtual = virtuals.find((v) => v.id === id);

  if (!agent) {
    return (
      <main className="text-center py-20">
        <h1 className="text-2xl font-mono text-text-secondary">Agent not found</h1>
        <Link href="/" className="text-cyan-neon font-mono text-sm mt-4 inline-block">← Back</Link>
      </main>
    );
  }

  return (
    <main>
      <Link href="/" className="text-cyan-neon font-mono text-sm mb-6 inline-block hover:underline">← Back to Dashboard</Link>

      <div className="glass-card p-6 mb-6 flex flex-col sm:flex-row items-start gap-6">
        {agent.profilePic && (
          <img src={agent.profilePic} alt={agent.agentName} className="w-24 h-24 rounded-xl border border-border" />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono text-cyan-neon glow-cyan mb-1">{agent.agentName}</h1>
          <div className="flex flex-wrap gap-2 mb-3">
            {agent.category && <span className="text-xs font-mono px-2 py-1 rounded bg-violet-accent/20 text-violet-accent">{agent.category}</span>}
            {agent.role && <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-neon/20 text-cyan-neon">{agent.role}</span>}
            {agent.hasGraduated && <span className="text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-400">Graduated</span>}
          </div>
          {virtual?.description && <p className="text-text-secondary text-sm leading-relaxed">{virtual.description}</p>}
          {agent.twitterHandle && (
            <a href={`https://twitter.com/${agent.twitterHandle}`} target="_blank" rel="noopener noreferrer"
              className="text-cyan-neon font-mono text-sm mt-3 inline-block hover:underline">
              @{agent.twitterHandle} ↗
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">Rank</div>
          <div className="text-3xl font-bold font-mono text-violet-accent glow-violet">#{agent.rank}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">Revenue</div>
          <div className="text-2xl font-bold font-mono text-cyan-neon">{formatNumber(agent.totalRevenue ?? 0)}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">Success Rate</div>
          <div className="text-2xl font-bold font-mono text-cyan-neon">{formatPercent(agent.successRate ?? 0)}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">Buyers</div>
          <div className="text-2xl font-bold font-mono">{agent.uniqueBuyerCount ?? 0}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">Rating</div>
          <div className="text-2xl font-bold font-mono text-violet-accent">{(agent.rating ?? 0).toFixed(1)}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">Jobs Done</div>
          <div className="text-2xl font-bold font-mono">{agent.successfulJobCount ?? 0}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">Prize Pool</div>
          <div className="text-2xl font-bold font-mono text-cyan-neon">{((agent.prizePoolPercentage ?? 0) * 100).toFixed(2)}%</div>
        </div>
      </div>
    </main>
  );
}
