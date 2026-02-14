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
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[level] ?? colors["중"]}`}>
      난이도: {level}
    </span>
  );
}

function AnalysisSection({
  title,
  buttonText,
  type,
  children,
}: {
  title: string;
  buttonText: string;
  type: string;
  children?: (result: string, loading: boolean) => React.ReactNode;
}) {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setError("");
    setResult("");
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
      setLoading(false);
    }
  }

  return (
    <section className="glass-card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-mono text-cyan-neon">{title}</h2>
        <button
          onClick={run}
          disabled={loading}
          className="px-4 py-2 rounded-lg font-mono text-sm bg-violet-accent/20 border border-violet-accent/40 text-violet-accent hover:bg-violet-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "분석 중..." : buttonText}
        </button>
      </div>
      {loading && (
        <div className="flex items-center gap-3 text-text-secondary">
          <div className="w-5 h-5 border-2 border-cyan-neon border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-sm animate-pulse">AI가 데이터를 분석하고 있습니다...</span>
        </div>
      )}
      {error && <p className="text-red-400 text-sm font-mono">{error}</p>}
      {children ? children(result, loading) : result && (
        <div className="prose prose-invert prose-sm max-w-none mt-4 text-text-primary leading-relaxed">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </section>
  );
}

function IdeaCards({ result }: { result: string }) {
  let ideas: IdeaCard[] = [];
  try {
    const match = result.match(/\[[\s\S]*\]/);
    if (match) ideas = JSON.parse(match[0]);
  } catch {
    return (
      <div className="prose prose-invert prose-sm max-w-none mt-4">
        <ReactMarkdown>{result}</ReactMarkdown>
      </div>
    );
  }

  if (!ideas.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {ideas.map((idea, i) => (
        <div
          key={i}
          className="glass-card p-5 border border-cyan-neon/20 hover:border-cyan-neon/50 transition-all hover:shadow-[0_0_20px_rgba(0,255,209,0.15)] group"
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold font-mono text-cyan-neon group-hover:glow-cyan transition-all">
              {idea.name}
            </h3>
            <DifficultyBadge level={idea.difficulty} />
          </div>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-violet-accent/20 text-violet-accent border border-violet-accent/30 mb-3">
            {idea.category}
          </span>
          <div className="space-y-2 text-sm text-text-secondary">
            <p><span className="text-text-primary font-medium">핵심 기능:</span> {idea.feature}</p>
            <p><span className="text-text-primary font-medium">타겟:</span> {idea.target}</p>
            <p><span className="text-text-primary font-medium">수익 모델:</span> {idea.revenue}</p>
            <p><span className="text-text-primary font-medium">차별화:</span> {idea.differentiator}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm italic text-cyan-neon/80">💡 {idea.pitch}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InsightsPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold font-mono mb-6">
        <span className="text-cyan-neon glow-cyan">AI</span>
        <span className="text-violet-accent"> 인사이트</span>
      </h1>

      <AnalysisSection title="🔍 생태계 분석" buttonText="AI 분석 시작" type="ecosystem" />

      <AnalysisSection title="🎯 공백 분석 (Gap Finder)" buttonText="공백 분석" type="gap" />

      <AnalysisSection title="💡 아이디어 카드" buttonText="아이디어 생성" type="idea">
        {(result, loading) =>
          !loading && result ? <IdeaCards result={result} /> : null
        }
      </AnalysisSection>
    </main>
  );
}
