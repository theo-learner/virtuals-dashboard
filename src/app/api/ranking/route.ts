import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.virtuals.io/api/agdp-leaderboard-epochs/1/ranking?pagination[pageSize]=1000",
    { next: { revalidate: 3600 } }
  );
  const json = await res.json();
  return NextResponse.json(json.data ?? [], {
    headers: {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
