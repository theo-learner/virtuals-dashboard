import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authToken = process.env.ANTHROPIC_AUTH_TOKEN;
  if (!authToken) {
    return NextResponse.json({ error: "ANTHROPIC_AUTH_TOKEN 미설정" }, { status: 500 });
  }

  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }

  // Short text or already Korean — skip
  if (text.length < 10 || /^[\uAC00-\uD7A3\s.,!?0-9]+$/.test(text)) {
    return NextResponse.json({ result: text });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "oauth-2025-04-20",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: "영어 텍스트를 자연스러운 한국어로 번역하세요. 번역 결과만 출력하세요. 추가 설명이나 주석은 넣지 마세요. AI 에이전트/블록체인 관련 전문 용어는 적절히 한국어로 옮기되, 고유명사(프로젝트명, 토큰명 등)는 원문 유지하세요.",
        messages: [{ role: "user", content: text }],
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json.error?.message ?? `API 오류 (${res.status})` }, { status: 502 });
    }

    const result = json.content?.[0]?.text ?? text;
    return NextResponse.json({ result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
