import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Loading from "./loading";

describe("Loading", () => {
  it("renders skeleton", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders stat card skeletons", () => {
    const { container } = render(<Loading />);
    expect(container.querySelectorAll(".glass-card").length).toBeGreaterThanOrEqual(1);
  });
});
