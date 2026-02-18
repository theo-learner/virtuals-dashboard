import { describe, it, expect } from "vitest";
import { rateLimit, getClientIp } from "./rate-limit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const key = "test-allow-" + Date.now();
    const r = rateLimit(key, { windowMs: 60_000, max: 3 });
    expect(r.success).toBe(true);
    expect(r.remaining).toBe(2);
  });

  it("blocks after max reached", () => {
    const key = "test-block-" + Date.now();
    rateLimit(key, { windowMs: 60_000, max: 2 });
    rateLimit(key, { windowMs: 60_000, max: 2 });
    const r = rateLimit(key, { windowMs: 60_000, max: 2 });
    expect(r.success).toBe(false);
    expect(r.remaining).toBe(0);
  });
});

describe("getClientIp", () => {
  it("extracts from x-forwarded-for", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(h)).toBe("1.2.3.4");
  });

  it("falls back to unknown", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
