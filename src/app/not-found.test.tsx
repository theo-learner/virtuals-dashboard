import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders message and link", () => {
    render(<NotFound />);
    expect(screen.getByText("페이지를 찾을 수 없습니다")).toBeInTheDocument();
    expect(screen.getByText("홈으로 돌아가기")).toBeInTheDocument();
  });
});
