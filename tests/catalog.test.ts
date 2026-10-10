import { describe, expect, it } from "vitest";
import type { Product } from "@/data/products";
import {
  type CatalogQuery,
  changelogNewestFirst,
  DEFAULT_QUERY,
  filterAndSort,
  parseQuery,
  toggleValue,
  toSearchParams,
} from "@/lib/catalog";

function make(o: Partial<Product> & Pick<Product, "slug">): Product {
  return {
    name: o.slug,
    shortDescription: "",
    description: "",
    price: 10,
    category: "Misc",
    frameworks: ["Standalone"],
    images: ["/x.svg"],
    features: [],
    dependencies: [],
    version: "1.0.0",
    releasedAt: "2026-01-01",
    changelog: [],
    featured: false,
    escrow: true,
    tebexUrl: "https://example.tebex.io/package/1",
    ...o,
  };
}

const garage = make({
  slug: "garage", name: "Advanced Garage", category: "Vehicles",
  frameworks: ["ESX", "QBCore"], price: 25, releasedAt: "2026-09-01",
  features: ["Impound system"],
});
const hud = make({
  slug: "hud", name: "Minimal HUD", category: "UI", frameworks: ["Standalone"],
  price: 10, releasedAt: "2026-08-01", description: "A sleek (C++ style) HUD",
});
const job = make({
  slug: "job", name: "Delivery Job", category: "Jobs",
  frameworks: ["QBox", "QBCore"], price: 0, releasedAt: "2026-07-01",
});
const all = [hud, job, garage];
const q = (o: Partial<CatalogQuery> = {}): CatalogQuery => ({ ...DEFAULT_QUERY, ...o });
const slugs = (ps: Product[]) => ps.map((p) => p.slug);

describe("filterAndSort", () => {
  it("sorts newest first by default", () => {
    expect(slugs(filterAndSort(all, q()))).toEqual(["garage", "hud", "job"]);
  });

  it("sorts by price both ways, free first when ascending", () => {
    expect(slugs(filterAndSort(all, q({ sort: "price-asc" })))).toEqual(["job", "hud", "garage"]);
    expect(slugs(filterAndSort(all, q({ sort: "price-desc" })))).toEqual(["garage", "hud", "job"]);
  });

  it("breaks ties by name", () => {
    const alpha = make({ slug: "alpha", name: "Alpha", price: 10 });
    expect(slugs(filterAndSort([hud, alpha], q({ sort: "price-asc" })))).toEqual(["alpha", "hud"]);
  });

  it("searches names case-insensitively and ignores surrounding spaces", () => {
    expect(slugs(filterAndSort(all, q({ search: "garage" })))).toEqual(["garage"]);
    expect(slugs(filterAndSort(all, q({ search: "  GARAGE  " })))).toEqual(["garage"]);
  });

  it("searches features and descriptions", () => {
    expect(slugs(filterAndSort(all, q({ search: "impound" })))).toEqual(["garage"]);
    expect(slugs(filterAndSort(all, q({ search: "sleek" })))).toEqual(["hud"]);
  });

  it("treats special characters literally", () => {
    expect(slugs(filterAndSort(all, q({ search: "(c++" })))).toEqual(["hud"]);
    expect(slugs(filterAndSort(all, q({ search: "[" })))).toEqual([]);
  });

  it("matches products supporting ANY selected framework", () => {
    expect(slugs(filterAndSort(all, q({ frameworks: ["ESX", "QBox"] })))).toEqual(["garage", "job"]);
  });

  it("filters by one or more categories", () => {
    expect(slugs(filterAndSort(all, q({ categories: ["UI"] })))).toEqual(["hud"]);
    expect(slugs(filterAndSort(all, q({ categories: ["UI", "Jobs"] })))).toEqual(["hud", "job"]);
  });

  it("combines framework, category and search filters", () => {
    expect(slugs(filterAndSort(all, q({ frameworks: ["QBCore"], categories: ["Jobs"] })))).toEqual(["job"]);
    expect(slugs(filterAndSort(all, q({ frameworks: ["QBCore"], search: "delivery" })))).toEqual(["job"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterAndSort(all, q({ search: "zzz" }))).toEqual([]);
  });

  it("does not change the input array", () => {
    const input = [hud, job, garage];
    filterAndSort(input, q({ sort: "price-desc" }));
    expect(slugs(input)).toEqual(["hud", "job", "garage"]);
  });
});

describe("parseQuery", () => {
  it("reads valid values", () => {
    const params = new URLSearchParams("q=hud&fw=ESX,QBox&cat=UI&sort=price-asc");
    expect(parseQuery(params)).toEqual({
      search: "hud", frameworks: ["ESX", "QBox"], categories: ["UI"], sort: "price-asc",
    });
  });

  it("ignores unknown values instead of breaking", () => {
    const params = new URLSearchParams("fw=Foo,ESX&cat=Cars&sort=zzz");
    expect(parseQuery(params)).toEqual({ ...DEFAULT_QUERY, frameworks: ["ESX"] });
  });

  it("removes duplicates", () => {
    expect(parseQuery(new URLSearchParams("fw=ESX,ESX")).frameworks).toEqual(["ESX"]);
  });

  it("returns defaults for an empty query", () => {
    expect(parseQuery(new URLSearchParams())).toEqual(DEFAULT_QUERY);
  });
});

describe("toSearchParams", () => {
  it("leaves defaults out of the URL", () => {
    expect(toSearchParams(DEFAULT_QUERY).toString()).toBe("");
    expect(toSearchParams(q({ search: "   " })).toString()).toBe("");
  });

  it("round-trips through parseQuery", () => {
    const query = q({ search: "garage", frameworks: ["ESX", "QBCore"], categories: ["Vehicles"], sort: "price-desc" });
    expect(parseQuery(toSearchParams(query))).toEqual(query);
  });
});

describe("toggleValue", () => {
  it("adds a missing value and removes a present one", () => {
    expect(toggleValue(["ESX"], "QBox")).toEqual(["ESX", "QBox"]);
    expect(toggleValue(["ESX", "QBox"], "ESX")).toEqual(["QBox"]);
  });
});

describe("changelogNewestFirst", () => {
  it("orders entries by date, newest first, without changing the product", () => {
    const p = make({
      slug: "p",
      changelog: [
        { version: "1.0.0", date: "2026-01-01", changes: ["a"] },
        { version: "1.1.0", date: "2026-03-01", changes: ["b"] },
      ],
    });
    expect(changelogNewestFirst(p).map((e) => e.version)).toEqual(["1.1.0", "1.0.0"]);
    expect(p.changelog[0].version).toBe("1.0.0");
  });
});
