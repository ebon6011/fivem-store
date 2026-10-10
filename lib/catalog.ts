import {
  CATEGORIES,
  type Category,
  type ChangelogEntry,
  type Framework,
  FRAMEWORKS,
  type Product,
} from "@/data/products";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogQuery {
  search: string;
  frameworks: Framework[];
  categories: Category[];
  sort: SortKey;
}

export const DEFAULT_QUERY: CatalogQuery = {
  search: "",
  frameworks: [],
  categories: [],
  sort: "newest",
};

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  newest: (a, b) => b.releasedAt.localeCompare(a.releasedAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

function matchesSearch(product: Product, term: string): boolean {
  if (!term) return true;
  const haystack = [product.name, product.shortDescription, product.description, ...product.features]
    .join("\n")
    .toLowerCase();
  return haystack.includes(term);
}

export function filterAndSort(products: readonly Product[], query: CatalogQuery): Product[] {
  const term = query.search.trim().toLowerCase();
  const compare = comparators[query.sort];
  return products
    .filter((p) => matchesSearch(p, term))
    .filter((p) => query.frameworks.length === 0 || p.frameworks.some((f) => query.frameworks.includes(f)))
    .filter((p) => query.categories.length === 0 || query.categories.includes(p.category))
    .sort((a, b) => compare(a, b) || a.name.localeCompare(b.name));
}

// Keeps only allowed values, in their canonical order, without duplicates.
function pickList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  const wanted = new Set(raw.split(","));
  return allowed.filter((value) => wanted.has(value));
}

function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseQuery(params: URLSearchParams): CatalogQuery {
  const sort = params.get("sort");
  return {
    search: params.get("q") ?? "",
    frameworks: pickList(params.get("fw"), FRAMEWORKS),
    categories: pickList(params.get("cat"), CATEGORIES),
    sort: isSortKey(sort) ? sort : DEFAULT_QUERY.sort,
  };
}

export function toSearchParams(query: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search.trim()) params.set("q", query.search);
  if (query.frameworks.length) params.set("fw", query.frameworks.join(","));
  if (query.categories.length) params.set("cat", query.categories.join(","));
  if (query.sort !== DEFAULT_QUERY.sort) params.set("sort", query.sort);
  return params;
}

export function toggleValue<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function changelogNewestFirst(product: Product): ChangelogEntry[] {
  return [...product.changelog].sort((a, b) => b.date.localeCompare(a.date));
}
