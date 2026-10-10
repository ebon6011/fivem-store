import Link from "next/link";
import { footerLinks, site } from "@/config/site";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5">
      <Container className="flex flex-col gap-6 py-10 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-display font-semibold text-white">{site.name}</span>: {site.tagline}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.label}
            </Link>
          ))}
          <a href={site.tebexStoreUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Tebex store
          </a>
          <a href={site.discordUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Discord
          </a>
        </nav>
      </Container>
      <Container className="pb-8 text-xs text-zinc-500">
        © {new Date().getFullYear()} {site.name}. Not affiliated with Rockstar Games, Take-Two Interactive or Cfx.re.
      </Container>
    </footer>
  );
}
