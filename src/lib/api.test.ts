import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchRanking, fetchAgentDetail, fetchVirtuals } from "./api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchRanking", () => {
  it("returns data array", async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve({ data: [{ agentId: "1" }] }) });
    const result = await fetchRanking();
    expect(result).toEqual([{ agentId: "1" }]);
  });

  it("returns empty array when no data", async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve({}) });
    const result = await fetchRanking();
    expect(result).toEqual([]);
  });
});

describe("fetchAgentDetail", () => {
  it("returns agent detail", async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve({ data: { name: "Test" } }) });
    const result = await fetchAgentDetail("123");
    expect(result).toEqual({ name: "Test" });
  });

  it("returns null when no data", async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve({}) });
    const result = await fetchAgentDetail("123");
    expect(result).toBeNull();
  });
});

describe("fetchVirtuals", () => {
  it("returns virtuals array", async () => {
    mockFetch.mockResolvedValue({ json: () => Promise.resolve({ data: [{ id: "v1" }] }) });
    const result = await fetchVirtuals();
    expect(result).toEqual([{ id: "v1" }]);
  });
});
