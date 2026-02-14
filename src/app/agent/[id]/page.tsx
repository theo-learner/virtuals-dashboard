import { fetchRanking, fetchVirtuals } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";
import Link from "next/link";

const categoryMap: Record<string, string> = {
  "ON_CHAIN": "온체인",
  "HYBRID": "하이브리드",
  "OFF_CHAIN": "오프체인",
  "IP MIRROR": "IP 미러",
  "ENTERTAINMENT": "엔터테인먼트",
  "INFORMATION": "정보",
  "PRODUCTIVITY": "생산성",
  "NONE": "미분류",
  "SOCIAL": "소셜",
  "GAMING": "게임",
  "DEFI": "디파이",
};

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [ranking, virtuals] = await Promise.all([fetchRanking(), fetchVirtuals()]);

  const agent = ranking.find((a) => String(a.agentId) === id);
  const virtual = virtuals.find((v) => String(v.id) === id);

  if (!agent) {
    return (
      <main className="text-center py-20">
        <h1 className="text-2xl font-mono text-text-secondary">에이전트를 찾을 수 없습니다</h1>
        <Link href="/" className="text-cyan-neon font-mono text-sm mt-4 inline-block">← 돌아가기</Link>
      </main>
    );
  }

  return (
    <main>
      <Link href="/" className="text-cyan-neon font-mono text-sm mb-6 inline-block hover:underline">← 대시보드로 돌아가기</Link>

      <div className="glass-card p-6 mb-6 flex flex-col sm:flex-row items-start gap-6">
        {agent.profilePic && (
          <img src={agent.profilePic} alt={agent.agentName} className="w-24 h-24 rounded-xl border border-border" />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold font-mono text-cyan-neon glow-cyan mb-1">{agent.agentName}</h1>
          <div className="flex flex-wrap gap-2 mb-3">
            {agent.category && <span className="text-xs font-mono px-2 py-1 rounded bg-violet-accent/20 text-violet-accent">{categoryMap[agent.category] ?? agent.category}</span>}
            {agent.role && <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-neon/20 text-cyan-neon">{agent.role}</span>}
            {agent.hasGraduated && <span className="text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-400">졸업 완료</span>}
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
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">순위</div>
          <div className="text-3xl font-bold font-mono text-violet-accent glow-violet">#{agent.rank}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">수익</div>
          <div className="text-2xl font-bold font-mono text-cyan-neon">{formatNumber(agent.totalRevenue ?? 0)}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">성공률</div>
          <div className="text-2xl font-bold font-mono text-cyan-neon">{formatPercent(agent.successRate ?? 0)}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">바이어</div>
          <div className="text-2xl font-bold font-mono">{agent.uniqueBuyerCount ?? 0}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">평점</div>
          <div className="text-2xl font-bold font-mono text-violet-accent">{(agent.rating ?? 0).toFixed(1)}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">완료 작업</div>
          <div className="text-2xl font-bold font-mono">{agent.successfulJobCount ?? 0}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">상금 풀</div>
          <div className="text-2xl font-bold font-mono text-cyan-neon">{(agent.prizePoolPercentage ?? 0).toFixed(2)}%</div>
        </div>
      </div>
    </main>
  );
}
