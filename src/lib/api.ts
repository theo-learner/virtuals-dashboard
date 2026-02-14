export interface RankingAgent {
  agentId: string;
  agentName: string;
  rank: number;
  totalRevenue: number;
  successRate: number;
  successfulJobCount: number;
  uniqueBuyerCount: number;
  rating: number;
  category: string;
  role: string;
  prizePoolPercentage: number;
  hasGraduated: boolean;
  tokenAddress: string;
  profilePic: string;
  twitterHandle: string;
}

export interface VirtualAgent {
  id: string;
  name: string;
  symbol: string;
  category: string;
  role: string;
  tokenAddress: string;
  holderCount: number;
  mcapInVirtual: number;
  totalValueLocked: number;
  description: string;
}

export async function fetchRanking(): Promise<RankingAgent[]> {
  const res = await fetch(
    "https://api.virtuals.io/api/agdp-leaderboard-epochs/1/ranking?pagination[pageSize]=1000",
    { next: { revalidate: 3600 } }
  );
  const json = await res.json();
  return json.data ?? [];
}

export async function fetchVirtuals(): Promise<VirtualAgent[]> {
  const res = await fetch("https://api.virtuals.io/api/virtuals", {
    next: { revalidate: 3600 },
  });
  const json = await res.json();
  return json.data ?? [];
}
