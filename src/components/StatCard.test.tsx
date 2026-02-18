import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatCard from "./StatCard";

describe("StatCard", () => {
  it("renders label, value, and icon", () => {
    render(<StatCard label="Total" value="1.5M" icon="📊" />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("1.5M")).toBeInTheDocument();
    expect(screen.getByText("📊")).toBeInTheDocument();
  });

  it("shows trend arrow when provided", () => {
    render(<StatCard label="Growth" value="10%" icon="📈" trend="up" trendLabel="+5%" />);
    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/\+5%/)).toBeInTheDocument();
  });

  it("shows down trend", () => {
    render(<StatCard label="Loss" value="-3%" icon="📉" trend="down" trendLabel="-3%" />);
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });
});
