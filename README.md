# Asmagh Sudanese Exports — website

Bilingual (Arabic / English) static website for **Asmagh — أصماغ للصادرات السودانية**,
a Sudanese exporter of gum arabic (Hashab and Talha) and agricultural crops.
Built with [Eleventy](https://www.11ty.dev/) and published on GitHub Pages.

- Arabic: `/ar/` (RTL, the default) · English: `/en/`
- `/` sends visitors to their browser language, falling back to Arabic.
- Products are listed **without prices**; buyers request a quote.

## Run it locally

Requires Node 20 or later.

```bash
npm install
npm start          # http://localhost:8765/asmagh/ar/  (live reload)
npm run build      # writes _site/
npm run check      # link, meta, hreflang, h1, no-prices checks over _site/
```

## Where things are

| Path | What |
|---|---|
| `src/_data/i18n.js` | All interface and page copy, English and Arabic side by side |
| `src/_data/products.js` | Product catalogue: names, grades, forms, uses, packing (no prices) |
| `src/_data/site.js` | Site URL, contact details, Formspree ID, home-page metrics |
| `src/_data/credits.json` | Source, author and licence of every photo |
| `src/pages/` | Page templates; each is built once per language |
| `src/_includes/` | Layout, header, footer, page hero, contact banner |
| `src/_icons/asmagh-icons-sprite.svg` | All 97 brand icons; each page inlines only the ones it uses |
| `src/assets/css/main.css` | The whole stylesheet (logical properties, so RTL mirrors itself) |
| `src/assets/js/main.js` | Carousel, sticky header, menu, animations, slider, form |
| `src/assets/brand/` | Logos, decorations, masks and map from the Asmagh identity kit |
| `src/assets/img/photos/` | Photographs (Wikimedia Commons, free licences) |
| `scripts/check.mjs` | Post-build checks, also run in CI |

To add a product, add an entry to `src/_data/products.js` with both `en` and
`ar` blocks and a photo in `src/assets/img/photos/` (credit it in
`credits.json`). The product page, menus, footer, contact form and sitemap
pick it up automatically.

## Before launch

These are placeholders and must be replaced with real details:

1. **Contact details** in `src/_data/site.js`: phone, WhatsApp, email,
   address, social profiles. Then set `contact.placeholder` to `false`.
2. **Formspree form ID**: create a form at formspree.io with the company
   email, and put its ID in `formspreeId`. Until then the form tells visitors
   to email or call instead of pretending to send.
3. **Home-page metrics** (`site.metrics`): currently facts about the
   catalogue (2 gum types, 5 grades, 3 forms, 17 products). Replace with
   company figures when available.
4. **Photos**: stock photos from Wikimedia Commons. Replace with the
   company's own photos when available, and update `credits.json`.

## Publishing

The workflow in `.github/workflows/pages.yml` builds, checks and deploys on
every push to `main`. One-time setup: **Settings → Pages → Source: GitHub
Actions**.

The site is served from `https://jelever.github.io/asmagh/`, so it builds
with `PATH_PREFIX=/asmagh/` (the default). For a custom domain:

1. Add `src/static/CNAME` containing the domain.
2. In the workflow, set `PATH_PREFIX: /` and `SITE_URL: https://<domain>` as
   environment variables for the build and check steps.
3. Point DNS at GitHub Pages and enable **Enforce HTTPS**.

## Licences

- Photographs: see `/credits/` on the site (`src/_data/credits.json`).
- Typeface: Alexandria, SIL Open Font License 1.1 (`src/assets/fonts/OFL.txt`).
- Map boundary: Natural Earth, public domain.
