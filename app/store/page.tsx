import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreView } from "@/components/StoreView";
import { products } from "@/data/products";
import { DEFAULT_QUERY, filterAndSort } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse every FiveM script we sell. Filter by framework (ESX, QBCore, QBox, Standalone) and category.",
  alternates: { canonical: "/store" },
};

export default function StorePage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Store"
        title="All scripts"
        description="Search, filter by framework or category, and sort by price or release date."
      />
      {/* The fallback is the full list, so search engines and no-JS visitors still see every script. */}
      <Suspense fallback={<ProductGrid products={filterAndSort(products, DEFAULT_QUERY)} />}>
        <StoreView products={products} />
      </Suspense>
    </Container>
  );
}
