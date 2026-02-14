/**
 * In-memory sliding window rate limiter.
 * Vercel serverless: each instance has its own memory, so this is per-instance.
 * For stronger protection, use Vercel KV or Upstash Redis.
 */

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

// Cleanup old entries every 5 minutes
let lastCleanup = Date.now();
function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  const cutoff = now - windowMs;
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  { windowMs = 60_000, max = 5 }: { windowMs?: number; max?: number } = {}
): { success: boolean; remaining: number; resetMs: number } {
  cleanup(windowMs);
  const now = Date.now();
  const cutoff = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= max) {
    const oldest = entry.timestamps[0];
    return {
      success: false,
      remaining: 0,
      resetMs: oldest + windowMs - now,
    };
  }

  entry.timestamps.push(now);
  return {
    success: true,
    remaining: max - entry.timestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Get client IP from request headers (Vercel/Cloudflare).
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
