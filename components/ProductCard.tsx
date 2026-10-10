import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { FrameworkBadges } from "./FrameworkBadges";
import { ArrowRightIcon } from "./icons";

export function ProductCard({ product }: { product: Product }) {
  const cover = product.images[0];
  return (
    <Link
      href={`/scripts/${product.slug}`}
      className="group glass flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_0_40px_-12px_var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={cover}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          unoptimized={cover.endsWith(".svg")}
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs text-zinc-200 backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold text-white">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-zinc-400">{product.shortDescription}</p>
        <FrameworkBadges frameworks={product.frameworks} size="sm" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-semibold text-white">{formatPrice(product.price)}</span>
          <span className="flex items-center gap-1 text-sm font-medium text-zinc-300 transition group-hover:text-white">
            View details <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
