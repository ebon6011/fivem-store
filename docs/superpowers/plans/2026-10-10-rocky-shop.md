# Rocky Shop Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Rocky Shop FiveM script store website: a static Next.js site with a store, script pages, markdown install guides, FAQ, contact and legal pages, with all products in one data file and "Buy Now" linking to Tebex.

**Architecture:** Fully static Next.js App Router site. Product data lives in `data/products.ts`. Pure logic (search/filter/sort, URL query parsing, markdown loading, price formatting) lives in `lib/` and is unit-tested with Vitest. Pages are server components; only interactive pieces (navbar menu, store filters, gallery, video, accordion, contact form, animations) are client components.

**Tech Stack:** Next.js 16.4.0, React 19, TypeScript 5, Tailwind CSS 4 + @tailwindcss/typography, Framer Motion 14, gray-matter + remark + remark-html, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-10-rocky-shop-design.md`

## Global Constraints

- Project root: `D:\AI\fivem-store` (own git repo). Never touch `D:\AI\Arise`.
- Must work on Windows with `npm install` + `npm run dev`. Node 24 / npm 11.
- Only these packages: `next`, `react`, `react-dom`, `typescript`, `@types/*`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/typography`, `eslint`, `eslint-config-next`, `framer-motion`, `gray-matter`, `remark`, `remark-html`, `vitest`. Anything else → ask the owner first.
- Store name `Rocky Shop`. Accent `#8B5CF6`. Currency USD.
- Accent color has ONE source of truth: `site.accent` in `config/site.ts` (set as `--accent` on `<html>`, read by Tailwind and the OG images). *(Refines spec §7, which put it in globals.css — the OG image generator cannot read CSS, so the config file is the only place both can read.)*
- No database, backend, own checkout, analytics or tracking.
- **Never** add reviews, ratings, testimonials, sales/download/customer counts anywhere — including JSON-LD.
- Sample product names start with `[PLACEHOLDER]`; Discord/Tebex links are obvious `REPLACE_ME` placeholders.
- Text inputs use 16px font (`text-base`). All motion respects reduced-motion (`MotionConfig reducedMotion="user"`).
- Commit after each task. Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Shell note: the Bash tool's cwd resets to `D:\AI\Arise`; always `cd /d/AI/fivem-store && …` or use `git -C /d/AI/fivem-store`.

## Review Focus

1. Hand-edited or stale store URLs (`/store?fw=Foo,ESX&cat=Cars&sort=zzz`) → unknown values ignored, page still works. *(Task 3 test)*
2. Search text with extra spaces, capitals or characters like `(` `+` → literal, case-insensitive match, never crashes. *(Task 3 test)*
3. Docs slug that is not a safe file name (`../README`, `Placeholder-Delivery-Job`) → 404, never reads outside `content/docs`. *(Task 4 test)*
4. A free script (price `0`) → shows "Free" and "Get it free", sorts as cheapest. *(Task 1 + Task 3 tests, Task 8 button label)*
5. A script with only one image and no video → no thumbnails or arrows, no video box. *(Task 8 browser check — the Delivery Job sample is exactly this case)*

---

### Task 1: Scaffold, tooling, site config and price formatting

**Files:**
- Create (via create-next-app): `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `.gitignore`, `app/*`
- Create: `vitest.config.mts`, `config/site.ts`, `lib/format.ts`, `tests/format.test.ts`, `.claude/launch.json`
- Delete: boilerplate `public/*.svg`, `app/favicon.ico`

**Interfaces:**
- Produces: `site` object (`name`, `tagline`, `description`, `url`, `accent`, `discordUrl`, `tebexStoreUrl`, `currency`, `locale`), `navLinks`, `footerLinks` from `@/config/site`; `formatPrice(amount: number): string` from `@/lib/format`.

- [ ] **Step 1: Scaffold into a temp folder and move into the repo**

The repo folder already has `.git` and `docs/`, so scaffold next to it and copy over:

```bash
cd /d/AI && npx --yes create-next-app@16.4.0 rocky-scaffold --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --skip-install --yes
rm -rf /d/AI/rocky-scaffold/.git
cp -a /d/AI/rocky-scaffold/. /d/AI/fivem-store/
rm -rf /d/AI/rocky-scaffold
```

- [ ] **Step 2: Install approved packages**

```bash
cd /d/AI/fivem-store && npm install
cd /d/AI/fivem-store && npm install framer-motion@14.1.0 gray-matter@4.0.3 remark@15.0.1 remark-html@16.0.1
cd /d/AI/fivem-store && npm install -D @tailwindcss/typography@0.5.20 vitest@5.0.3
```

Check `package.json`: `typescript` must be a 5.x range. If the template pulled 7.x, run `npm install -D typescript@5.9.3`.

- [ ] **Step 3: Remove boilerplate, add test scripts**

```bash
cd /d/AI/fivem-store && rm -f public/file.svg public/globe.svg public/next.svg public/vercel.svg public/window.svg app/favicon.ico
```

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Keep the template's `dev`, `build`, `start`, `lint` scripts as they are.

- [ ] **Step 4: Create `vitest.config.mts`**

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 5: Create `config/site.ts`**

```ts
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
```

- [ ] **Step 6: Write the failing test `tests/format.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats USD with two decimals", () => {
    expect(formatPrice(19.99)).toBe("$19.99");
    expect(formatPrice(5)).toBe("$5.00");
  });

  it("adds thousands separators", () => {
    expect(formatPrice(1234.5)).toBe("$1,234.50");
  });

  it("shows Free for zero", () => {
    expect(formatPrice(0)).toBe("Free");
  });
});
```

- [ ] **Step 7: Run it and confirm it fails**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: FAIL, cannot resolve `@/lib/format`.

- [ ] **Step 8: Implement `lib/format.ts`**

```ts
import { site } from "@/config/site";

const formatter = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
});

export function formatPrice(amount: number): string {
  return amount === 0 ? "Free" : formatter.format(amount);
}
```

- [ ] **Step 9: Run tests and confirm they pass**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: 3 passed.

- [ ] **Step 10: Add preview config `.claude/launch.json`**

```json
{
  "version": "0.0.1",
  "configurations": [
    {
      "name": "rocky-shop",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 3000
    }
  ]
}
```

(Executor: call `mcp__ccd_directory__change_directory` to `D:\AI\fivem-store` before using `preview_start`, so it reads this file.)

- [ ] **Step 11: Lint and commit**

```bash
cd /d/AI/fivem-store && npm run lint
cd /d/AI/fivem-store && git add -A && git commit -m "chore: scaffold Next.js app, Vitest, site config and price formatting

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Product data, placeholder images and install guides

**Files:**
- Create: `data/products.ts`, `scripts/make-placeholders.mjs`, `public/images/products/*.svg` (generated), `content/docs/<slug>.md` ×6
- Test: `tests/products.test.ts`

**Interfaces:**
- Produces from `@/data/products`: `FRAMEWORKS`, `CATEGORIES`, types `Framework`, `Category`, `ChangelogEntry`, `Product`, `products: Product[]`, `getProductBySlug(slug: string): Product | undefined`, `getFeaturedProducts(): Product[]`.
- Sample slugs (used by later tasks/tests): `placeholder-delivery-job`, `placeholder-advanced-garage`, `placeholder-minimal-hud`, `placeholder-stock-market`, `placeholder-housing-system`, `placeholder-admin-toolkit`.

- [ ] **Step 1: Write the failing test `tests/products.test.ts`**

```ts
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getFeaturedProducts, getProductBySlug, products } from "@/data/products";

// Any field not listed here (e.g. "rating", "reviews", "sales") fails the test.
const ALLOWED_KEYS = new Set([
  "slug", "name", "shortDescription", "description", "price", "category",
  "frameworks", "images", "youtubeId", "features", "dependencies", "version",
  "releasedAt", "changelog", "featured", "escrow", "tebexUrl",
]);

describe("products data", () => {
  it("has at least one product and unique slugs", () => {
    const slugs = products.map((p) => p.slug);
    expect(slugs.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(products.map((p) => [p.slug, p] as const))("%s is valid", (_slug, p) => {
    expect(p.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    expect(existsSync(path.join(process.cwd(), "content", "docs", `${p.slug}.md`))).toBe(true);
    expect(p.images.length).toBeGreaterThan(0);
    for (const img of p.images) {
      expect(img.startsWith("/")).toBe(true);
      expect(existsSync(path.join(process.cwd(), "public", img))).toBe(true);
    }
    expect(new URL(p.tebexUrl).protocol).toBe("https:");
    expect(p.frameworks.length).toBeGreaterThan(0);
    expect(p.price).toBeGreaterThanOrEqual(0);
    expect(p.releasedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const entry of p.changelog) expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const key of Object.keys(p)) expect(ALLOWED_KEYS.has(key), `unexpected field "${key}"`).toBe(true);
  });

  it("finds products by slug", () => {
    expect(getProductBySlug("placeholder-advanced-garage")?.category).toBe("Vehicles");
    expect(getProductBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns only featured products", () => {
    const featured = getFeaturedProducts();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: FAIL, cannot resolve `@/data/products`.

- [ ] **Step 3: Create `data/products.ts`**

```ts
// ─────────────────────────────────────────────────────────────
// ALL STORE PRODUCTS LIVE HERE.
// To add a script: copy one object below, change the values,
// add its images to public/images/products/ and its install
// guide to content/docs/<slug>.md. Run `npm run test` to check.
// ─────────────────────────────────────────────────────────────

export const FRAMEWORKS = ["ESX", "QBCore", "QBox", "Standalone"] as const;
export const CATEGORIES = ["Jobs", "Vehicles", "UI", "Economy", "Housing", "Misc"] as const;

export type Framework = (typeof FRAMEWORKS)[number];
export type Category = (typeof CATEGORIES)[number];

export interface ChangelogEntry {
  version: string;
  date: string; // YYYY-MM-DD
  changes: string[];
}

export interface Product {
  /** Used in the page address and as the docs file name. Lowercase letters, numbers and dashes. */
  slug: string;
  name: string;
  /** One or two sentences for cards and search results. */
  shortDescription: string;
  description: string;
  /** Price in USD. Use 0 for a free script. */
  price: number;
  category: Category;
  frameworks: Framework[];
  /** Paths inside /public. The first image is the cover. */
  images: string[];
  /** The id from a YouTube link (youtube.com/watch?v=THIS_PART). Leave out for no video. */
  youtubeId?: string;
  features: string[];
  dependencies: string[];
  version: string;
  /** YYYY-MM-DD. Used for "Newest" sorting. */
  releasedAt: string;
  changelog: ChangelogEntry[];
  /** Show on the Home page. */
  featured: boolean;
  /** true = protected by Cfx.re escrow (config open), false = open source. */
  escrow: boolean;
  /** Your Tebex package link. "Buy Now" goes here. */
  tebexUrl: string;
}

