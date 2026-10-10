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
