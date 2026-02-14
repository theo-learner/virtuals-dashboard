import { NextRequest, NextResponse } from "next/server";
import { apiGuard, secureHeaders } from "@/lib/api-guard";

const DUNE_API_KEY = process.env.DUNE_API_KEY;
const DUNE_BASE = "https://api.dune.com/api/v1";

async function duneExecute(sql: string): Promise<any[]> {
  // 1. Execute
  const execRes = await fetch(`${DUNE_BASE}/sql/execute`, {
    method: "POST",
    headers: {
      "X-DUNE-API-KEY": DUNE_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query_sql: sql }),
  });
  const execJson = await execRes.json();
  if (!execRes.ok) throw new Error(execJson.error ?? `Dune exec failed (${execRes.status})`);
  const executionId = execJson.execution_id;
  if (!executionId) throw new Error("No execution_id");

  // 2. Poll for results (max 60s)
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusRes = await fetch(`${DUNE_BASE}/execution/${executionId}/status`, {
      headers: { "X-DUNE-API-KEY": DUNE_API_KEY! },
    });
    const statusJson = await statusRes.json();
    if (statusJson.state === "QUERY_STATE_COMPLETED" || statusJson.is_execution_finished) {
      const resultRes = await fetch(`${DUNE_BASE}/execution/${executionId}/results`, {
        headers: { "X-DUNE-API-KEY": DUNE_API_KEY! },
      });
      const resultJson = await resultRes.json();
      return resultJson.result?.rows ?? [];
    }
    if (statusJson.state === "QUERY_STATE_FAILED" || statusJson.error) {
      throw new Error(statusJson.error ?? "Query failed");
    }
  }
  throw new Error("Query timeout");
}

export async function GET(req: NextRequest) {
  if (!DUNE_API_KEY) {
    return NextResponse.json({ error: "DUNE_API_KEY 미설정" }, { status: 500 });
  }

  const blocked = apiGuard(req, "onchain");
  if (blocked) return blocked;

  try {
    // VIRTUAL token daily stats (30 days)
    const dailySql = `
      SELECT 
        date_trunc('day', evt_block_time) as day,
        COUNT(*) as transfers,
        COUNT(DISTINCT "from") as unique_senders,
        COUNT(DISTINCT "to") as unique_receivers,
        SUM(CAST(value AS DOUBLE)) / 1e18 as volume
      FROM erc20_base.evt_Transfer
      WHERE contract_address = 0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b
        AND evt_block_time >= NOW() - INTERVAL '30' DAY
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    const daily = await duneExecute(dailySql);

    // Summary stats
    const totalVolume = daily.reduce((s, r) => s + (r.volume ?? 0), 0);
    const totalTransfers = daily.reduce((s, r) => s + (r.transfers ?? 0), 0);
    const avgDailyVolume = daily.length ? totalVolume / daily.length : 0;
    const avgDailySenders = daily.length
      ? daily.reduce((s, r) => s + (r.unique_senders ?? 0), 0) / daily.length
      : 0;

    // Trend: last 7d vs previous 7d
    const last7 = daily.slice(-7);
    const prev7 = daily.slice(-14, -7);
    const last7Vol = last7.reduce((s, r) => s + (r.volume ?? 0), 0);
    const prev7Vol = prev7.reduce((s, r) => s + (r.volume ?? 0), 0);
    const volumeTrend = prev7Vol > 0 ? ((last7Vol - prev7Vol) / prev7Vol) * 100 : 0;

    const last7Senders = last7.reduce((s, r) => s + (r.unique_senders ?? 0), 0);
    const prev7Senders = prev7.reduce((s, r) => s + (r.unique_senders ?? 0), 0);
    const senderTrend = prev7Senders > 0 ? ((last7Senders - prev7Senders) / prev7Senders) * 100 : 0;

    return NextResponse.json({
      daily,
      summary: {
        totalVolume: Math.round(totalVolume),
        totalTransfers,
        avgDailyVolume: Math.round(avgDailyVolume),
        avgDailySenders: Math.round(avgDailySenders),
        volumeTrend7d: Math.round(volumeTrend * 10) / 10,
        senderTrend7d: Math.round(senderTrend * 10) / 10,
        days: daily.length,
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