export const products: Product[] = [
  {
    slug: "placeholder-delivery-job",
    name: "[PLACEHOLDER] Delivery Job",
    shortDescription: "Placeholder job script: pick up parcels and deliver them around the city for cash.",
    description:
      "This is placeholder text. Describe your script here: what it does, why players will enjoy it and what makes it different.\n\nPlayers clock in at the depot, grab a company van and follow delivery routes across the map.",
    price: 14.99,
    category: "Jobs",
    frameworks: ["ESX", "QBCore", "QBox"],
    images: ["/images/products/placeholder-delivery-job-1.svg"],
    features: [
      "Multiple delivery routes",
      "Configurable payouts per drop",
      "Company vehicle spawn and return",
      "Works with ox_target and qb-target",
    ],
    dependencies: ["ox_lib", "oxmysql"],
    version: "1.1.0",
    releasedAt: "2026-06-12",
    changelog: [
      { version: "1.1.0", date: "2026-08-03", changes: ["Added night-shift bonus option", "Fixed vehicle return marker"] },
      { version: "1.0.0", date: "2026-06-12", changes: ["Initial release"] },
    ],
    featured: true,
    escrow: true,
    tebexUrl: "https://YOUR-STORE.tebex.io/package/REPLACE_ME_1",
  },
  {
    slug: "placeholder-advanced-garage",
    name: "[PLACEHOLDER] Advanced Garage",
    shortDescription: "Placeholder vehicle script: public, job and gang garages with an impound system.",
    description:
      "This is placeholder text. Describe your script here.\n\nStore and retrieve vehicles at garages around the map, pay to release impounded cars and transfer vehicles to other players.",
    price: 24.99,
    category: "Vehicles",
    frameworks: ["ESX", "QBCore", "QBox"],
    images: [
      "/images/products/placeholder-advanced-garage-1.svg",
      "/images/products/placeholder-advanced-garage-2.svg",
    ],
    youtubeId: "REPLACE_ME",
    features: [
      "Public, job and gang garages",
      "Impound with configurable fees",
      "Vehicle transfer between players",
      "Clean menu with vehicle stats",
    ],
    dependencies: ["ox_lib", "oxmysql"],
    version: "2.0.0",
    releasedAt: "2026-09-01",
    changelog: [
      { version: "2.0.0", date: "2026-09-20", changes: ["Rewritten menu", "Added QBox support"] },
      { version: "1.0.0", date: "2026-09-01", changes: ["Initial release"] },
    ],
    featured: true,
    escrow: true,
    tebexUrl: "https://YOUR-STORE.tebex.io/package/REPLACE_ME_2",
  },
  {
    slug: "placeholder-minimal-hud",
    name: "[PLACEHOLDER] Minimal HUD",
    shortDescription: "Placeholder UI script: a clean, movable HUD for health, needs, speed and fuel.",
    description:
      "This is placeholder text. Describe your script here.\n\nA lightweight HUD that players can rearrange to suit their screen.",
    price: 9.99,
    category: "UI",
    frameworks: ["Standalone"],
    images: [
      "/images/products/placeholder-minimal-hud-1.svg",
      "/images/products/placeholder-minimal-hud-2.svg",
    ],
    features: [
      "Health, armour, hunger and thirst bars",
      "Speedometer and fuel display",
      "Drag-and-drop layout editor",
      "Saves layout per player",
    ],
    dependencies: [],
    version: "1.0.0",
    releasedAt: "2026-08-15",
    changelog: [{ version: "1.0.0", date: "2026-08-15", changes: ["Initial release"] }],
    featured: true,
    escrow: false,
    tebexUrl: "https://YOUR-STORE.tebex.io/package/REPLACE_ME_3",
  },
  {
    slug: "placeholder-stock-market",
    name: "[PLACEHOLDER] Stock Market",
    shortDescription: "Placeholder economy script: players buy and sell shares in fictional companies.",
    description:
      "This is placeholder text. Describe your script here.\n\nShare prices move over time and admins can trigger market events.",
    price: 29.99,
    category: "Economy",
    frameworks: ["ESX", "QBCore"],
    images: [
      "/images/products/placeholder-stock-market-1.svg",
      "/images/products/placeholder-stock-market-2.svg",
    ],
    features: [
      "Live-updating share prices",
      "Player portfolios saved to the database",
      "Admin tools to trigger market events",
      "Configurable companies and sectors",
    ],
    dependencies: ["oxmysql"],
    version: "1.2.0",
    releasedAt: "2026-05-20",
    changelog: [
      { version: "1.2.0", date: "2026-07-10", changes: ["Added market events"] },
      { version: "1.0.0", date: "2026-05-20", changes: ["Initial release"] },
    ],
    featured: false,
    escrow: true,
    tebexUrl: "https://YOUR-STORE.tebex.io/package/REPLACE_ME_4",
  },
  {
    slug: "placeholder-housing-system",
    name: "[PLACEHOLDER] Housing System",
    shortDescription: "Placeholder housing script: buy, rent and furnish properties with shared keys.",
    description:
      "This is placeholder text. Describe your script here.\n\nPlayers can own or rent homes, place furniture and give keys to friends.",
    price: 39.99,
    category: "Housing",
    frameworks: ["QBCore", "QBox"],
    images: [
      "/images/products/placeholder-housing-system-1.svg",
      "/images/products/placeholder-housing-system-2.svg",
    ],
    features: [
      "Buy, rent and sell properties",
      "Furniture placement mode",
      "Key sharing with other players",
      "Real-estate job integration",
    ],
    dependencies: ["ox_lib", "oxmysql", "ox_target"],
    version: "1.0.0",
    releasedAt: "2026-07-08",
    changelog: [{ version: "1.0.0", date: "2026-07-08", changes: ["Initial release"] }],
    featured: false,
    escrow: true,
    tebexUrl: "https://YOUR-STORE.tebex.io/package/REPLACE_ME_5",
  },
  {
    slug: "placeholder-admin-toolkit",
    name: "[PLACEHOLDER] Admin Toolkit",
    shortDescription: "Placeholder admin script: noclip, spectate, player tools and action logs.",
    description:
      "This is placeholder text. Describe your script here.\n\nEverything staff need to moderate a server, with permission levels and logging.",
    price: 4.99,
    category: "Misc",
    frameworks: ["ESX", "QBCore", "QBox", "Standalone"],
    images: [
      "/images/products/placeholder-admin-toolkit-1.svg",
      "/images/products/placeholder-admin-toolkit-2.svg",
    ],
    features: [
      "Noclip, spectate and teleport",
      "Player and vehicle management",
      "Action logs to Discord webhooks",
      "Permission levels via ACE",
    ],
    dependencies: [],
    version: "1.0.1",
    releasedAt: "2026-04-02",
    changelog: [
      { version: "1.0.1", date: "2026-04-15", changes: ["Fixed spectate camera on some game builds"] },
      { version: "1.0.0", date: "2026-04-02", changes: ["Initial release"] },
    ],
    featured: false,
    escrow: false,
    tebexUrl: "https://YOUR-STORE.tebex.io/package/REPLACE_ME_6",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
```

- [ ] **Step 4: Create `scripts/make-placeholders.mjs` and run it**

```js
// Generates the placeholder product images. Run: node scripts/make-placeholders.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const items = [
  ["placeholder-delivery-job", "Delivery Job", 1],
  ["placeholder-advanced-garage", "Advanced Garage", 2],
  ["placeholder-minimal-hud", "Minimal HUD", 2],
  ["placeholder-stock-market", "Stock Market", 2],
  ["placeholder-housing-system", "Housing System", 2],
  ["placeholder-admin-toolkit", "Admin Toolkit", 2],
];

const dir = "public/images/products";
mkdirSync(dir, { recursive: true });

for (const [slug, label, count] of items) {
  for (let n = 1; n <= count; n++) {
    writeFileSync(`${dir}/${slug}-${n}.svg`, svg(label, n, count));
  }
}

function svg(label, n, count) {
  const cx = n === 1 ? 30 : 70;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <radialGradient id="g" cx="${cx}%" cy="35%" r="75%">
      <stop offset="0" stop-color="#8B5CF6" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#07060b" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1280" height="720" fill="#07060b"/>
  <rect width="1280" height="720" fill="url(#g)"/>
  <text x="640" y="320" text-anchor="middle" font-family="Arial, sans-serif" font-size="36" font-weight="700" fill="#c4b5fd" letter-spacing="10">PLACEHOLDER</text>
  <text x="640" y="400" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="700" fill="#ffffff">${label}</text>
  <text x="640" y="460" text-anchor="middle" font-family="Arial, sans-serif" font-size="26" fill="#a1a1aa">Image ${n} of ${count}: replace with a real screenshot</text>
</svg>
`;
}
```

Run: `cd /d/AI/fivem-store && node scripts/make-placeholders.mjs && ls public/images/products`
Expected: 11 `.svg` files.

- [ ] **Step 5: Create the six install guides**

`content/docs/placeholder-delivery-job.md`:

````md
---
title: "[PLACEHOLDER] Delivery Job — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- A FiveM server running **ESX**, **QBCore** or **QBox**
- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_deliveryjob`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Add this line to `server.cfg`, **after** your framework and dependencies:

```cfg
ensure rocky_deliveryjob
```

## 3. Configure

Open `config.lua` to set the depot location, routes and payout per delivery.

## 4. Restart

Restart your server and check the console for errors.

## Troubleshooting

- **The script does not start:** make sure `ox_lib` and `oxmysql` start before it in `server.cfg`.
- **Still stuck?** Open a ticket on our Discord.
````

`content/docs/placeholder-advanced-garage.md`:

````md
---
title: "[PLACEHOLDER] Advanced Garage — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- A FiveM server running **ESX**, **QBCore** or **QBox**
- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_garage`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Import `install.sql` into your database.
3. Add this line to `server.cfg`, **after** your framework and dependencies:

```cfg
ensure rocky_garage
```

## 3. Configure

Open `config.lua` to add garages, set impound fees and choose which jobs and gangs get private garages.

## 4. Restart

Restart your server and check the console for errors.

## Troubleshooting

- **Vehicles are missing:** make sure the SQL file was imported.
- **Still stuck?** Open a ticket on our Discord.
````

`content/docs/placeholder-minimal-hud.md`:

````md
---
title: "[PLACEHOLDER] Minimal HUD — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- Any FiveM server (works standalone, no framework needed)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_hud`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Add this line to `server.cfg`:

```cfg
ensure rocky_hud
```

3. Stop any other HUD resource so the two don't overlap.

## 3. Configure

Open `config.lua` to pick which bars are shown and their default positions.

## 4. Restart

Restart your server. Players can type `/hud` to move elements around.

## Troubleshooting

- **Two HUDs on screen:** another HUD resource is still running.
- **Still stuck?** Open a ticket on our Discord.
````

`content/docs/placeholder-stock-market.md`:

````md
---
title: "[PLACEHOLDER] Stock Market — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- A FiveM server running **ESX** or **QBCore**
- [oxmysql](https://github.com/overextended/oxmysql)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_stocks`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Import `install.sql` into your database.
3. Add this line to `server.cfg`, **after** your framework and `oxmysql`:

```cfg
ensure rocky_stocks
```

## 3. Configure

Open `config.lua` to add companies, set starting prices and choose how often prices update.

## 4. Restart

Restart your server and check the console for errors.

## Troubleshooting

- **Portfolios don't save:** make sure the SQL file was imported.
- **Still stuck?** Open a ticket on our Discord.
````

`content/docs/placeholder-housing-system.md`:

````md
---
title: "[PLACEHOLDER] Housing System — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- A FiveM server running **QBCore** or **QBox**
- [ox_lib](https://github.com/overextended/ox_lib)
- [oxmysql](https://github.com/overextended/oxmysql)
- [ox_target](https://github.com/overextended/ox_target)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_housing`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Import `install.sql` into your database.
3. Add this line to `server.cfg`, **after** your framework and dependencies:

```cfg
ensure rocky_housing
```

## 3. Configure

Open `config.lua` to add properties, set prices and rent, and connect the real-estate job.

## 4. Restart

Restart your server and check the console for errors.

## Troubleshooting

- **Can't interact with doors:** make sure `ox_target` is running.
- **Still stuck?** Open a ticket on our Discord.
````

`content/docs/placeholder-admin-toolkit.md`:

````md
---
title: "[PLACEHOLDER] Admin Toolkit — Installation"
---

> This is a placeholder guide. Replace it with the real steps for your script.

## Requirements

- Any FiveM server (ESX, QBCore, QBox or standalone)

## 1. Download

1. Log in to the [Cfx.re Portal](https://portal.cfx.re) with the account you used at checkout.
2. Open **Granted Assets** and download `rocky_admin`.

## 2. Install

1. Unzip the folder into your server's `resources` directory.
2. Add this line to `server.cfg`:

```cfg
ensure rocky_admin
add_ace group.admin rocky_admin.use allow
```

## 3. Configure

Open `config.lua` to set permission levels and paste your Discord webhook link for action logs.

## 4. Restart

Restart your server. Admins open the menu with `/admin`.

## Troubleshooting

- **"No permission":** check that your account is in `group.admin`.
- **Still stuck?** Open a ticket on our Discord.
````

- [ ] **Step 6: Run tests and confirm they pass**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: all products tests pass (plus format tests).

- [ ] **Step 7: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: product data, placeholder images and install guides

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Catalog logic (search, filters, sort, URL query)

**Files:**
- Create: `lib/catalog.ts`
- Test: `tests/catalog.test.ts`

**Interfaces:**
- Consumes: `FRAMEWORKS`, `CATEGORIES`, `Product`, `Framework`, `Category`, `ChangelogEntry` from `@/data/products`.
- Produces from `@/lib/catalog`: `SORT_OPTIONS`, `type SortKey = "newest" | "price-asc" | "price-desc"`, `interface CatalogQuery { search: string; frameworks: Framework[]; categories: Category[]; sort: SortKey }`, `DEFAULT_QUERY`, `filterAndSort(products: readonly Product[], query: CatalogQuery): Product[]`, `parseQuery(params: URLSearchParams): CatalogQuery`, `toSearchParams(query: CatalogQuery): URLSearchParams`, `toggleValue<T>(list: readonly T[], value: T): T[]`, `changelogNewestFirst(product: Product): ChangelogEntry[]`.

- [ ] **Step 1: Write the failing test `tests/catalog.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import type { Product } from "@/data/products";
import {
  type CatalogQuery,
  changelogNewestFirst,
  DEFAULT_QUERY,
  filterAndSort,
  parseQuery,
  toggleValue,
  toSearchParams,
} from "@/lib/catalog";

function make(o: Partial<Product> & Pick<Product, "slug">): Product {
  return {
    name: o.slug,
    shortDescription: "",
    description: "",
    price: 10,
    category: "Misc",
    frameworks: ["Standalone"],
    images: ["/x.svg"],
    features: [],
    dependencies: [],
    version: "1.0.0",
    releasedAt: "2026-01-01",
    changelog: [],
    featured: false,
    escrow: true,
    tebexUrl: "https://example.tebex.io/package/1",
    ...o,
  };
}

const garage = make({
  slug: "garage", name: "Advanced Garage", category: "Vehicles",
  frameworks: ["ESX", "QBCore"], price: 25, releasedAt: "2026-09-01",
  features: ["Impound system"],
});
const hud = make({
  slug: "hud", name: "Minimal HUD", category: "UI", frameworks: ["Standalone"],
  price: 10, releasedAt: "2026-08-01", description: "A sleek (C++ style) HUD",
});
const job = make({
  slug: "job", name: "Delivery Job", category: "Jobs",
  frameworks: ["QBox", "QBCore"], price: 0, releasedAt: "2026-07-01",
});
const all = [hud, job, garage];
const q = (o: Partial<CatalogQuery> = {}): CatalogQuery => ({ ...DEFAULT_QUERY, ...o });
const slugs = (ps: Product[]) => ps.map((p) => p.slug);

describe("filterAndSort", () => {
  it("sorts newest first by default", () => {
    expect(slugs(filterAndSort(all, q()))).toEqual(["garage", "hud", "job"]);
  });

  it("sorts by price both ways, free first when ascending", () => {
    expect(slugs(filterAndSort(all, q({ sort: "price-asc" })))).toEqual(["job", "hud", "garage"]);
    expect(slugs(filterAndSort(all, q({ sort: "price-desc" })))).toEqual(["garage", "hud", "job"]);
  });

  it("breaks ties by name", () => {
    const alpha = make({ slug: "alpha", name: "Alpha", price: 10 });
    expect(slugs(filterAndSort([hud, alpha], q({ sort: "price-asc" })))).toEqual(["alpha", "hud"]);
  });

  it("searches names case-insensitively and ignores surrounding spaces", () => {
    expect(slugs(filterAndSort(all, q({ search: "garage" })))).toEqual(["garage"]);
    expect(slugs(filterAndSort(all, q({ search: "  GARAGE  " })))).toEqual(["garage"]);
  });

  it("searches features and descriptions", () => {
    expect(slugs(filterAndSort(all, q({ search: "impound" })))).toEqual(["garage"]);
    expect(slugs(filterAndSort(all, q({ search: "sleek" })))).toEqual(["hud"]);
  });

  it("treats special characters literally", () => {
    expect(slugs(filterAndSort(all, q({ search: "(c++" })))).toEqual(["hud"]);
    expect(slugs(filterAndSort(all, q({ search: "[" })))).toEqual([]);
  });

  it("matches products supporting ANY selected framework", () => {
    expect(slugs(filterAndSort(all, q({ frameworks: ["ESX", "QBox"] })))).toEqual(["garage", "job"]);
  });

  it("filters by one or more categories", () => {
    expect(slugs(filterAndSort(all, q({ categories: ["UI"] })))).toEqual(["hud"]);
    expect(slugs(filterAndSort(all, q({ categories: ["UI", "Jobs"] })))).toEqual(["hud", "job"]);
  });

  it("combines framework, category and search filters", () => {
    expect(slugs(filterAndSort(all, q({ frameworks: ["QBCore"], categories: ["Jobs"] })))).toEqual(["job"]);
    expect(slugs(filterAndSort(all, q({ frameworks: ["QBCore"], search: "delivery" })))).toEqual(["job"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterAndSort(all, q({ search: "zzz" }))).toEqual([]);
  });

  it("does not change the input array", () => {
    const input = [hud, job, garage];
    filterAndSort(input, q({ sort: "price-desc" }));
    expect(slugs(input)).toEqual(["hud", "job", "garage"]);
  });
});

describe("parseQuery", () => {
  it("reads valid values", () => {
    const params = new URLSearchParams("q=hud&fw=ESX,QBox&cat=UI&sort=price-asc");
    expect(parseQuery(params)).toEqual({
      search: "hud", frameworks: ["ESX", "QBox"], categories: ["UI"], sort: "price-asc",
    });
  });

  it("ignores unknown values instead of breaking", () => {
    const params = new URLSearchParams("fw=Foo,ESX&cat=Cars&sort=zzz");
    expect(parseQuery(params)).toEqual({ ...DEFAULT_QUERY, frameworks: ["ESX"] });
  });

  it("removes duplicates", () => {
    expect(parseQuery(new URLSearchParams("fw=ESX,ESX")).frameworks).toEqual(["ESX"]);
  });

  it("returns defaults for an empty query", () => {
    expect(parseQuery(new URLSearchParams())).toEqual(DEFAULT_QUERY);
  });
});

describe("toSearchParams", () => {
  it("leaves defaults out of the URL", () => {
    expect(toSearchParams(DEFAULT_QUERY).toString()).toBe("");
    expect(toSearchParams(q({ search: "   " })).toString()).toBe("");
  });

  it("round-trips through parseQuery", () => {
    const query = q({ search: "garage", frameworks: ["ESX", "QBCore"], categories: ["Vehicles"], sort: "price-desc" });
    expect(parseQuery(toSearchParams(query))).toEqual(query);
  });
});

describe("toggleValue", () => {
  it("adds a missing value and removes a present one", () => {
    expect(toggleValue(["ESX"], "QBox")).toEqual(["ESX", "QBox"]);
    expect(toggleValue(["ESX", "QBox"], "ESX")).toEqual(["QBox"]);
  });
});

describe("changelogNewestFirst", () => {
  it("orders entries by date, newest first, without changing the product", () => {
    const p = make({
      slug: "p",
      changelog: [
        { version: "1.0.0", date: "2026-01-01", changes: ["a"] },
        { version: "1.1.0", date: "2026-03-01", changes: ["b"] },
      ],
    });
    expect(changelogNewestFirst(p).map((e) => e.version)).toEqual(["1.1.0", "1.0.0"]);
    expect(p.changelog[0].version).toBe("1.0.0");
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: FAIL, cannot resolve `@/lib/catalog`.

- [ ] **Step 3: Implement `lib/catalog.ts`**

```ts
import {
  CATEGORIES,
  type Category,
  type ChangelogEntry,
  type Framework,
  FRAMEWORKS,
  type Product,
} from "@/data/products";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export interface CatalogQuery {
  search: string;
  frameworks: Framework[];
  categories: Category[];
  sort: SortKey;
}

export const DEFAULT_QUERY: CatalogQuery = {
  search: "",
  frameworks: [],
  categories: [],
  sort: "newest",
};

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  newest: (a, b) => b.releasedAt.localeCompare(a.releasedAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

function matchesSearch(product: Product, term: string): boolean {
  if (!term) return true;
  const haystack = [product.name, product.shortDescription, product.description, ...product.features]
    .join("\n")
    .toLowerCase();
  return haystack.includes(term);
}

export function filterAndSort(products: readonly Product[], query: CatalogQuery): Product[] {
  const term = query.search.trim().toLowerCase();
  const compare = comparators[query.sort];
  return products
    .filter((p) => matchesSearch(p, term))
    .filter((p) => query.frameworks.length === 0 || p.frameworks.some((f) => query.frameworks.includes(f)))
    .filter((p) => query.categories.length === 0 || query.categories.includes(p.category))
    .sort((a, b) => compare(a, b) || a.name.localeCompare(b.name));
}

// Keeps only allowed values, in their canonical order, without duplicates.
function pickList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
  if (!raw) return [];
  const wanted = new Set(raw.split(","));
  return allowed.filter((value) => wanted.has(value));
}

function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value);
}

export function parseQuery(params: URLSearchParams): CatalogQuery {
  const sort = params.get("sort");
  return {
    search: params.get("q") ?? "",
    frameworks: pickList(params.get("fw"), FRAMEWORKS),
    categories: pickList(params.get("cat"), CATEGORIES),
    sort: isSortKey(sort) ? sort : DEFAULT_QUERY.sort,
  };
}

export function toSearchParams(query: CatalogQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.search.trim()) params.set("q", query.search);
  if (query.frameworks.length) params.set("fw", query.frameworks.join(","));
  if (query.categories.length) params.set("cat", query.categories.join(","));
  if (query.sort !== DEFAULT_QUERY.sort) params.set("sort", query.sort);
  return params;
}

export function toggleValue<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function changelogNewestFirst(product: Product): ChangelogEntry[] {
  return [...product.changelog].sort((a, b) => b.date.localeCompare(a.date));
}
```

- [ ] **Step 4: Run tests and confirm they pass**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: all catalog tests pass.

- [ ] **Step 5: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: catalog search, filters, sort and URL query parsing

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Docs loader (markdown → HTML)

**Files:**
- Create: `lib/docs.ts`
- Test: `tests/docs.test.ts`

**Interfaces:**
- Produces from `@/lib/docs`: `interface Doc { slug: string; title: string; html: string }`, `getDoc(slug: string): Promise<Doc | null>`, `listDocSlugs(): Promise<string[]>` (sorted).

- [ ] **Step 1: Write the failing test `tests/docs.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { getDoc, listDocSlugs } from "@/lib/docs";

describe("getDoc", () => {
  it("loads a guide with its title and rendered HTML", async () => {
    const doc = await getDoc("placeholder-delivery-job");
    expect(doc?.slug).toBe("placeholder-delivery-job");
    expect(doc?.title).toBe("[PLACEHOLDER] Delivery Job — Installation");
    expect(doc?.html).toContain("<h2>Requirements</h2>");
    expect(doc?.html).toContain("<code");
  });

  it("returns null for a guide that does not exist", async () => {
    expect(await getDoc("no-such-script")).toBeNull();
  });

  it("refuses slugs that are not plain file names", async () => {
    expect(await getDoc("../README")).toBeNull();
    expect(await getDoc("..\\README")).toBeNull();
    expect(await getDoc("Placeholder-Delivery-Job")).toBeNull();
    expect(await getDoc("")).toBeNull();
  });
});

describe("listDocSlugs", () => {
  it("lists every guide, sorted", async () => {
    const slugs = await listDocSlugs();
    expect(slugs).toContain("placeholder-delivery-job");
    expect(slugs).toHaveLength(6);
    expect(slugs).toEqual([...slugs].sort());
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: FAIL, cannot resolve `@/lib/docs`.

- [ ] **Step 3: Implement `lib/docs.ts`**

```ts
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface Doc {
  slug: string;
  title: string;
  html: string;
}

export async function getDoc(slug: string): Promise<Doc | null> {
  if (!SLUG_PATTERN.test(slug)) return null;

  let raw: string;
  try {
    raw = await readFile(path.join(DOCS_DIR, `${slug}.md`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  const rendered = await remark().use(html).process(content);
  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    html: String(rendered),
  };
}

export async function listDocSlugs(): Promise<string[]> {
  const files = await readdir(DOCS_DIR);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -3))
    .filter((slug) => SLUG_PATTERN.test(slug))
    .sort();
}
```

- [ ] **Step 4: Run tests and confirm they pass**

Run: `cd /d/AI/fivem-store && npm run test`
Expected: all docs tests pass.

- [ ] **Step 5: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: load install guides from markdown

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Theme and site shell (layout, navbar, footer, 404)

**Files:**
- Modify (replace): `app/globals.css`, `app/layout.tsx`
- Create: `app/icon.svg`, `app/not-found.tsx`, `lib/styles.ts`, `components/icons.tsx`, `components/Container.tsx`, `components/ButtonLink.tsx`, `components/PageHeader.tsx`, `components/SectionHeading.tsx`, `components/MotionProvider.tsx`, `components/Reveal.tsx`, `components/Navbar.tsx`, `components/Footer.tsx`
- Temporarily keep the template's `app/page.tsx` (replaced in Task 6).

**Interfaces:**
- Consumes: `site`, `navLinks`, `footerLinks` from `@/config/site`.
- Produces: `Container({ children, className?, size?: "default" | "narrow" })`, `ButtonLink({ href, children, variant?: "primary" | "ghost", external?: boolean, className? })`, `PageHeader({ eyebrow?, title, description? })`, `SectionHeading({ id, eyebrow, title, description? })`, `Reveal({ children, delay?, className? })`, icons `ArrowRightIcon, CheckIcon, PlayIcon, ChatIcon, BoltIcon, LayersIcon, RefreshIcon, BookIcon, ShieldIcon, MenuIcon, CloseIcon` (all accept `{ className? }`), `inputClass` string from `@/lib/styles`.

- [ ] **Step 1: Replace `app/globals.css`**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* --accent is set on <html> from site.accent in config/site.ts */
:root {
  --background: #07060b;
  --foreground: #e4e4e7;
}

@theme inline {
  --color-accent: var(--accent);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --font-display: var(--font-grotesk);
}

html {
  color-scheme: dark;
  scroll-behavior: smooth;
}

body {
  background: var(--background);
  color: var(--foreground);
}

@utility glass {
  background-color: rgb(255 255 255 / 0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 1rem;
}

@utility glow {
  box-shadow: 0 0 40px -10px var(--accent);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Create `lib/styles.ts`**

```ts
// Shared look for text inputs. text-base = 16px, which stops iPhone Safari zooming in.
export const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white placeholder:text-zinc-500 transition focus:border-accent focus:outline-none";
```

- [ ] **Step 3: Create `components/icons.tsx`**

```tsx
import type { ReactNode } from "react";

interface IconProps {
  className?: string;
}

function Icon({ className = "h-5 w-5", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export const ArrowRightIcon = (p: IconProps) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>;
export const CheckIcon = (p: IconProps) => <Icon {...p}><path d="M5 13l4 4L19 7" /></Icon>;
export const PlayIcon = (p: IconProps) => <Icon {...p}><path d="M8 5v14l11-7z" fill="currentColor" /></Icon>;
export const ChatIcon = (p: IconProps) => <Icon {...p}><path d="M4 5h16v11H9l-5 4z" /></Icon>;
export const BoltIcon = (p: IconProps) => <Icon {...p}><path d="M13 2L4 14h7l-1 8 9-12h-7z" /></Icon>;
export const LayersIcon = (p: IconProps) => <Icon {...p}><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></Icon>;
export const RefreshIcon = (p: IconProps) => <Icon {...p}><path d="M20 11a8 8 0 1 0-2.3 5.7" /><path d="M20 4v7h-7" /></Icon>;
export const BookIcon = (p: IconProps) => <Icon {...p}><path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z" /><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z" /></Icon>;
export const ShieldIcon = (p: IconProps) => <Icon {...p}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></Icon>;
export const MenuIcon = (p: IconProps) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>;
export const CloseIcon = (p: IconProps) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>;
```

- [ ] **Step 4: Create `components/Container.tsx`**

```tsx
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow";
}) {
  const width = size === "narrow" ? "max-w-3xl" : "max-w-6xl";
  return <div className={`mx-auto w-full ${width} px-4 sm:px-6 ${className}`}>{children}</div>;
}
```

- [ ] **Step 5: Create `components/ButtonLink.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const variants = {
  primary: "bg-accent text-white glow hover:brightness-110",
  ghost: "border border-white/10 bg-white/5 text-foreground hover:bg-white/10",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  external?: boolean;
  className?: string;
}) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 6: Create `components/PageHeader.tsx` and `components/SectionHeading.tsx`**

```tsx
// components/PageHeader.tsx
export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="pb-10 pt-14 sm:pt-20">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-lg text-zinc-400">{description}</p>}
    </header>
  );
}
```

```tsx
// components/SectionHeading.tsx
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-3 text-zinc-400">{description}</p>}
    </div>
  );
}
```

- [ ] **Step 7: Create `components/MotionProvider.tsx` and `components/Reveal.tsx`**

```tsx
// components/MotionProvider.tsx
"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// "user" = follow the visitor's reduce-motion setting.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

```tsx
// components/Reveal.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 8: Create `components/Navbar.tsx`**

```tsx
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
```

- [ ] **Step 9: Create `components/Footer.tsx`**

```tsx
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
```

- [ ] **Step 10: Replace `app/layout.tsx`**

```tsx
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { Navbar } from "@/components/Navbar";
import { site } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: FiveM Scripts`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name}: FiveM Scripts`,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#07060b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable}`}
      style={{ "--accent": site.accent } as CSSProperties}
    >
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <MotionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 11: Create `app/icon.svg` and `app/not-found.tsx`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#07060b"/>
  <circle cx="32" cy="32" r="14" fill="#8B5CF6"/>
</svg>
```

```tsx
// app/not-found.tsx
import { ButtonLink } from "@/components/ButtonLink";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-display text-7xl font-bold text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-zinc-400">That page doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/store">Browse scripts</ButtonLink>
        <ButtonLink href="/" variant="ghost">Home</ButtonLink>
      </div>
    </Container>
  );
}
```

- [ ] **Step 12: Verify**

```bash
cd /d/AI/fivem-store && npm run lint && npm run test && npm run build
```

Expected: all pass. Then `preview_start {name: "rocky-shop"}`, open `/` and `/does-not-exist`: navbar, footer and the 404 page show, the console has no errors, and the mobile menu opens and closes at 375px width.

- [ ] **Step 13: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: dark theme, navbar, footer and 404 page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Home page

**Files:**
- Modify (replace): `app/page.tsx`
- Create: `components/Hero.tsx`, `components/FrameworkBadges.tsx`, `components/ProductCard.tsx`, `components/ProductGrid.tsx`, `components/Benefits.tsx`, `components/DiscordCta.tsx`

**Interfaces:**
- Consumes: `getFeaturedProducts`, `Product`, `Framework` (Task 2); `formatPrice` (Task 1); shell components (Task 5).
- Produces: `ProductCard({ product })`, `ProductGrid({ products })`, `FrameworkBadges({ frameworks, size?: "sm" | "md" })`, `DiscordCta()`.

- [ ] **Step 1: Create `components/FrameworkBadges.tsx`**

```tsx
import type { Framework } from "@/data/products";

export function FrameworkBadges({
  frameworks,
  size = "md",
}: {
  frameworks: readonly Framework[];
  size?: "sm" | "md";
}) {
  const sizing = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <ul aria-label="Supported frameworks" className="flex flex-wrap gap-1.5">
      {frameworks.map((framework) => (
        <li key={framework} className={`rounded-md border border-accent/40 bg-accent/15 font-medium text-zinc-100 ${sizing}`}>
          {framework}
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Create `components/ProductCard.tsx` and `components/ProductGrid.tsx`**

```tsx
// components/ProductCard.tsx
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
```

```tsx
// components/ProductGrid.tsx
import type { Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Create `components/Hero.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import { site } from "@/config/site";
import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";
import { ArrowRightIcon, ChatIcon } from "./icons";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <motion.div
          className="absolute -top-32 left-[15%] h-96 w-96 rounded-full bg-accent/30 blur-3xl"
          animate={{ x: [0, 60, -20, 0], y: [0, 40, 10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          animate={{ x: [0, -50, 30, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Container className="flex flex-col items-center py-24 text-center sm:py-32">
        <motion.p {...fadeUp(0)} className="glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-zinc-300">
          ESX · QBCore · QBox · Standalone
        </motion.p>
        <motion.h1
          {...fadeUp(0.1)}
          className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-6xl"
        >
          Level up your FiveM server with{" "}
          <span className="bg-linear-to-r from-accent to-white bg-clip-text text-transparent">{site.name}</span>
        </motion.h1>
        <motion.p {...fadeUp(0.2)} className="mt-6 max-w-xl text-lg text-zinc-400">
          {site.tagline}
        </motion.p>
        <motion.div {...fadeUp(0.3)} className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/store">
            Browse scripts <ArrowRightIcon className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={site.discordUrl} external variant="ghost">
            <ChatIcon className="h-4 w-4" /> Join Discord
          </ButtonLink>
        </motion.div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/Benefits.tsx`**

```tsx
import { Container } from "./Container";
import { BoltIcon, BookIcon, ChatIcon, LayersIcon, RefreshIcon, ShieldIcon } from "./icons";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

// Promises about the product only. No reviews, numbers or customer counts.
const benefits = [
  { icon: BoltIcon, title: "Optimized code", text: "Written to stay light on server resources, with clean, readable config files." },
  { icon: LayersIcon, title: "Multi-framework", text: "Scripts list exactly which frameworks they support: ESX, QBCore, QBox or standalone." },
  { icon: RefreshIcon, title: "Updates included", text: "Bug fixes and improvements arrive in your Cfx.re Portal. Every change is in the changelog." },
  { icon: ChatIcon, title: "Discord support", text: "Stuck? Open a ticket on our Discord and we'll help you get it running." },
  { icon: BookIcon, title: "Clear docs", text: "Every script has a step-by-step installation guide on this site." },
  { icon: ShieldIcon, title: "Secure checkout", text: "Payments are handled by Tebex, FiveM's official store partner. We never see your card details." },
];

export function Benefits() {
  return (
    <section aria-labelledby="benefits-heading" className="py-16">
      <Container>
        <SectionHeading id="benefits-heading" eyebrow="Why Rocky Shop" title="Why buy from us" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <li key={title}>
              <Reveal delay={i * 0.05} className="glass h-full p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <Icon />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

- [ ] **Step 5: Create `components/DiscordCta.tsx`**

```tsx
import { site } from "@/config/site";
import { ButtonLink } from "./ButtonLink";
import { Container } from "./Container";
import { ChatIcon } from "./icons";
import { Reveal } from "./Reveal";

export function DiscordCta() {
  return (
    <section aria-labelledby="discord-heading" className="py-16">
      <Container>
        <Reveal className="glass relative overflow-hidden p-8 text-center sm:p-14">
          <div aria-hidden="true" className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl" />
          <h2 id="discord-heading" className="relative font-display text-3xl font-bold text-white sm:text-4xl">
            Join the {site.name} Discord
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-zinc-400">
            Get support, see update announcements and be first to hear about new scripts.
          </p>
          <div className="relative mt-8 flex justify-center">
            <ButtonLink href={site.discordUrl} external>
              <ChatIcon className="h-4 w-4" /> Join Discord
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 6: Replace `app/page.tsx`**

```tsx
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
```

- [ ] **Step 7: Verify**

```bash
cd /d/AI/fivem-store && npm run lint && npm run test && npm run build
```

Expected: all pass. In the preview, open `/`: the hero blobs drift, 3 featured cards fade in on scroll and lift on hover, the 6 benefit cards and the Discord section show, the console has no errors, and nothing scrolls sideways at 375px.

- [ ] **Step 8: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: home page with animated hero, featured scripts, benefits and Discord section

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Store page (search, filters, sort)

**Files:**
- Create: `app/store/page.tsx`, `components/StoreView.tsx`, `components/ChipGroup.tsx`

**Interfaces:**
- Consumes: `products`, `FRAMEWORKS`, `CATEGORIES`, `Product` (Task 2); `filterAndSort`, `parseQuery`, `toSearchParams`, `toggleValue`, `SORT_OPTIONS`, `DEFAULT_QUERY`, `CatalogQuery`, `SortKey` (Task 3); `ProductGrid` (Task 6); `inputClass` (Task 5).

- [ ] **Step 1: Create `components/ChipGroup.tsx`**

```tsx
"use client";

export function ChipGroup<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly T[];
  selected: readonly T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(option)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                on
                  ? "border-accent bg-accent/20 text-white"
                  : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 2: Create `components/StoreView.tsx`**

```tsx
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CATEGORIES, FRAMEWORKS, type Product } from "@/data/products";
import {
  type CatalogQuery,
  DEFAULT_QUERY,
  filterAndSort,
  parseQuery,
  SORT_OPTIONS,
  type SortKey,
  toggleValue,
  toSearchParams,
} from "@/lib/catalog";
import { inputClass } from "@/lib/styles";
import { ChipGroup } from "./ChipGroup";
import { ProductGrid } from "./ProductGrid";

export function StoreView({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(() => parseQuery(new URLSearchParams(searchParams.toString())), [searchParams]);
  // Search text is kept locally so fast typing never drops characters.
  const [search, setSearch] = useState(query.search);
  const current = useMemo<CatalogQuery>(() => ({ ...query, search }), [query, search]);
  const results = useMemo(() => filterAndSort(products, current), [products, current]);
  const hasFilters = search.trim() !== "" || current.frameworks.length > 0 || current.categories.length > 0;

  function commit(next: CatalogQuery) {
    const qs = toSearchParams(next).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearFilters() {
    setSearch("");
    commit({ ...DEFAULT_QUERY, sort: current.sort });
  }

  return (
    <div className="space-y-8">
      <div className="glass space-y-5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Search scripts</span>
            <input
              type="search"
              value={search}
              placeholder="Search scripts…"
              onChange={(e) => {
                setSearch(e.target.value);
                commit({ ...current, search: e.target.value });
              }}
              className={inputClass}
            />
          </label>
          <label className="sm:w-60">
            <span className="sr-only">Sort by</span>
            <select
              value={current.sort}
              onChange={(e) => commit({ ...current, sort: e.target.value as SortKey })}
              className={inputClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="bg-zinc-900">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ChipGroup
          label="Framework"
          options={FRAMEWORKS}
          selected={current.frameworks}
          onToggle={(f) => commit({ ...current, frameworks: toggleValue(current.frameworks, f) })}
        />
        <ChipGroup
          label="Category"
          options={CATEGORIES}
          selected={current.categories}
          onToggle={(c) => commit({ ...current, categories: toggleValue(current.categories, c) })}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "script" : "scripts"}
        </p>
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="text-zinc-300 underline-offset-4 hover:text-white hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : (
        <div className="glass p-12 text-center">
          <p className="font-display text-xl font-semibold text-white">No scripts match</p>
          <p className="mt-2 text-zinc-400">Try a different search or clear your filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/store/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { PageHeader } from "@/components/PageHeader";
import { ProductGrid } from "@/components/ProductGrid";
import { StoreView } from "@/components/StoreView";
import { products } from "@/data/products";
import { DEFAULT_QUERY, filterAndSort } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse every FiveM script we sell. Filter by framework (ESX, QBCore, QBox, Standalone) and category.",
  alternates: { canonical: "/store" },
};

export default function StorePage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Store"
        title="All scripts"
        description="Search, filter by framework or category, and sort by price or release date."
      />
      {/* The fallback is the full list, so search engines and no-JS visitors still see every script. */}
      <Suspense fallback={<ProductGrid products={filterAndSort(products, DEFAULT_QUERY)} />}>
        <StoreView products={products} />
      </Suspense>
    </Container>
  );
}
```

- [ ] **Step 4: Verify**

```bash
cd /d/AI/fivem-store && npm run lint && npm run test && npm run build
```

Expected: all pass. In the preview, on `/store`:
- Typing "garage" leaves 1 card and the URL gets `?q=garage`.
- Clicking ESX then Jobs leaves only Delivery Job.
- "Price: low to high" puts the $4.99 Admin Toolkit first.
- Searching "zzz" shows the empty state, and "Clear filters" brings back all 6.
- Opening `/store?fw=Foo&sort=zzz` directly shows all 6 with no error.
- The console is clean.

- [ ] **Step 5: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: store page with search, framework and category filters, and sorting

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Script detail page

**Files:**
- Create: `app/scripts/[slug]/page.tsx`, `components/Gallery.tsx`, `components/YouTubeEmbed.tsx`

**Interfaces:**
- Consumes: `products`, `getProductBySlug` (Task 2); `changelogNewestFirst` (Task 3); `formatPrice` (Task 1); `FrameworkBadges` (Task 6); `ButtonLink`, `Container`, icons (Task 5); `site`.

- [ ] **Step 1: Create `components/Gallery.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `components/YouTubeEmbed.tsx`**

```tsx
"use client";

import { useState } from "react";
import { PlayIcon } from "./icons";

// Shows a play button first; YouTube only loads after a click (faster page, no tracking until then).
export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="glass relative aspect-video overflow-hidden">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-3 bg-accent/5"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white glow transition group-hover:scale-110">
            <PlayIcon className="h-7 w-7" />
          </span>
          <span className="text-sm font-medium text-zinc-200">Watch preview</span>
          <span className="text-xs text-zinc-500">Loads YouTube when clicked</span>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/scripts/[slug]/page.tsx`**

```tsx
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
```

- [ ] **Step 4: Verify**

```bash
cd /d/AI/fivem-store && npm run lint && npm run test && npm run build
```

Expected: all pass, and the build output lists 6 `/scripts/[slug]` pages. In the preview:
- `/scripts/placeholder-advanced-garage`: the thumbnails, arrows and arrow keys switch images. "Watch preview" turns into an iframe after a click. The "Buy Now" `href` equals `https://YOUR-STORE.tebex.io/package/REPLACE_ME_2` and has `target="_blank"`. The changelog shows v2.0.0 first.
- `/scripts/placeholder-delivery-job` (one image, no video): no thumbnails, no arrows, no video box. *(Review Focus 5)*
- `/scripts/nope`: shows the 404 page.
- The console is clean, and the layout stacks properly at 375px.

- [ ] **Step 5: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: script detail page with gallery, video preview, changelog and Buy Now

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Docs pages

**Files:**
- Create: `app/docs/page.tsx`, `app/docs/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getDoc`, `listDocSlugs` (Task 4); `getProductBySlug` (Task 2); `Container`, `PageHeader`, `ButtonLink`, `ArrowRightIcon` (Task 5).

- [ ] **Step 1: Create `app/docs/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { ArrowRightIcon, BookIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { getProductBySlug } from "@/data/products";
import { listDocSlugs } from "@/lib/docs";

export const metadata: Metadata = {
  title: "Docs",
  description: "Step-by-step installation guides for every script.",
  alternates: { canonical: "/docs" },
};

export default async function DocsIndexPage() {
  const slugs = await listDocSlugs();
  return (
    <Container>
      <PageHeader eyebrow="Docs" title="Installation guides" description="Pick a script to see how to install and configure it." />
      <ul className="grid gap-4 sm:grid-cols-2">
        {slugs.map((slug) => {
          const product = getProductBySlug(slug);
          return (
            <li key={slug}>
              <Link
                href={`/docs/${slug}`}
                className="glass group flex items-center gap-4 p-5 transition hover:border-accent/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  <BookIcon />
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-white">{product?.name ?? slug}</span>
                  {product && <span className="block text-sm text-zinc-500">{product.category}</span>}
                </span>
                <ArrowRightIcon className="h-4 w-4 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
```

- [ ] **Step 2: Create `app/docs/[slug]/page.tsx`**

```tsx
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
```

- [ ] **Step 3: Verify**

```bash
cd /d/AI/fivem-store && npm run lint && npm run test && npm run build
```

Expected: all pass, and the build lists 6 `/docs/[slug]` pages. In the preview:
- `/docs` lists 6 guides.
- `/docs/placeholder-advanced-garage` shows styled headings, lists and a dark code block, and "Back to" goes to the script page.
- `/docs/nope` shows the 404 page.
- The console is clean.

- [ ] **Step 4: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: docs index and markdown install guide pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: FAQ, Contact, Terms and Refund Policy

**Files:**
- Create: `data/faq.ts`, `components/Accordion.tsx`, `components/ContactForm.tsx`, `components/LegalNotice.tsx`, `app/faq/page.tsx`, `app/contact/page.tsx`, `app/terms/page.tsx`, `app/refund-policy/page.tsx`

**Interfaces:**
- Consumes: `site`; `inputClass`; shell components and icons (Task 5).
- Produces: `FaqItem { question: string; answer: string }`, `faqs: FaqItem[]` from `@/data/faq`; `Accordion({ items })`; `ContactForm()`; `LegalNotice()`.

- [ ] **Step 1: Create `data/faq.ts`**

```ts
// Edit these answers to match your own policies.
export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What does \"escrow\" mean?",
    answer:
      "Escrow scripts are protected by Cfx.re's asset escrow system. The core code is encrypted, but config files and anything you'd normally customise stay open. Your purchase is linked to the Cfx.re account you use at checkout, and the script appears in your Cfx.re Portal under Granted Assets.",
  },
  {
    question: "Do I get updates?",
    answer:
      "Yes. When we release an update, the new version appears in your Cfx.re Portal for you to download. Each script's page has a changelog listing what changed.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Scripts are digital goods delivered instantly, so please read our Refund Policy before buying. If something isn't working, contact us on Discord first. We'd much rather fix it for you.",
  },
  {
    question: "How do I get support?",
    answer:
      "Join our Discord and open a support ticket. Include your framework, the script version and any errors from your server console so we can help faster.",
  },
  {
    question: "Which frameworks are supported?",
    answer:
      "Each script lists its supported frameworks (ESX, QBCore, QBox or Standalone) on its page and in the store filters. Please only buy a script if your framework is listed.",
  },
  {
    question: "How do I install a script?",
    answer:
      "Every script has a step-by-step guide on our Docs page. In short: download it from your Cfx.re Portal, put it in your resources folder, add it to server.cfg and restart your server.",
  },
  {
    question: "Which payment methods can I use?",
    answer:
      "Checkout is handled by Tebex, which offers common options such as cards and PayPal depending on your region. We never see or store your payment details.",
  },
];
```

- [ ] **Step 2: Create `components/Accordion.tsx`**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import type { FaqItem } from "@/data/faq";

export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-button-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.question} className={`glass transition ${isOpen ? "border-accent/40" : ""}`}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-medium text-white"
              >
                <span>{item.question}</span>
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  className="text-2xl leading-none text-accent"
                >
                  +
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-zinc-400">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create `components/ContactForm.tsx`**

```tsx
"use client";

import { type FormEvent, useState } from "react";
import { inputClass } from "@/lib/styles";
import { CheckIcon } from "./icons";

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-300">{label}</span>
      <input name={name} type={type} required autoComplete={autoComplete} className={inputClass} />
    </label>
  );
}

export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.currentTarget.reset();
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="glass flex flex-col items-center p-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold text-white">Thanks, message submitted!</h2>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Heads up: this form isn&apos;t connected yet, so nothing was actually sent. Please reach us on Discord for now.
        </p>
        <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm text-zinc-300 underline-offset-4 hover:text-white hover:underline">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass space-y-5 p-6">
      <p className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
        This form isn&apos;t connected yet. Messages are not sent anywhere. Please use Discord for support.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
      </div>
      <Field label="Subject" name="subject" />
      <label className="block">
        <span className="mb-1.5 block text-sm text-zinc-300">Message</span>
        <textarea name="message" required minLength={10} rows={6} className={inputClass} />
      </label>
      <button type="submit" className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white glow hover:brightness-110 sm:w-auto">
        Send message
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create `components/LegalNotice.tsx`**

```tsx
export function LegalNotice() {
  return (
    <p role="note" className="mb-8 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
      <strong>Placeholder text.</strong> Replace this page with your own legal text before going live. This is not legal advice.
    </p>
  );
}
```

- [ ] **Step 5: Create `app/faq/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { Container } from "@/components/Container";
import { DiscordCta } from "@/components/DiscordCta";
import { PageHeader } from "@/components/PageHeader";
import { faqs } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about escrow, updates, refunds, support and installing our FiveM scripts.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <Container size="narrow">
        <PageHeader eyebrow="FAQ" title="Frequently asked questions" description="Can't find your answer? Ask us on Discord." />
        <Accordion items={faqs} />
      </Container>
      <DiscordCta />
    </>
  );
}
```

- [ ] **Step 6: Create `app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { ChatIcon } from "@/components/icons";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact & Support",
  description: `Get help with ${site.name} scripts on Discord or send us a message.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Container>
      <PageHeader eyebrow="Support" title="Contact & support" description="The fastest way to get help is our Discord." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="glass h-fit space-y-4 p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <ChatIcon className="h-6 w-6" />
          </span>
          <h2 className="font-display text-xl font-semibold text-white">Discord support</h2>
          <p className="text-sm text-zinc-400">
            Join the server and open a ticket. Include your framework, script version and any console errors.
          </p>
          <ButtonLink href={site.discordUrl} external className="w-full">
            <ChatIcon className="h-4 w-4" /> Join Discord
          </ButtonLink>
        </div>
        <ContactForm />
      </div>
    </Container>
  );
}
```

- [ ] **Step 7: Create `app/terms/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalNotice } from "@/components/LegalNotice";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for ${site.name}.`,
  alternates: { canonical: "/terms" },
};

const sections = [
  ["1. About these terms", "[PLACEHOLDER] Explain who you are and that buying from this store means agreeing to these terms."],
  ["2. Licence", "[PLACEHOLDER] Describe what buyers may do with a script (for example: use it on servers they own or manage) and what they may not do (for example: resell, share or re-upload it)."],
  ["3. Delivery", "[PLACEHOLDER] Explain that purchases are processed by Tebex and delivered to the buyer's Cfx.re account."],
  ["4. Updates and support", "[PLACEHOLDER] Describe how updates are delivered and how long support is offered."],
  ["5. Chargebacks", "[PLACEHOLDER] Explain what happens to access if a payment is disputed or charged back."],
  ["6. Liability", "[PLACEHOLDER] Limit your liability for server issues, data loss or conflicts with other resources."],
  ["7. Changes", "[PLACEHOLDER] Explain that these terms may change and how buyers will be told."],
  ["8. Contact", "[PLACEHOLDER] Tell buyers how to contact you about these terms (for example: your Discord)."],
] as const;

export default function TermsPage() {
  return (
    <Container size="narrow">
      <PageHeader eyebrow="Legal" title="Terms of Service" />
      <LegalNotice />
      <div className="space-y-8">
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-zinc-400">{text}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **Step 8: Create `app/refund-policy/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { LegalNotice } from "@/components/LegalNotice";
import { PageHeader } from "@/components/PageHeader";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund policy for ${site.name}.`,
  alternates: { canonical: "/refund-policy" },
};

const sections = [
  ["1. Digital products", "[PLACEHOLDER] Explain that scripts are digital goods delivered instantly to the buyer's Cfx.re account."],
  ["2. When refunds are possible", "[PLACEHOLDER] List the cases where you will give a refund (for example: the script cannot be made to work on a supported framework after support has tried to help)."],
  ["3. When refunds are not possible", "[PLACEHOLDER] List the cases where you won't (for example: change of mind, buying a script for an unsupported framework)."],
  ["4. How to ask for a refund", "[PLACEHOLDER] Explain the steps (for example: open a Discord ticket with your Tebex transaction ID)."],
  ["5. Processing", "[PLACEHOLDER] Explain how refunds are paid back through Tebex and roughly how long it takes."],
] as const;

export default function RefundPolicyPage() {
  return (
    <Container size="narrow">
      <PageHeader eyebrow="Legal" title="Refund Policy" />
      <LegalNotice />
      <div className="space-y-8">
        {sections.map(([title, text]) => (
          <section key={title}>
            <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-zinc-400">{text}</p>
          </section>
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **Step 9: Verify**

```bash
cd /d/AI/fivem-store && npm run lint && npm run test && npm run build
```

Expected: all pass. In the preview:
- `/faq`: the first answer is open, clicking another opens it with an animation, and `aria-expanded` flips.
- `/contact`: submitting empty is blocked by the browser. Submitting with a bad email is blocked. A valid submit shows the success box with the "not connected" note.
- `/terms` and `/refund-policy` show the amber placeholder banner.
- The console is clean at both desktop and 375px.

- [ ] **Step 10: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: FAQ accordion, contact page with form, terms and refund policy

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: SEO (sitemap, robots, share images)

**Files:**
- Create: `lib/og.tsx`, `app/opengraph-image.tsx`, `app/scripts/[slug]/opengraph-image.tsx`, `app/sitemap.ts`, `app/robots.ts`

**Interfaces:**
- Consumes: `site`; `products`, `getProductBySlug` (Task 2) — `products` only in `sitemap.ts`; `changelogNewestFirst` (Task 3); `listDocSlugs` (Task 4); `formatPrice` (Task 1).
- Produces: `OgCard({ title, subtitle })`, `ogSize` from `@/lib/og`.

- [ ] **Step 1: Create `lib/og.tsx`**

```tsx
import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

// Rendered to a PNG by next/og. Only inline styles and flex layout are supported here.
export function OgCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: "#07060b",
        backgroundImage: `radial-gradient(circle at 20% 15%, ${site.accent}80, transparent 55%)`,
        color: "white",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, fontWeight: 700 }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: site.accent }} />
        {site.name}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 30, color: "#a1a1aa" }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: site.accent }}>FiveM scripts · ESX · QBCore · QBox · Standalone</div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { OgCard, ogSize } from "@/lib/og";

export const alt = `${site.name}: FiveM scripts`;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<OgCard title={site.name} subtitle={site.tagline} />, size);
}
```

- [ ] **Step 3: Create `app/scripts/[slug]/opengraph-image.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `app/sitemap.ts` and `app/robots.ts`**

```ts
// app/sitemap.ts
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
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Verify**

```bash
cd /d/AI/fivem-store && npm run lint && npm run test && npm run build
```

Expected: all pass. In the preview:
- `/sitemap.xml` lists 7 static pages + 6 scripts + 6 docs.
- `/robots.txt` points to the sitemap.
- `/opengraph-image` and `/scripts/placeholder-advanced-garage/opengraph-image` render purple share cards (take a screenshot).
- The page source of a script page contains `og:image`, `og:title`, a `<title>` like "[PLACEHOLDER] Advanced Garage | Rocky Shop", and the `application/ld+json` script with no `review` or `aggregateRating`.

- [ ] **Step 6: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "feat: sitemap, robots.txt and generated share images

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Owner guide and final verification

**Files:**
- Modify (replace): `README.md`

- [ ] **Step 1: Replace `README.md`**

````md
# Rocky Shop

Website for the Rocky Shop FiveM script store. Built with Next.js, Tailwind CSS and Framer Motion. No database: every script lives in one file.

## Run it on your computer (Windows)

1. Install [Node.js](https://nodejs.org) (the LTS version).
2. Open a terminal in this folder and run:

```bash
npm install
npm run dev
```

3. Open http://localhost:3000

Other commands: `npm run test` (checks your product data), `npm run build` (makes the production version), `npm run lint`.

## Add a new script

1. Open `data/products.ts`.
2. Copy one whole `{ ... },` block and paste it at the end of the list.
3. Change the values:
   - `slug`: short name for the web address, lowercase with dashes, e.g. `police-job`.
   - `name`, `shortDescription`, `description`, `price` (USD, `0` = free).
   - `category`: one of `Jobs`, `Vehicles`, `UI`, `Economy`, `Housing`, `Misc`.
   - `frameworks`: any of `ESX`, `QBCore`, `QBox`, `Standalone`.
   - `tebexUrl`: your Tebex package link. "Buy Now" goes here.
   - `youtubeId`: the part after `v=` in a YouTube link. Delete the line for no video.
   - `featured: true` shows it on the Home page.
4. Put screenshots in `public/images/products/` and list them in `images` like `"/images/products/police-job-1.png"`. The first one is the cover.
5. Create `content/docs/<slug>.md` with the install guide (copy an existing one as a starting point).
6. Run `npm run test`. It tells you if an image or guide is missing or a value is wrong.

## Change colors, name and links

Open `config/site.ts`:

- `accent`: the neon color (e.g. `"#22D3EE"` for cyan). It updates buttons, glows, badges and share images.
- `name`, `tagline`, `description`: store text.
- `discordUrl`, `tebexStoreUrl`: your real links.
- `url`: your real website address after deploying.

FAQ answers are in `data/faq.ts`. Terms and refund text are in `app/terms/page.tsx` and `app/refund-policy/page.tsx`.

## Deploy for free on Vercel

1. Put this folder on GitHub (create a new repository and push it).
2. Go to https://vercel.com, sign in with GitHub, click **Add New → Project** and pick the repository.
3. Leave all settings as they are and click **Deploy**.
4. When it's done, copy your address (e.g. `https://rocky-shop.vercel.app`) into `url` in `config/site.ts`, then commit and push. Vercel redeploys automatically on every push.
````

- [ ] **Step 2: Full verification (superpowers:verification-before-completion)**

```bash
cd /d/AI/fivem-store && npm run test
cd /d/AI/fivem-store && npm run lint
cd /d/AI/fivem-store && npm run build
```

Expected: all pass. Paste the real output in the report.

Then, with the dev server (`preview_start rocky-shop`):
1. Visit every route: `/`, `/store`, all 6 `/scripts/…`, `/docs`, all 6 `/docs/…`, `/faq`, `/contact`, `/terms`, `/refund-policy`, `/nope`. Check `read_console_messages` with `onlyErrors: true` on each, and `preview_logs` for server errors.
2. Resize to the mobile preset (375×812) and check `/`, `/store`, one script page and `/contact`: no sideways scroll (`document.documentElement.scrollWidth <= window.innerWidth`), and the mobile menu works.
3. Search the source for fake social proof: `cd /d/AI/fivem-store && grep -rniwE "reviews?|ratings?|aggregateRating|testimonials?|customers|downloads|sold|stars?" app components data lib`. Matches inside code comments are fine (e.g. "no review or rating fields"). Any match in visible text or data must be removed. ("preview" does not match because of `-w`.)
4. Reset the viewport to the desktop preset. Take screenshots of Home, Store and one script page as proof.

- [ ] **Step 3: Commit**

```bash
cd /d/AI/fivem-store && git add -A && git commit -m "docs: owner guide for adding scripts, changing colors and deploying

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
