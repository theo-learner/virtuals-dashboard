import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

function ThrowingChild() {
  throw new Error("test error");
}

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(<ErrorBoundary><p>Hello</p></ErrorBoundary>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders fallback on error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorBoundary><ThrowingChild /></ErrorBoundary>);
    expect(screen.getByText("문제가 발생했습니다")).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("renders custom fallback", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorBoundary fallback={<p>Custom</p>}><ThrowingChild /></ErrorBoundary>);
    expect(screen.getByText("Custom")).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("has retry button in error state", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorBoundary><ThrowingChild /></ErrorBoundary>);
    const btns = screen.getAllByRole("button", { name: "다시 시도" });
    expect(btns.length).toBeGreaterThanOrEqual(1);
    vi.restoreAllMocks();
  });
});
