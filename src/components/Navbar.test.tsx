import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";
import { LocaleProvider } from "@/lib/LocaleContext";

function renderWithLocale() {
  return render(<LocaleProvider><Navbar /></LocaleProvider>);
}

describe("Navbar", () => {
  it("renders brand name", () => {
    renderWithLocale();
    expect(screen.getByText("VIRTUALS")).toBeInTheDocument();
  });

  it("renders desktop nav links", () => {
    renderWithLocale();
    expect(screen.getAllByText("대시보드").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("분석").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("인사이트").length).toBeGreaterThanOrEqual(1);
  });

  it("toggles mobile menu on click", () => {
    renderWithLocale();
    // Find the hamburger button (contains svg)
    const buttons = screen.getAllByRole("button");
    const hamburger = buttons.find(b => b.querySelector("svg"));
    expect(hamburger).toBeTruthy();
    const linksBefore = screen.getAllByText("대시보드").length;
    fireEvent.click(hamburger!);
    const linksAfter = screen.getAllByText("대시보드").length;
    expect(linksAfter).toBeGreaterThan(linksBefore);
  });
});
