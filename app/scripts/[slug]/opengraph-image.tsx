import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { getProductBySlug } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { OgCard, ogSize } from "@/lib/og";

export const alt = `${site.name} script`;
export const size = ogSize;
export const contentType = "image/png";

// Slugs come from the page's generateStaticParams in this same folder.
export default async function ScriptOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  const title = product?.name ?? site.name;
  const subtitle = product ? `${formatPrice(product.price)} · ${product.frameworks.join(" · ")}` : site.tagline;
  return new ImageResponse(<OgCard title={title} subtitle={subtitle} />, size);
}
