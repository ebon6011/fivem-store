# Rocky Shop — FiveM Script Store Website: Design Spec

Date: 2026-10-10
Status: Approved in brainstorming, awaiting written-spec review

## 1. Goal

A modern, fast, SEO-friendly marketing and catalog website for **Rocky Shop**, a FiveM script store. Visitors browse scripts, read details and install guides, and buy through Tebex. The owner adds new scripts by editing one data file.

### Success criteria

- `npm install` then `npm run dev` works on Windows (Node 24 / npm 11 verified on the owner's machine).
- `npm run test`, `npm run lint`, `npm run build` all pass.
- All 7 page types render with no browser console errors, at desktop and 375px mobile width.
- Adding a script = add one object in `data/products.ts` + one `.md` file + images. No other code changes.
- Free deploy on Vercel with zero configuration.

### Hard constraints

- Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.
- No database, no backend, no own checkout. "Buy Now" links to the product's `tebexUrl`.
- 6 sample products, every name clearly labeled `[PLACEHOLDER]`, placeholder prices and images.
- **No invented reviews, ratings, testimonials, sales numbers, customer counts or download counts** — anywhere, including structured data.
- Separate project at `D:\AI\fivem-store` with its own git repo (not inside the Ashborn repo).

## 2. Decisions

| Topic | Decision |
|---|---|
| Rendering | Fully static (SSG). Script and doc pages via `generateStaticParams`. Store filtering client-side. |
| Store name | Rocky Shop |
| Accent color | Purple `#8B5CF6`, set once as a CSS variable |
| Currency | USD |
| Discord / Tebex links | Obvious placeholders in `config/site.ts` and per product |
| Docs source | One markdown file per script: `content/docs/<slug>.md` |
| Images | Local generated SVG placeholders in `public/images/products/` |
| Contact form | Client-side validation, shows success message, sends nothing |

### Approved packages

- Runtime: `next`, `react`, `react-dom`, `framer-motion`, `gray-matter`, `remark`, `remark-html`
- Styling: `tailwindcss` (+ its PostCSS integration as required by the installed Tailwind version), `@tailwindcss/typography`
- Dev: `typescript`, `@types/*`, `eslint` + Next config, `vitest`

Any additional package requires asking the owner first.

## 3. Folder layout

```
fivem-store/
  app/
    layout.tsx              navbar, footer, fonts, default metadata
    page.tsx                Home
    store/page.tsx          Store (server wrapper) + client StoreView
    scripts/[slug]/page.tsx Script detail
    scripts/[slug]/opengraph-image.tsx  per-script OG image
    docs/page.tsx           Docs index
    docs/[slug]/page.tsx    One install guide
    faq/page.tsx
    contact/page.tsx
    terms/page.tsx
    refund-policy/page.tsx
    not-found.tsx
    sitemap.ts
    robots.ts
    opengraph-image.tsx     site-wide OG image
    globals.css             --accent variable, .glass utility
  components/               small focused UI pieces (see §5)
  config/site.ts            name, tagline, url, discordUrl, tebexStoreUrl, currency
  data/products.ts          product list + types
  content/docs/<slug>.md    install guides
  lib/catalog.ts            search / filter / sort (pure functions)
  lib/docs.ts               markdown loading + rendering
  lib/format.ts             price formatting
  public/images/products/   placeholder SVGs
  tests/                    vitest specs
```

## 4. Data model (`data/products.ts`)

```ts
export const FRAMEWORKS = ["ESX", "QBCore", "QBox", "Standalone"] as const;
export const CATEGORIES = ["Jobs", "Vehicles", "UI", "Economy", "Housing", "Misc"] as const;
export type Framework = (typeof FRAMEWORKS)[number];
export type Category = (typeof CATEGORIES)[number];

export interface ChangelogEntry { version: string; date: string; changes: string[] }

export interface Product {
  slug: string;              // URL segment and docs file name
  name: string;
  shortDescription: string;  // cards + meta description
  description: string;       // detail page
  price: number;             // USD
  category: Category;
  frameworks: Framework[];
  images: string[];          // first = cover
  youtubeId?: string;        // optional; absent/empty = no video section
  features: string[];
  dependencies: string[];
  version: string;
  releasedAt: string;        // ISO date, drives "Newest"
  changelog: ChangelogEntry[];
  featured: boolean;         // shown on Home
  escrow: boolean;           // "Escrow" vs "Open source" badge
  tebexUrl: string;
}

export const products: Product[] = [ /* 6 placeholder products */ ];
```

Six sample products, one per category (Jobs, Vehicles, UI, Economy, Housing, Misc), varied frameworks, prices and dates, 3 featured. All names start with `[PLACEHOLDER]`. `tebexUrl` values are `https://YOUR-STORE.tebex.io/package/REPLACE_ME_<n>`.

Helper exports: `getProductBySlug(slug)`, `getFeaturedProducts()`.

## 5. Pages and components

### Shared
- `Navbar`: sticky glass bar, logo text, links (Store, Docs, FAQ, Contact), Discord button, animated mobile menu.
- `Footer`: links incl. Terms and Refund Policy, copyright with store name.
- `not-found.tsx`: styled 404 with link back to Store.
- `Reveal`: wrapper for fade-up-on-scroll. All motion respects `prefers-reduced-motion` (Framer `useReducedMotion` / `MotionConfig reducedMotion="user"`).

### Home
- `Hero`: animated background (drifting blurred purple blobs + faint grid, CSS/Framer only), headline, tagline, "Browse Scripts" and "Join Discord" buttons.
- Featured scripts grid of `ProductCard`s.
- "Why buy from us": 4–6 benefit cards (optimized code, multi-framework, free updates, Discord support, clear docs, escrow-protected). Phrased as product promises, no numbers or quotes.
- Discord CTA section.

### Store
- Server page renders `StoreView` (client component) inside `Suspense`.
- Search input (matches name, shortDescription, description, features; case-insensitive).
- Framework chips (multi-select, product matches if it supports ANY selected framework).
- Category chips (multi-select, product matches if its category is ANY selected).
- Sort select: Newest (default), Price low→high, Price high→low.
- State synced to URL query (`q`, `fw`, `cat`, `sort`) via `router.replace` (no scroll jump).
- Result count, empty state with "Clear filters".
- `ProductCard`: glass card, cover image, name, short description, framework badges, price, hover lift/glow.

### Script detail (`/scripts/[slug]`)
- `generateStaticParams` from products; unknown slug → `notFound()`.
- `Gallery`: main image + thumbnails, click and keyboard (arrow keys) navigation.
- `YouTubeEmbed`: shows thumbnail + play button; on click loads `youtube-nocookie.com` iframe. Hidden when no `youtubeId`.
- Price, version, `FrameworkBadges`, escrow badge, **Buy Now** (`<a href={tebexUrl} target="_blank" rel="noopener noreferrer">`).
- Features list, dependencies list, changelog (newest first), link to `/docs/[slug]`.
- JSON-LD `Product` with name, description, image, `offers` (price, `priceCurrency: "USD"`, url). No `review` / `aggregateRating`.

### Docs
- `/docs`: list of all products with a guide.
- `/docs/[slug]`: markdown (frontmatter `title`) rendered to HTML with `remark` + `remark-html`, styled with Tailwind `prose prose-invert`. "Back to script" link. Missing doc → `notFound()`.

### FAQ
- `Accordion` (animated height, `aria-expanded`, button triggers). Questions: escrow, updates, refunds, support, framework compatibility, installation help, payment methods (via Tebex).

### Contact
- Discord invite card.
- `ContactForm` (client): name, email, subject, message, `required` + email type validation; inputs at 16px font to avoid iOS zoom. On submit: `preventDefault`, show success message, reset form. A visible note says the form is not connected yet.

### Terms / Refund Policy
- Placeholder legal text clearly marked, with a "Replace this text before going live" banner.

## 6. SEO

- Root metadata: `metadataBase` from `site.url`, title template `%s | Rocky Shop`, description, Open Graph + Twitter card defaults.
- Per-page `metadata` / `generateMetadata` (script pages use product name + shortDescription).
- OG images via `next/og` `ImageResponse`: site-wide and per-script (dark background, purple glow, store name, script name, price).
- `sitemap.ts`: static pages + every `/scripts/[slug]` + every `/docs/[slug]`.
- `robots.ts`: allow all, link to sitemap.
- `site.url` placeholder `https://rocky-shop.vercel.app` until the owner deploys.

## 7. Styling

- `--accent: #8B5CF6` (plus derived `--accent-soft` glow) in `app/globals.css`, exposed to Tailwind as `accent` color. Changing that one line recolors the site.
- Background near-black (`#07060b`), text zinc tones.
- `.glass`: `bg-white/5`, `backdrop-blur`, `border-white/10`, rounded.
- Fonts via `next/font/google` (Inter for body, Space Grotesk for headings), self-hosted at build.
- Mobile-first responsive; grids collapse to 1 column under 640px; no horizontal scroll at 375px.

## 8. Error handling

- Unknown script or doc slug → 404 page.
- Missing image → products test fails before deploy (each image path must exist in `public/`).
- Invalid product data (bad category/framework) → TypeScript build error.
- Empty store results → friendly empty state.
- No YouTube id → video section omitted.

## 9. Testing (Vitest, test-first)

- `tests/catalog.test.ts`: search matching (name, features, case-insensitive), framework filter (any-match), category filter, combined filters, each sort order, empty result.
- `tests/products.test.ts`: unique slugs, every product has `content/docs/<slug>.md`, ≥1 image and every image file exists, valid `tebexUrl` (https URL), no review/rating/sales fields present. (No test forces `[PLACEHOLDER]` names, so real products don't break the suite.)
- `tests/docs.test.ts`: loads a known doc and returns title + HTML; unknown slug returns `null`.
- `tests/format.test.ts`: USD price formatting.

## 10. Verification before completion

1. `npm run test`, `npm run lint`, `npm run build` — all pass, outputs shown.
2. Dev server started via preview tool; check every page: no console errors, store filters + URL sync, gallery, YouTube click-to-load, accordion, form success message, Buy Now href, mobile 375px layout, 404 page.
3. Commit after each finished task.

## 11. Owner handoff (in final message and `README.md`)

Plain-language guides for: adding a new script, changing colors and store name/links, deploying free on Vercel.

## 12. Out of scope

Real checkout, accounts, backend for the contact form, reviews, analytics/tracking, CMS, i18n.
