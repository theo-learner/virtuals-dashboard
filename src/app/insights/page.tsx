"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface IdeaCard {
  name: string;
  category: string;
  feature: string;
  target: string;
  revenue: string;
  differentiator: string;
  difficulty: string;
  pitch: string;
}

function DifficultyBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    상: "bg-red-500/20 text-red-400 border-red-500/30",
    중: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    하: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${colors[level] ?? colors["중"]}`}>
      난이도: {level}
    </span>
  );
}

function AnalysisResult({ result }: { result: string }) {
  return (
    <div className="mt-5 space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold font-mono text-cyan-neon glow-cyan mt-6 mb-3 pb-2 border-b border-cyan-neon/20">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold font-mono text-violet-accent mt-5 mb-2 flex items-center gap-2">
              <span className="w-1 h-5 bg-violet-accent rounded-full inline-block" />
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold font-mono text-cyan-neon/90 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-text-primary leading-relaxed text-sm mb-3">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="text-cyan-neon font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-violet-accent not-italic font-medium">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-2 ml-1 mb-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 ml-1 mb-4 list-decimal list-inside">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-sm text-text-primary">
              <span className="text-cyan-neon mt-1.5 text-[6px]">●</span>
              <span className="flex-1 leading-relaxed">{children}</span>
            </li>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="bg-black/60 border border-border rounded-lg p-4 overflow-x-auto my-3">
                  <code className="text-xs font-mono text-cyan-neon/90">{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-cyan-neon/10 text-cyan-neon px-1.5 py-0.5 rounded text-xs font-mono border border-cyan-neon/20">
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-violet-accent pl-4 py-2 my-3 bg-violet-accent/5 rounded-r-lg">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-border my-6" />,
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-border">
              <table className="w-full text-sm font-mono">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-cyan-neon/10 border-b border-border">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left text-xs uppercase tracking-wider text-cyan-neon font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 text-text-primary border-t border-border/50">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/5 transition-colors">{children}</tr>
          ),
        }}
      >
        {result}
      </ReactMarkdown>
    </div>
  );
}

function AnalysisSection({
  title,
  icon,
  description,
  buttonText,
  type,
  children,
}: {
  title: string;
  icon: string;
  description: string;
  buttonText: string;
  type: string;
  children?: (result: string, loading: boolean) => React.ReactNode;
}) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [elapsed, setElapsed] = useState(0);

  async function run() {
    setLoading(true);
    setError("");
    setResult("");
    setElapsed(0);
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResult(json.result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <section className="glass-card p-6 mb-6 border border-border hover:border-cyan-neon/20 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold font-mono flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-cyan-neon">{title}</span>
          </h2>
          <p className="text-text-secondary text-xs font-mono mt-1 ml-9">{description}</p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg font-mono text-sm bg-gradient-to-r from-cyan-neon/20 to-violet-accent/20 border border-cyan-neon/40 text-cyan-neon hover:from-cyan-neon/30 hover:to-violet-accent/30 hover:shadow-[0_0_20px_rgba(0,255,209,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? `분석 중... (${elapsed}s)` : buttonText}
        </button>
      </div>

      {loading && (
        <div className="mt-4 p-4 bg-black/40 rounded-lg border border-cyan-neon/10">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-cyan-neon/30 rounded-full" />
              <div className="absolute inset-0 border-2 border-cyan-neon border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-cyan-neon font-mono text-sm font-medium">Claude Sonnet이 분석 중입니다</p>
              <p className="text-text-secondary font-mono text-xs mt-0.5">275개 에이전트 데이터를 기반으로 인사이트를 생성합니다...</p>
            </div>
          </div>
          <div className="mt-3 h-1 bg-black/60 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-neon to-violet-accent rounded-full animate-pulse" style={{ width: `${Math.min(90, elapsed * 5)}%`, transition: "width 1s" }} />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm font-mono">⚠️ 오류: {error}</p>
        </div>
      )}

      {children
        ? children(result, loading)
        : result && <AnalysisResult result={result} />
      }
    </section>
  );
}

function IdeaCards({ result }: { result: string }) {
  let ideas: IdeaCard[] = [];
  try {
    const match = result.match(/\[[\s\S]*\]/);
    if (match) ideas = JSON.parse(match[0]);
  } catch {
    return <AnalysisResult result={result} />;
  }

  if (!ideas.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
      {ideas.map((idea, i) => (
        <div
          key={i}
          className="relative glass-card p-5 border border-violet-accent/20 hover:border-violet-accent/50 transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] group overflow-hidden"
        >
          {/* Number badge */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-violet-accent/20 flex items-center justify-center">
            <span className="text-violet-accent font-mono text-sm font-bold">{i + 1}</span>
          </div>

          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-neon/20 to-violet-accent/20 flex items-center justify-center border border-cyan-neon/20 shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h3 className="font-bold font-mono text-cyan-neon group-hover:glow-cyan transition-all text-base">
                {idea.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-accent/20 text-violet-accent border border-violet-accent/30 font-mono">
                  {idea.category}
                </span>
                <DifficultyBadge level={idea.difficulty} />
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="p-2.5 bg-black/30 rounded-lg border border-border">
              <p className="text-text-secondary text-xs font-mono uppercase tracking-wider mb-1">핵심 기능</p>
              <p className="text-text-primary leading-relaxed">{idea.feature}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-black/20 rounded-lg">
                <p className="text-text-secondary text-[10px] font-mono uppercase">타겟</p>
                <p className="text-text-primary text-xs mt-0.5">{idea.target}</p>
              </div>
              <div className="p-2 bg-black/20 rounded-lg">
                <p className="text-text-secondary text-[10px] font-mono uppercase">수익 모델</p>
                <p className="text-text-primary text-xs mt-0.5">{idea.revenue}</p>
              </div>
            </div>
            <div className="p-2 bg-cyan-neon/5 rounded-lg border border-cyan-neon/10">
              <p className="text-text-secondary text-[10px] font-mono uppercase">차별화 포인트</p>
              <p className="text-cyan-neon/80 text-xs mt-0.5">{idea.differentiator}</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm italic text-violet-accent/90 font-medium">
              &ldquo;{idea.pitch}&rdquo;
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface GapCategory {
  category: string;
  categoryKo: string;
  agentCount: number;
  totalRevenue: number;
  avgRevenue: number;
  avgSuccessRate: number;
  avgBuyers: number;
  totalBuyers: number;
  avgRating: number;
  topAgent: string;
  gapScore: number;
  revenuePerAgent: number;
  competitionIndex: number;
  demandIndex: number;
  signals: string[];
}

interface GapMeta {
  totalAgents: number;
  totalRevenue: number;
  totalBuyers: number;
  avgRevenueGlobal: number;
  avgBuyersGlobal: number;
  updatedAt: string;
}

function GapScoreBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / Math.max(1, max)) * 100);
  return (
    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%`, transition: "width 0.5s ease" }} />
    </div>
  );
}

