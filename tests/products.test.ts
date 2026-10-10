import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getFeaturedProducts, getProductBySlug, products } from "@/data/products";

// Any field not listed here (e.g. "rating", "reviews", "sales") fails the test.
const ALLOWED_KEYS = new Set([
  "slug", "name", "shortDescription", "description", "price", "category",
  "frameworks", "images", "youtubeId", "features", "dependencies", "version",
  "releasedAt", "changelog", "featured", "escrow", "tebexUrl",
]);

describe("products data", () => {
  it("has at least one product and unique slugs", () => {
    const slugs = products.map((p) => p.slug);
    expect(slugs.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(products.map((p) => [p.slug, p] as const))("%s is valid", (_slug, p) => {
    expect(p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(existsSync(path.join(process.cwd(), "content", "docs", `${p.slug}.md`))).toBe(true);
    expect(p.images.length).toBeGreaterThan(0);
    for (const img of p.images) {
      expect(img.startsWith("/")).toBe(true);
      expect(existsSync(path.join(process.cwd(), "public", img))).toBe(true);
    }
    expect(new URL(p.tebexUrl).protocol).toBe("https:");
    expect(p.frameworks.length).toBeGreaterThan(0);
    expect(p.price).toBeGreaterThanOrEqual(0);
    expect(p.releasedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const entry of p.changelog) expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const key of Object.keys(p)) expect(ALLOWED_KEYS.has(key), `unexpected field "${key}"`).toBe(true);
  });

  it("finds products by slug", () => {
    expect(getProductBySlug("placeholder-advanced-garage")?.category).toBe("Vehicles");
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns only featured products", () => {
    const featured = getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});
