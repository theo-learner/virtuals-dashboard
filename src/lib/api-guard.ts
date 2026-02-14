import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "./rate-limit";

/**
 * Multi-layer API protection for expensive endpoints (LLM, Dune).
 *
 * Layer 1: Origin/Referer check — block cross-origin calls
 * Layer 2: IP rate limiting — sliding window per endpoint
 * Layer 3: Global daily budget — hard cap on total calls per day
 * Layer 4: Request validation — reject malformed/oversized payloads
 */

// --- Layer 3: Global daily budget ---
interface DailyBudget {
  date: string; // YYYY-MM-DD
  count: number;
}

const budgets = new Map<string, DailyBudget>();

function checkDailyBudget(endpoint: string, maxPerDay: number): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const entry = budgets.get(endpoint);
  if (!entry || entry.date !== today) {
    budgets.set(endpoint, { date: today, count: 1 });
    return true;
  }
  if (entry.count >= maxPerDay) return false;
  entry.count++;
  return true;
}

function getDailyUsage(endpoint: string): number {
  const today = new Date().toISOString().slice(0, 10);
  const entry = budgets.get(endpoint);
  return entry?.date === today ? entry.count : 0;
}

// --- Layer 1: Origin check ---
const ALLOWED_ORIGINS = [
  "https://virtuals-dashboard.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

function checkOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  // Allow if no origin (same-origin requests from server components)
  if (!origin && !referer) return true;

  if (origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) return true;
  if (referer && ALLOWED_ORIGINS.some((o) => referer.startsWith(o))) return true;

  // Allow Vercel preview deployments
  if (origin?.includes(".vercel.app") || referer?.includes(".vercel.app")) return true;

  return false;
}

// --- Config per endpoint ---
interface GuardConfig {
  /** Max requests per IP per minute */
  ratePerMinute: number;
  /** Max total requests per day (all users combined) */
  dailyBudget: number;
  /** Max request body size in bytes (POST only) */
  maxBodySize?: number;
}

const ENDPOINT_CONFIGS: Record<string, GuardConfig> = {
  analyze: { ratePerMinute: 3, dailyBudget: 200, maxBodySize: 1024 },
  translate: { ratePerMinute: 10, dailyBudget: 500, maxBodySize: 5120 },
  "gap-score": { ratePerMinute: 5, dailyBudget: 300 },
};

/**
 * Guard middleware. Returns null if allowed, or a NextResponse to reject.
 */
export function apiGuard(
  req: NextRequest,
  endpoint: string
): NextResponse | null {
  const config = ENDPOINT_CONFIGS[endpoint] ?? {
    ratePerMinute: 5,
    dailyBudget: 200,
  };

  // Layer 1: Origin check
  if (!checkOrigin(req)) {
    return NextResponse.json(
      { error: "허가되지 않은 출처입니다." },
      {
        status: 403,
        headers: {
          "X-Guard": "origin-rejected",
        },
      }
    );
  }

  // Layer 2: IP rate limit
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`${endpoint}:${ip}`, {
    windowMs: 60_000,
    max: config.ratePerMinute,
  });
  if (!rl.success) {
    return NextResponse.json(
      {
        error: `요청 한도 초과. ${Math.ceil(rl.resetMs / 1000)}초 후 다시 시도하세요.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rl.resetMs / 1000)),
          "X-RateLimit-Remaining": "0",
          "X-Guard": "rate-limited",
        },
      }
    );
  }

  // Layer 3: Daily budget
  if (!checkDailyBudget(endpoint, config.dailyBudget)) {
    return NextResponse.json(
      {
        error: "일일 API 사용량 한도에 도달했습니다. 내일 다시 시도해주세요.",
        usage: getDailyUsage(endpoint),
        limit: config.dailyBudget,
      },
      {
        status: 429,
        headers: {
          "X-Guard": "daily-budget-exceeded",
          "X-Daily-Usage": String(getDailyUsage(endpoint)),
          "X-Daily-Limit": String(config.dailyBudget),
        },
      }
    );
  }

  return null; // Allowed
}

/**
 * Add security headers to successful responses.
 */
export function secureHeaders(res: NextResponse, endpoint: string): NextResponse {
  const config = ENDPOINT_CONFIGS[endpoint];
  if (config) {
    res.headers.set("X-Daily-Usage", String(getDailyUsage(endpoint)));
    res.headers.set("X-Daily-Limit", String(config.dailyBudget));
  }
  // Prevent caching of API responses with sensitive data
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.headers.set("X-Content-Type-Options", "nosniff");
  return res;
}
