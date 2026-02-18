import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Error from "./error";

describe("Error page", () => {
  it("renders error message and retry button", () => {
    const reset = vi.fn();
    const err = new Error("test") as Error & { digest?: string };
    render(<Error error={err} reset={reset} />);
    expect(screen.getByText("문제가 발생했습니다")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(reset).toHaveBeenCalled();
  });
});
