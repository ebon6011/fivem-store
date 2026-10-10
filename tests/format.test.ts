import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats USD with two decimals", () => {
    expect(formatPrice(19.99)).toBe("$19.99");
    expect(formatPrice(5)).toBe("$5.00");
  });

  it("adds thousands separators", () => {
    expect(formatPrice(1234.5)).toBe("$1,234.50");
  });

  it("shows Free for zero", () => {
    expect(formatPrice(0)).toBe("Free");
  });
});
