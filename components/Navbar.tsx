"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, site } from "@/config/site";
import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";
import { ChatIcon, CloseIcon, MenuIcon } from "./icons";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-white"
        >
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent glow" />
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm transition hover:text-white ${
                isActive(link.href) ? "text-white" : "text-zinc-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href={site.discordUrl} external className="px-4 py-2">
            <ChatIcon className="h-4 w-4" />
            Discord
          </ButtonLink>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-zinc-300 hover:text-white md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            <Container className="flex flex-col gap-1 py-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`rounded-lg px-3 py-3 text-base ${
                    isActive(link.href) ? "bg-white/5 text-white" : "text-zinc-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <ButtonLink href={site.discordUrl} external className="mt-2">
                <ChatIcon className="h-4 w-4" />
                Join Discord
              </ButtonLink>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
