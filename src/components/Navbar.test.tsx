import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders brand name", () => {
    render(<Navbar />);
    expect(screen.getByText("VIRTUALS")).toBeInTheDocument();
  });

  it("renders desktop nav links", () => {
    render(<Navbar />);
    // Desktop links exist (may be hidden via CSS but still in DOM)
    expect(screen.getAllByText("대시보드").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("분석").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("인사이트").length).toBeGreaterThanOrEqual(1);
  });

  it("toggles mobile menu on click", () => {
    render(<Navbar />);
    const buttons = screen.getAllByRole("button");
    const hamburger = buttons[0];
    const linksBefore = screen.getAllByText("대시보드").length;
    fireEvent.click(hamburger);
    const linksAfter = screen.getAllByText("대시보드").length;
    expect(linksAfter).toBeGreaterThan(linksBefore);
  });
});
