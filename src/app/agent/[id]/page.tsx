import { fetchRanking, fetchAgentDetail } from "@/lib/api";
import { formatNumber, formatPercent } from "@/lib/format";
import Link from "next/link";
import { CopyButton } from "./CopyButton";
import { TranslatedDescription } from "./TranslatedDescription";

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

const roleMap: Record<string, string> = {
  AUTONOMOUS: "자율형",
  SEMI_AUTONOMOUS: "반자율형",
  MANUAL: "수동형",
  CONTRIBUTOR: "기여자",
  FUNCTIONAL: "기능형",
  CONVERSATIONAL: "대화형",
};

function shortenAddress(addr: string): string {
  if (!addr || addr.length < 12) return addr || "N/A";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AddressRow({ label, address }: { label: string; address: any }) {
  if (!address) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
      <span className="text-xs font-mono text-text-secondary uppercase">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-text-primary">{shortenAddress(String(address))}</span>
        <CopyButton text={String(address)} />
      </div>
    </div>
  );
}

export default async function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ranking = await fetchRanking();
  const agent = ranking.find((a) => String(a.agentId) === id);

  if (!agent) {
    return (
      <main className="text-center py-20">
        <h1 className="text-2xl font-mono text-text-secondary">에이전트를 찾을 수 없습니다</h1>
        <Link href="/" className="text-cyan-neon font-mono text-sm mt-4 inline-block">← 돌아가기</Link>
      </main>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let detail: any = null;
  if (agent.virtualAgentId) {
    detail = await fetchAgentDetail(agent.virtualAgentId);
  }

  const name = detail?.name || agent.agentName;
  const symbol = detail?.symbol;
  const description = detail?.description;
  const category = detail?.category || agent.category;
  const role = detail?.role || agent.role;
  const tokenAddress = detail?.tokenAddress || agent.tokenAddress;
  const lpAddress = detail?.lpAddress;
  const chain = detail?.chain || "BASE";
  const lpCreatedAt = detail?.lpCreatedAt;
  const level = detail?.level;
  const holderCount = detail?.holderCount;
  const top10Pct = detail?.top10HolderPercentage;
  const mcap = detail?.mcapInVirtual;
  const tvl = detail?.totalValueLocked;
  const volume24h = detail?.volume24h;
  const priceChange24h = detail?.priceChangePercent24h;
  const twitterUrl = detail?.socials?.VERIFIED_LINKS?.TWITTER;
  const websiteUrl = detail?.socials?.VERIFIED_LINKS?.WEBSITE;
  const videoUrl = detail?.socials?.VIDEO_PITCH?.VIDEO_URL;
  const videoThumb = detail?.socials?.VIDEO_PITCH?.THUMBNAIL_URL;
  const profilePic = detail?.image?.url || agent.profilePic;

  return (
    <main>
      <Link href="/" className="text-cyan-neon font-mono text-sm mb-6 inline-block hover:underline">← 대시보드로 돌아가기</Link>

      {/* Header */}
      <div className="glass-card p-6 mb-6 flex flex-col sm:flex-row items-start gap-6">
        {profilePic && (
          <img src={profilePic} alt={name} className="w-20 h-20 rounded-xl border border-border flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-2xl font-bold font-mono text-cyan-neon glow-cyan">{name}</h1>
            {symbol && <span className="text-sm font-mono text-violet-accent">${symbol}</span>}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {category && <span className="text-xs font-mono px-2 py-1 rounded bg-violet-accent/20 text-violet-accent">{categoryMap[category] ?? category}</span>}
            {role && <span className="text-xs font-mono px-2 py-1 rounded bg-cyan-neon/20 text-cyan-neon">{roleMap[role] ?? role}</span>}
            {agent.hasGraduated && <span className="text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-400">🎓 졸업 완료</span>}
            {level != null && <span className="text-xs font-mono px-2 py-1 rounded bg-amber-500/20 text-amber-400">Lv.{level}</span>}
          </div>
          {description && (
            <TranslatedDescription text={description} />
          )}
          <div className="flex flex-wrap items-center gap-4">
            {(twitterUrl || agent.twitterHandle) && (
              <a href={twitterUrl || `https://twitter.com/${agent.twitterHandle}`} target="_blank" rel="noopener noreferrer"
                className="text-cyan-neon font-mono text-sm hover:underline">𝕏 트위터 ↗</a>
            )}
            {websiteUrl && (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
                className="text-cyan-neon font-mono text-sm hover:underline">🌐 웹사이트 ↗</a>
            )}
            {tokenAddress && (
              <a href={`https://basescan.org/token/${tokenAddress}`} target="_blank" rel="noopener noreferrer"
                className="text-cyan-neon font-mono text-sm hover:underline">BaseScan ↗</a>
            )}
          </div>
        </div>
      </div>

      {/* Key Metrics - Row 1 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">순위</div>
          <div className="text-3xl font-bold font-mono text-violet-accent glow-violet">#{agent.rank}</div>
        </div>
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">수익 (VIRTUAL)</div>
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
      </div>

      {/* Key Metrics - Row 2 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        <div className="glass-card p-5 text-center">
          <div className="text-xs font-mono text-text-secondary uppercase mb-2">레벨</div>
          <div className="text-2xl font-bold font-mono text-amber-400">{level ?? "N/A"}</div>
        </div>
      </div>

      {/* Market Data */}
      {(mcap || tvl || volume24h || holderCount) && (
        <>
          <h2 className="text-lg font-bold font-mono text-text-primary mb-3">📊 시장 데이터</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {mcap != null && (
              <div className="glass-card p-5 text-center">
                <div className="text-xs font-mono text-text-secondary uppercase mb-2">시가총액 (VIRTUAL)</div>
                <div className="text-2xl font-bold font-mono text-cyan-neon">{formatNumber(mcap)}</div>
              </div>
            )}
            {tvl != null && (
              <div className="glass-card p-5 text-center">
                <div className="text-xs font-mono text-text-secondary uppercase mb-2">TVL</div>
                <div className="text-2xl font-bold font-mono text-violet-accent">{formatNumber(tvl)}</div>
              </div>
            )}
            {volume24h != null && (
              <div className="glass-card p-5 text-center">
                <div className="text-xs font-mono text-text-secondary uppercase mb-2">24h 거래량</div>
                <div className="text-2xl font-bold font-mono">{formatNumber(volume24h)}</div>
              </div>
            )}
            {priceChange24h != null && (
              <div className="glass-card p-5 text-center">
                <div className="text-xs font-mono text-text-secondary uppercase mb-2">24h 변동률</div>
                <div className={`text-2xl font-bold font-mono ${priceChange24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {priceChange24h >= 0 ? "+" : ""}{priceChange24h.toFixed(2)}%
                </div>
              </div>
            )}
            {holderCount != null && (
              <div className="glass-card p-5 text-center">
                <div className="text-xs font-mono text-text-secondary uppercase mb-2">홀더 수</div>
                <div className="text-2xl font-bold font-mono">{holderCount.toLocaleString()}</div>
              </div>
            )}
            {top10Pct != null && (
              <div className="glass-card p-5 text-center">
                <div className="text-xs font-mono text-text-secondary uppercase mb-2">상위 10 홀더</div>
                <div className="text-2xl font-bold font-mono text-violet-accent">{top10Pct.toFixed(1)}%</div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Token Info */}
      {tokenAddress && (
        <>
          <h2 className="text-lg font-bold font-mono text-text-primary mb-3">🪙 토큰 정보</h2>
          <div className="glass-card p-4 mb-6">
            <AddressRow label="토큰 주소" address={tokenAddress} />
            <AddressRow label="LP 주소" address={lpAddress} />
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="text-xs font-mono text-text-secondary uppercase">체인</span>
              <span className="font-mono text-sm text-text-primary">{chain}</span>
            </div>
            {lpCreatedAt && (
              <div className="flex items-center justify-between py-2 border-b border-border/30">
                <span className="text-xs font-mono text-text-secondary uppercase">출시일</span>
                <span className="font-mono text-sm text-text-primary">{formatDate(lpCreatedAt)}</span>
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-mono text-text-secondary uppercase">BaseScan</span>
              <a href={`https://basescan.org/token/${tokenAddress}`} target="_blank" rel="noopener noreferrer"
                className="text-cyan-neon font-mono text-sm hover:underline">보기 ↗</a>
            </div>
          </div>
        </>
      )}

      {/* Video Pitch */}
      {videoUrl && (
        <>
          <h2 className="text-lg font-bold font-mono text-text-primary mb-3">🎬 비디오 피치</h2>
          <div className="glass-card p-4 mb-6">
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="block">
              {videoThumb ? (
                <img src={videoThumb} alt="Video pitch" className="w-full max-w-md rounded-lg border border-border" />
              ) : (
                <span className="text-cyan-neon font-mono text-sm hover:underline">비디오 보기 ↗</span>
              )}
            </a>
          </div>
        </>
      )}
    </main>
  );
}
