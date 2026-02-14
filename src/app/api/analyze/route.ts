import { NextRequest, NextResponse } from "next/server";
import { fetchRanking } from "@/lib/api";

function summarizeData(agents: any[]) {
  // Category stats
  const catMap: Record<string, { count: number; revenue: number; successSum: number; buyers: number }> = {};
  for (const a of agents) {
    const cat = a.category || "UNKNOWN";
    if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0, successSum: 0, buyers: 0 };
    catMap[cat].count++;
    catMap[cat].revenue += a.totalRevenue ?? 0;
    catMap[cat].successSum += a.successRate ?? 0;
    catMap[cat].buyers += a.uniqueBuyerCount ?? 0;
  }

  let summary = "## 카테고리별 요약\n";
  for (const [cat, s] of Object.entries(catMap).sort((a, b) => b[1].revenue - a[1].revenue)) {
    const avgSuccess = s.count ? (s.successSum / s.count).toFixed(1) : "0";
    summary += `- ${cat}: ${s.count}개, 총 수익 ${s.revenue.toFixed(1)}, 평균 성공률 ${avgSuccess}%, 총 바이어 ${s.buyers}\n`;
  }

  // Top 20
  const top = agents.slice(0, 20);
  summary += "\n## Top 20 에이전트\n";
  for (const a of top) {
    summary += `${a.rank}. ${a.agentName} — 수익: ${a.totalRevenue?.toFixed(1)}, 성공률: ${(a.successRate ?? 0).toFixed(1)}%, 바이어: ${a.uniqueBuyerCount}, 카테고리: ${a.category}, 역할: ${a.role}\n`;
  }

  summary += `\n총 에이전트 수: ${agents.length}\n`;
  return summary;
}

const PROMPTS: Record<string, string> = {
  ecosystem:
    "다음은 Virtuals Protocol의 AI 에이전트 랭킹 데이터입니다. 생태계 현황을 분석해주세요: 수익 분포, 카테고리별 트렌드, 성공 에이전트의 공통 특성, 약점/기회 영역.",
  gap:
    "다음 데이터를 바탕으로 Virtuals 생태계에서 아직 채워지지 않은 공백(gap)을 찾아주세요. 수요는 높지만 공급이 부족한 영역, 수익성은 높지만 경쟁이 적은 카테고리, 아직 존재하지 않는 유형의 에이전트를 분석해주세요.",
  idea:
    "분석 결과를 바탕으로 새로운 에이전트 개발 아이디어를 5개 제안해주세요. 각 아이디어는 다음 JSON 배열 형식으로만 답변하세요:\n```json\n[{\"name\": \"에이전트 이름\", \"category\": \"카테고리\", \"feature\": \"핵심 기능\", \"target\": \"타겟 사용자\", \"revenue\": \"예상 수익 모델\", \"differentiator\": \"차별화 포인트\", \"difficulty\": \"상|중|하\", \"pitch\": \"1줄 피치\"}]\n```\nJSON 배열만 출력하세요. 다른 텍스트 없이.",
};

export async function POST(req: NextRequest) {
  const authToken = process.env.OPENAI_AUTH_TOKEN;
  if (!authToken) {
    return NextResponse.json({ error: "OPENAI_AUTH_TOKEN이 설정되지 않았습니다. .env.local에 추가해주세요." }, { status: 500 });
  }

  const { type } = await req.json();
  if (!PROMPTS[type]) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const agents = await fetchRanking();
    const data = summarizeData(agents);
    const prompt = `${PROMPTS[type]}\n\n${data}`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        model: "gpt-5.3-pro",
        messages: [
          { role: "system", content: "당신은 AI 에이전트 생태계 전문 분석가입니다. 한국어로 답변하세요." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json.error?.message ?? "OpenAI API 오류" }, { status: 502 });
    }

    const content = json.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ result: content, type });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
