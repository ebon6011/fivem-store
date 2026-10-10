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
