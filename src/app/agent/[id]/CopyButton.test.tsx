import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CopyButton } from "./CopyButton";

describe("CopyButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders copy text", () => {
    render(<CopyButton text="0x123" />);
    const btns = screen.getAllByRole("button");
    expect(btns.length).toBeGreaterThanOrEqual(1);
    expect(btns[0].textContent).toBe("복사");
  });

  it("copies text and shows feedback", async () => {
    render(<CopyButton text="0x123" />);
    const btns = screen.getAllByRole("button");
    fireEvent.click(btns[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("0x123");
    await waitFor(() => {
      expect(btns[0].textContent).toBe("복사됨!");
    });
  });
});
