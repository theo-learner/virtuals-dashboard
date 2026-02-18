import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ClientErrorBoundary } from "./ClientErrorBoundary";

describe("ClientErrorBoundary", () => {
  it("renders children", () => {
    render(<ClientErrorBoundary><p>Child</p></ClientErrorBoundary>);
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
