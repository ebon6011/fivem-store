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
