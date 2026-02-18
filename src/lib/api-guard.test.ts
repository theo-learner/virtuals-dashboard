import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/server
vi.mock("next/server", () => {
  class MockNextResponse {
    status: number;
    body: unknown;
    headers: Map<string, string>;
    constructor(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status ?? 200;
      this.headers = new Map(Object.entries(init?.headers ?? {}));
    }
    static json(data: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(data, init);
    }
  }
  return { NextRequest: class {}, NextResponse: MockNextResponse };
});

// We need to test apiGuard and secureHeaders
// apiGuard needs a NextRequest-like object
describe("api-guard", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("allows same-origin requests", async () => {
    const { apiGuard } = await import("./api-guard");
    const req = {
      headers: new Headers({
        origin: "https://virtuals-dashboard.vercel.app",
      }),
    } as any;
    const result = apiGuard(req, "analyze");
    expect(result).toBeNull();
  });

  it("allows requests with no origin (server components)", async () => {
    const { apiGuard } = await import("./api-guard");
    const req = { headers: new Headers() } as any;
    const result = apiGuard(req, "analyze");
    expect(result).toBeNull();
  });

  it("blocks cross-origin requests", async () => {
    const { apiGuard } = await import("./api-guard");
    const req = {
      headers: new Headers({ origin: "https://evil.com" }),
    } as any;
    const result = apiGuard(req, "analyze");
    expect(result).not.toBeNull();
    expect((result as any).status).toBe(403);
  });

  it("allows vercel preview deployments", async () => {
    const { apiGuard } = await import("./api-guard");
    const req = {
      headers: new Headers({ origin: "https://my-preview-123.vercel.app" }),
    } as any;
    const result = apiGuard(req, "analyze");
    expect(result).toBeNull();
  });

  it("rate limits after too many requests", async () => {
    const { apiGuard } = await import("./api-guard");
    // analyze has ratePerMinute: 3
    const ip = "rate-test-" + Date.now();
    const req = () => ({
      headers: new Headers({
        origin: "https://virtuals-dashboard.vercel.app",
        "x-forwarded-for": ip,
      }),
    }) as any;
    apiGuard(req(), "analyze");
    apiGuard(req(), "analyze");
    apiGuard(req(), "analyze");
    const result = apiGuard(req(), "analyze");
    expect(result).not.toBeNull();
    expect((result as any).status).toBe(429);
  });

  it("secureHeaders adds headers", async () => {
    const { secureHeaders } = await import("./api-guard");
    const { NextResponse } = await import("next/server");
    const res = NextResponse.json({ ok: true });
    const result = secureHeaders(res, "analyze");
    expect(result.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });
});
