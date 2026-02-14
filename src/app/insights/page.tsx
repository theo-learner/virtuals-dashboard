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
          Claude Sonnet이 에이전트 생태계를 분석하고 새로운 기회를 발견합니다
        </p>
      </div>

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
