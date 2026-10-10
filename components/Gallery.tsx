"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = images[index];
  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="space-y-3">
      <div
        role="group"
        aria-label={`${name} images`}
        tabIndex={count > 1 ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="glass relative aspect-video overflow-hidden focus-visible:outline-2 focus-visible:outline-accent"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image
              src={current}
              alt={`${name}, image ${index + 1} of ${count}`}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 60vw, 100vw"
              unoptimized={current.endsWith(".svg")}
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl text-white backdrop-blur hover:bg-black/80"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-xl text-white backdrop-blur hover:bg-black/80"
            >
              ›
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-video w-full overflow-hidden rounded-lg border-2 transition ${
                  i === index ? "border-accent" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="20vw" unoptimized={src.endsWith(".svg")} className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
