"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORIES, FRAMEWORKS, type Product } from "@/data/products";
import {
  type CatalogQuery,
  DEFAULT_QUERY,
  filterAndSort,
  parseQuery,
  SORT_OPTIONS,
  type SortKey,
  toggleValue,
  toSearchParams,
} from "@/lib/catalog";
import { inputClass } from "@/lib/styles";
import { ChipGroup } from "./ChipGroup";
import { ProductGrid } from "./ProductGrid";

export function StoreView({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => parseQuery(new URLSearchParams(searchParams.toString())), [searchParams]);
  // Search text is kept locally so fast typing never drops characters.
  const [search, setSearch] = useState(query.search);
  const current = useMemo<CatalogQuery>(() => ({ ...query, search }), [query, search]);
  const results = useMemo(() => filterAndSort(products, current), [products, current]);
  const hasFilters = search.trim() !== "" || current.frameworks.length > 0 || current.categories.length > 0;

  function commit(next: CatalogQuery) {
    const qs = toSearchParams(next).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearFilters() {
    setSearch("");
    commit({ ...DEFAULT_QUERY, sort: current.sort });
  }

  return (
    <div className="space-y-8">
      <div className="glass space-y-5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Search scripts</span>
            <input
              type="search"
              value={search}
              placeholder="Search scripts…"
              onChange={(e) => {
                setSearch(e.target.value);
                commit({ ...current, search: e.target.value });
              }}
              className={inputClass}
            />
          </label>
          <label className="sm:w-60">
            <span className="sr-only">Sort by</span>
            <select
              value={current.sort}
              onChange={(e) => commit({ ...current, sort: e.target.value as SortKey })}
              className={inputClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-zinc-900">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ChipGroup
          label="Framework"
          options={FRAMEWORKS}
          selected={current.frameworks}
          onToggle={(f) => commit({ ...current, frameworks: toggleValue(current.frameworks, f) })}
        />
        <ChipGroup
          label="Category"
          options={CATEGORIES}
          selected={current.categories}
          onToggle={(c) => commit({ ...current, categories: toggleValue(current.categories, c) })}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "script" : "scripts"}
        </p>
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="text-zinc-300 underline-offset-4 hover:text-white hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <div className="glass p-12 text-center">
          <p className="font-display text-xl font-semibold text-white">No scripts match</p>
          <p className="mt-2 text-zinc-400">Try a different search or clear your filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
