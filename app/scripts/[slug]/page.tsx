import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { FrameworkBadges } from "@/components/FrameworkBadges";
import { Gallery } from "@/components/Gallery";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { site } from "@/config/site";
import { getProductBySlug, products } from "@/data/products";
import { changelogNewestFirst } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/scripts/${product.slug}` },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: product.name,
      description: product.shortDescription,
      url: `/scripts/${product.slug}`,
    },
  };
}

export default async function ScriptPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const changelog = changelogNewestFirst(product);
  // Product structured data for search engines. Deliberately no review or rating fields.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((img) => `${site.url}${img}`),
    sku: product.slug,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: site.currency,
      availability: "https://schema.org/InStock",
      url: product.tebexUrl,
    },
  };

  return (
    <Container className="py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-500">
        <Link href="/store" className="hover:text-white">Store</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-zinc-300">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-6">
          <Gallery images={product.images} name={product.name} />
          {product.youtubeId && <YouTubeEmbed id={product.youtubeId} title={`${product.name} preview video`} />}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass space-y-5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">{product.category}</p>
            <h1 className="font-display text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-zinc-400">{product.shortDescription}</p>
            <FrameworkBadges frameworks={product.frameworks} />
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-zinc-500">Version</dt>
                <dd className="font-medium text-white">v{product.version}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Code</dt>
                <dd className="font-medium text-white">{product.escrow ? "Escrow (config open)" : "Open source"}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <span className="text-3xl font-bold text-white">{formatPrice(product.price)}</span>
              <ButtonLink href={product.tebexUrl} external>
                {product.price === 0 ? "Get it free" : "Buy Now"}
              </ButtonLink>
            </div>
            <p className="text-xs text-zinc-500">Secure checkout on Tebex. Opens in a new tab.</p>
            <Link href={`/docs/${product.slug}`} className="flex items-center gap-1 text-sm font-medium text-zinc-300 hover:text-white">
              Read the installation guide <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="about-heading" className="glass p-6 lg:col-span-2">
          <h2 id="about-heading" className="font-display text-xl font-semibold text-white">About this script</h2>
          <p className="mt-3 whitespace-pre-line text-zinc-400">{product.description}</p>
          <h2 className="mt-8 font-display text-xl font-semibold text-white">Features</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-3 text-zinc-300">
                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="deps-heading" className="glass p-6">
            <h2 id="deps-heading" className="font-display text-xl font-semibold text-white">Dependencies</h2>
            {product.dependencies.length > 0 ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {product.dependencies.map((dep) => (
                  <li key={dep}>
                    <code className="rounded-md bg-white/5 px-2 py-1 text-sm text-zinc-200">{dep}</code>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-zinc-400">None. Works out of the box.</p>
            )}
          </section>

          <section aria-labelledby="changelog-heading" className="glass p-6">
            <h2 id="changelog-heading" className="font-display text-xl font-semibold text-white">Changelog</h2>
            <ol className="mt-4 space-y-4">
              {changelog.map((entry) => (
                <li key={entry.version}>
                  <p className="text-sm">
                    <span className="font-semibold text-white">v{entry.version}</span>{" "}
                    <time dateTime={entry.date} className="text-zinc-500">{entry.date}</time>
                  </p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-400">
                    {entry.changes.map((change) => (
                      <li key={change}>{change}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </Container>
  );
}
