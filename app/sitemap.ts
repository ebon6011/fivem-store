import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { products } from "@/data/products";
import { changelogNewestFirst } from "@/lib/catalog";
import { listDocSlugs } from "@/lib/docs";

const STATIC_PATHS = ["", "/store", "/docs", "/faq", "/contact", "/terms", "/refund-policy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docSlugs = await listDocSlugs();
  return [
    ...STATIC_PATHS.map((p) => ({
      url: `${site.url}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.6,
    })),
    ...products.map((p) => ({
      url: `${site.url}/scripts/${p.slug}`,
      lastModified: changelogNewestFirst(p)[0]?.date ?? p.releasedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...docSlugs.map((slug) => ({
      url: `${site.url}/docs/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
