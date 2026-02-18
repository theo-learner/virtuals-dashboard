import { describe, it, expect } from "vitest";
import { formatNumber, formatPercent } from "./format";

describe("formatNumber", () => {
  it("formats millions", () => {
    expect(formatNumber(1_500_000)).toBe("1.50M");
    expect(formatNumber(1_000_000)).toBe("1.00M");
  });

  it("formats thousands", () => {
    expect(formatNumber(1_500)).toBe("1.5K");
    expect(formatNumber(1_000)).toBe("1.0K");
  });

  it("formats small numbers", () => {
    expect(formatNumber(42)).toBe("42.00");
    expect(formatNumber(0.5)).toBe("0.50");
  });
});

describe("formatPercent", () => {
  it("formats with one decimal", () => {
    expect(formatPercent(12.345)).toBe("12.3%");
    expect(formatPercent(0)).toBe("0.0%");
    expect(formatPercent(100)).toBe("100.0%");
  });
});
