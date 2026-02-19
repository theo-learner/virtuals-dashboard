import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("recharts", () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div />,
  Cell: () => <div />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  ScatterChart: ({ children }: any) => <div data-testid="scatter-chart">{children}</div>,
  Scatter: () => <div />,
  CartesianGrid: () => <div />,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
}));

import { CategoryPieChart, RevenueBarChart, SuccessRevenueScatter, RoleDistribution } from "./Charts";

const mockAgents: any[] = [
  { agentId: "1", agentName: "Agent1", totalRevenue: 1000, successRate: 0.8, category: "DEFI", role: "AUTONOMOUS" },
  { agentId: "2", agentName: "Agent2", totalRevenue: 500, successRate: 0.6, category: "SOCIAL", role: "MANUAL" },
];

describe("Charts", () => {
  it("CategoryPieChart renders heading", () => {
    render(<CategoryPieChart agents={mockAgents} />);
    expect(screen.getByText("카테고리 분포")).toBeInTheDocument();
  });

  it("RevenueBarChart renders heading", () => {
    render(<RevenueBarChart agents={mockAgents} />);
    expect(screen.getByText("수익 상위 20")).toBeInTheDocument();
  });

  it("SuccessRevenueScatter renders heading", () => {
    render(<SuccessRevenueScatter agents={mockAgents} />);
    expect(screen.getByText("성공률 vs 수익")).toBeInTheDocument();
  });

  it("RoleDistribution renders heading", () => {
    render(<RoleDistribution agents={mockAgents} />);
    expect(screen.getByText("역할 분포")).toBeInTheDocument();
  });
});