function GapScoreSection() {
  const [data, setData] = useState<{ categories: GapCategory[]; meta: GapMeta } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/gap-score");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setData(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const maxGap = data ? Math.max(...data.categories.map((c) => c.gapScore)) : 1;

  return (
    <section className="glass-card p-6 mb-6 border border-border hover:border-cyan-neon/20 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h2 className="text-lg font-bold font-mono flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="text-cyan-neon">정량 Gap Score</span>
          </h2>
          <p className="text-text-secondary text-xs font-mono mt-1 ml-9">
            수요/경쟁 비율 기반 정량 분석 — LLM 없이 순수 데이터로 기회 영역을 스코어링합니다
          </p>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="px-5 py-2.5 rounded-lg font-mono text-sm bg-gradient-to-r from-cyan-neon/20 to-violet-accent/20 border border-cyan-neon/40 text-cyan-neon hover:from-cyan-neon/30 hover:to-violet-accent/30 hover:shadow-[0_0_20px_rgba(0,255,209,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "계산 중..." : "Gap Score 산출"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm font-mono">⚠️ 오류: {error}</p>
        </div>
      )}

      {data && (
        <div className="mt-5">
          {/* Meta summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-3 bg-black/30 rounded-lg text-center border border-border/30">
              <div className="text-xs font-mono text-text-secondary">총 에이전트</div>
              <div className="text-xl font-bold font-mono text-cyan-neon">{data.meta.totalAgents}</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg text-center border border-border/30">
              <div className="text-xs font-mono text-text-secondary">총 수익 (VIRTUAL)</div>
              <div className="text-xl font-bold font-mono text-cyan-neon">{data.meta.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg text-center border border-border/30">
              <div className="text-xs font-mono text-text-secondary">총 바이어</div>
              <div className="text-xl font-bold font-mono text-violet-accent">{data.meta.totalBuyers.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-black/30 rounded-lg text-center border border-border/30">
              <div className="text-xs font-mono text-text-secondary">분석 시각</div>
              <div className="text-sm font-mono text-text-primary mt-1">{new Date(data.meta.updatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</div>
            </div>
          </div>

          {/* Category cards sorted by gap score */}
          <div className="space-y-4">
            {data.categories.map((cat, i) => (
              <div
                key={cat.category}
                className={`p-5 rounded-lg border transition-all ${
                  i === 0
                    ? "bg-gradient-to-r from-cyan-neon/10 to-violet-accent/10 border-cyan-neon/40 shadow-[0_0_20px_rgba(0,255,209,0.1)]"
                    : i < 3
                    ? "bg-black/30 border-cyan-neon/20"
                    : "bg-black/20 border-border/30"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm ${
                      i === 0 ? "bg-cyan-neon/20 text-cyan-neon" : i < 3 ? "bg-violet-accent/20 text-violet-accent" : "bg-white/10 text-text-secondary"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold font-mono text-text-primary">{cat.categoryKo}</h3>
                      <span className="text-xs font-mono text-text-secondary">{cat.category} · {cat.agentCount}개 에이전트</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold font-mono ${i === 0 ? "text-cyan-neon glow-cyan" : i < 3 ? "text-violet-accent" : "text-text-primary"}`}>
                      {cat.gapScore.toFixed(2)}
                    </div>
                    <div className="text-[10px] font-mono text-text-secondary uppercase">Gap Score</div>
                  </div>
                </div>

                {/* Score bars */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>수요 지수</span>
                      <span className="text-cyan-neon">{cat.demandIndex.toFixed(1)}</span>
                    </div>
                    <GapScoreBar value={cat.demandIndex} max={100} color="bg-gradient-to-r from-cyan-neon/60 to-cyan-neon" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>경쟁 지수</span>
                      <span className="text-red-400">{cat.competitionIndex.toFixed(1)}</span>
                    </div>
                    <GapScoreBar value={cat.competitionIndex} max={100} color="bg-gradient-to-r from-red-500/60 to-red-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>평균 수익</span>
                      <span>{cat.avgRevenue.toLocaleString()}</span>
                    </div>
                    <GapScoreBar value={cat.avgRevenue} max={Math.max(...data.categories.map(c => c.avgRevenue))} color="bg-gradient-to-r from-violet-accent/60 to-violet-accent" />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-mono text-text-secondary mb-1">
                      <span>평균 성공률</span>
                      <span>{cat.avgSuccessRate.toFixed(1)}%</span>
                    </div>
                    <GapScoreBar value={cat.avgSuccessRate} max={100} color="bg-gradient-to-r from-green-500/60 to-green-400" />
                  </div>
                </div>

                {/* Signals */}
                {cat.signals.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {cat.signals.map((s, j) => (
                      <span key={j} className="text-xs px-2 py-1 rounded-lg bg-black/40 border border-border/30 text-text-primary font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom row */}
                <div className="flex items-center justify-between text-xs font-mono text-text-secondary mt-2 pt-2 border-t border-border/20">
                  <span>총 바이어: {cat.totalBuyers.toLocaleString()}</span>
                  <span>평균 평점: {cat.avgRating.toFixed(1)}</span>
                  <span>🏆 {cat.topAgent}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-black/20 rounded-lg border border-border/20">
            <h4 className="text-xs font-mono text-text-secondary uppercase mb-2">Gap Score 산출 공식</h4>
            <p className="text-xs font-mono text-text-primary leading-relaxed">
              Gap Score = (수요 지수 / 경쟁 지수) × 성공률 보너스<br/>
              <span className="text-text-secondary">수요 지수: 바이어 밀도 + 에이전트당 수익 (글로벌 평균 대비)</span><br/>
              <span className="text-text-secondary">경쟁 지수: 카테고리 내 에이전트 수 비율</span><br/>
              <span className="text-text-secondary">성공률 보너스: 50%↑ = ×1.2, 30~50% = ×1.0, 30%↓ = ×0.8</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default function InsightsPage() {
  return (
    <main>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-mono flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <span>
            <span className="text-cyan-neon glow-cyan">AI</span>
            <span className="text-violet-accent"> 인사이트</span>
          </span>
        </h1>
        <p className="text-text-secondary text-sm font-mono mt-2 ml-12">
          정량 데이터 분석 + AI가 에이전트 생태계의 기회를 발견합니다
        </p>
      </div>

      <GapScoreSection />

      <AnalysisSection
        title="생태계 분석"
        icon="🔬"
        description="275개 에이전트의 수익·성공률·카테고리 데이터를 종합 분석합니다"
        buttonText="AI 분석 시작"
        type="ecosystem"
      />

      <AnalysisSection
        title="공백 분석 (Gap Finder)"
        icon="🎯"
        description="수요 대비 공급이 부족한 영역과 미개척 기회를 탐지합니다"
        buttonText="공백 분석"
        type="gap"
      />

      <AnalysisSection
        title="아이디어 카드"
        icon="💡"
        description="Gap 분석 기반 신규 에이전트 개발 아이디어를 자동 생성합니다"
        buttonText="아이디어 생성"
        type="idea"
      >
        {(result, loading) =>
          !loading && result ? <IdeaCards result={result} /> : null
        }
      </AnalysisSection>
    </main>
  );
}
