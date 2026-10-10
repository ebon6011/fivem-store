import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ArrowRightIcon, BookIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { getProductBySlug } from "@/data/products";
import { listDocSlugs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description: "Step-by-step installation guides for every script.",
  alternates: { canonical: "/docs" },
};

export default async function DocsIndexPage() {
  const slugs = await listDocSlugs();
  return (
    <Container>
      <PageHeader eyebrow="Docs" title="Installation guides" description="Pick a script to see how to install and configure it." />
      <ul className="grid gap-4 sm:grid-cols-2">
        {slugs.map((slug) => {
          const product = getProductBySlug(slug);
          return (
            <li key={slug}>
              <Link
                href={`/docs/${slug}`}
                className="glass group flex items-center gap-4 p-5 transition hover:border-accent/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <BookIcon />
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-white">{product?.name ?? slug}</span>
                  {product && <span className="block text-sm text-zinc-500">{product.category}</span>}
                </span>
                <ArrowRightIcon className="h-4 w-4 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
