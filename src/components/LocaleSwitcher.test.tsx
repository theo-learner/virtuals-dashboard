import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import LocaleSwitcher from "./LocaleSwitcher";
import { LocaleProvider } from "@/lib/LocaleContext";
import { setLocale } from "@/lib/i18n";

beforeEach(() => {
  cleanup();
  setLocale("ko");
});

describe("LocaleSwitcher", () => {
  it("renders EN button by default (ko locale)", () => {
    const { container } = render(<LocaleProvider><LocaleSwitcher /></LocaleProvider>);
    const btn = container.querySelector("button")!;
    expect(btn.textContent).toBe("EN");
  });

  it("switches to 한국어 after click", () => {
    const { container } = render(<LocaleProvider><LocaleSwitcher /></LocaleProvider>);
    const btn = container.querySelector("button")!;
    fireEvent.click(btn);
    expect(btn.textContent).toBe("한국어");
  });

  it("toggles back to EN on second click", () => {
    const { container } = render(<LocaleProvider><LocaleSwitcher /></LocaleProvider>);
    const btn = container.querySelector("button")!;
    fireEvent.click(btn);
    fireEvent.click(btn);
    expect(btn.textContent).toBe("EN");
  });
});
