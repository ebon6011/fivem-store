import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { getProductBySlug } from "@/data/products";
import { getDoc, listDocSlugs } from "@/lib/docs";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await listDocSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: `How to install and configure ${getProductBySlug(slug)?.name ?? slug}.`,
    alternates: { canonical: `/docs/${slug}` },
  };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const doc = await getDoc(slug);
  if (!doc) notFound();
  const product = getProductBySlug(slug);

  return (
    <Container size="narrow" className="py-12">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
        <Link href="/docs" className="hover:text-white">Docs</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-zinc-300">{product?.name ?? slug}</span>
      </nav>
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">{doc.title}</h1>
      <article
        className="prose prose-invert mt-8 max-w-none prose-headings:font-display prose-a:text-accent prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/40"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />
      {product && (
        <div className="mt-12 border-t border-white/10 pt-8">
          <ButtonLink href={`/scripts/${slug}`} variant="ghost">← Back to {product.name}</ButtonLink>
        </div>
      )}
    </Container>
  );
}
