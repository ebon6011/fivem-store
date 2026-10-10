import { Benefits } from "@/components/Benefits";
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";
import { DiscordCta } from "@/components/DiscordCta";
import { Hero } from "@/components/Hero";
import { ArrowRightIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getFeaturedProducts } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts();
  return (
    <>
      <Hero />
      {featured.length > 0 && (
        <section aria-labelledby="featured-heading" className="py-16">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeading
                id="featured-heading"
                eyebrow="Featured"
                title="Featured scripts"
                description="A few of our scripts, ready to drop into your server."
              />
              <ButtonLink href="/store" variant="ghost">
                View all scripts <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product, i) => (
                <li key={product.slug}>
                  <Reveal delay={i * 0.08} className="h-full">
                    <ProductCard product={product} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <Benefits />
      <DiscordCta />
    </>
  );
}
