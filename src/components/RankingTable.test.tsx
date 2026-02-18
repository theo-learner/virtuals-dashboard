import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RankingTable from "./RankingTable";
import type { RankingAgent } from "@/lib/api";

const mockAgents: RankingAgent[] = [
  {
    agentId: "1", agentName: "Agent Alpha", rank: 1, totalRevenue: 50000,
    successRate: 0.85, successfulJobCount: 100, uniqueBuyerCount: 50,
    rating: 4.5, category: "ON_CHAIN", role: "Trader", prizePoolPercentage: 10,
    hasGraduated: true, tokenAddress: "0xabc", profilePic: "", twitterHandle: "@alpha",
  },
  {
    agentId: "2", agentName: "Agent Beta", rank: 2, totalRevenue: 30000,
    successRate: 0.6, successfulJobCount: 80, uniqueBuyerCount: 30,
    rating: 3.8, category: "HYBRID", role: "Analyst", prizePoolPercentage: 5,
    hasGraduated: false, tokenAddress: "0xdef", profilePic: "", twitterHandle: "@beta",
  },
  {
    agentId: "3", agentName: "Agent Zero", rank: 3, totalRevenue: 0,
    successRate: 0.1, successfulJobCount: 2, uniqueBuyerCount: 1,
    rating: 1.0, category: "OFF_CHAIN", role: "Bot", prizePoolPercentage: 0,
    hasGraduated: false, tokenAddress: "0x000", profilePic: "", twitterHandle: "",
  },
];

describe("RankingTable", () => {
  it("renders agent names", () => {
    render(<RankingTable agents={mockAgents} />);
    expect(screen.getByText("Agent Alpha")).toBeInTheDocument();
    expect(screen.getByText("Agent Beta")).toBeInTheDocument();
  });

  it("filters out zero-revenue agents by default", () => {
    render(<RankingTable agents={mockAgents} />);
    expect(screen.queryByText("Agent Zero")).not.toBeInTheDocument();
  });

  it("shows all agents when toggled", () => {
    render(<RankingTable agents={mockAgents} />);
    // The pill button with "전체" text (not the select option)
    const pills = screen.getAllByText("전체");
    const pillBtn = pills.find((el) => el.tagName === "BUTTON");
    expect(pillBtn).toBeDefined();
    fireEvent.click(pillBtn!);
    expect(screen.getByText("Agent Zero")).toBeInTheDocument();
  });

  it("filters by search", () => {
    const { container } = render(<RankingTable agents={mockAgents} />);
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "Alpha" } });
    expect(container.textContent).toContain("Agent Alpha");
    expect(container.textContent).not.toContain("Agent Beta");
  });

  it("switches to card view", () => {
    const { container } = render(<RankingTable agents={mockAgents} />);
    const cardBtns = screen.getAllByTitle("카드 뷰");
    fireEvent.click(cardBtns[0]);
    expect(container.textContent).toContain("Agent Alpha");
  });

  it("filters by category", () => {
    const { container } = render(<RankingTable agents={mockAgents} />);
    const select = container.querySelector("select")!;
    fireEvent.change(select, { target: { value: "ON_CHAIN" } });
    expect(container.textContent).toContain("Agent Alpha");
    expect(container.textContent).not.toContain("Agent Beta");
  });
});
