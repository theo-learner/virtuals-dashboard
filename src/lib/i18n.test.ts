import { describe, it, expect, beforeEach } from "vitest";
import { t, setLocale, getLocale, getMessages } from "./i18n";

describe("i18n", () => {
  beforeEach(() => setLocale("ko"));

  it("returns Korean by default", () => {
    expect(t("nav.dashboard")).toBe("대시보드");
  });

  it("switches to English", () => {
    setLocale("en");
    expect(t("nav.dashboard")).toBe("Dashboard");
    expect(getLocale()).toBe("en");
  });

  it("falls back to Korean for missing keys", () => {
    setLocale("en");
    expect(t("nonexistent.key")).toBe("nonexistent.key");
  });

  it("supports locale override per call", () => {
    expect(t("common.retry", "en")).toBe("Retry");
    expect(t("common.retry", "ko")).toBe("다시 시도");
  });

  it("getMessages returns full dict", () => {
    const msgs = getMessages("en");
    expect(msgs["nav.dashboard"]).toBe("Dashboard");
    expect(Object.keys(msgs).length).toBeGreaterThan(10);
  });
});
