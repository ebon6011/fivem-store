// Everything about the store that you might want to change lives here.
export const site = {
  name: "Rocky Shop",
  tagline: "Premium FiveM scripts for ESX, QBCore, QBox and standalone servers.",
  description:
    "Rocky Shop sells optimized FiveM scripts: jobs, vehicles, UI, economy and housing, for ESX, QBCore, QBox and standalone servers.",
  // Change to your real address after deploying (used for SEO, sitemap and share images).
  url: "https://rocky-shop.vercel.app",
  // The neon accent color. Change this one value to recolor the whole site.
  accent: "#8B5CF6",
  discordUrl: "https://discord.gg/REPLACE_ME",
  tebexStoreUrl: "https://YOUR-STORE.tebex.io",
  currency: "USD",
  locale: "en-US",
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/store", label: "Store" },
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = [
  { href: "/store", label: "Store" },
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/refund-policy", label: "Refund Policy" },
] as const;
