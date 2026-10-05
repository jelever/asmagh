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
npm start          # http://localhost:8765/ar/  (live reload)
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
| `src/assets/docs/` | Product specification sheets (PDF, English), linked from each product page |
| `scripts/check.mjs` | Post-build checks, also run in CI |
| `scripts/compress-pdfs.py` | Lossless PDF compression with a pixel-by-pixel proof (see below) |

To add a product, add an entry to `src/_data/products.js` with both `en` and
`ar` blocks and a photo in `src/assets/img/photos/` (credit it in
`credits.json`). The product page, menus, footer, contact form and sitemap
pick it up automatically.

## Specification sheets

The sheets in `src/assets/docs/` are losslessly compressed copies of the
originals in `railway/assets/asmagh/Specification sheet papers` (58 MB down
to 31 MB). To add or update a sheet, put the new original there and run:

```bash
pip install pymupdf pillow
python scripts/compress-pdfs.py "../../assets/asmagh/Specification sheet papers" src/assets/docs
```

The script only keeps a copy whose every page renders pixel-identical to the
original, with identical text. Then set the file name in the product's `spec`
field in `src/_data/products.js`; the page shows the link and the file size.

## Before launch

These are placeholders and must be replaced with real details:

1. **Contact details** in `src/_data/site.js`: phone, WhatsApp and email
   are real (contact@asmagh.com, +249 90 444 3343). Still to confirm: the
   address (currently "Khartoum, Sudan"), the working hours and social
   profiles. Then set `contact.placeholder` to `false`, which removes the
   "being finalised" note on the contact page.
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

The site is served from the custom domain **https://asmagh.com**, at the
root, so it builds with `PATH_PREFIX=/` and `SITE_URL=https://asmagh.com`
(the defaults). `src/static/CNAME` holds the domain, and Settings -> Pages
has it set with **Enforce HTTPS** on.

If the domain is ever removed, GitHub serves the site at
`https://jelever.github.io/asmagh/` instead. Then build with
`PATH_PREFIX=/asmagh/` and `SITE_URL=https://jelever.github.io/asmagh`
(set them as environment variables on the build and check steps of the
workflow), or every stylesheet, image and link will 404.

## Licences

- Photographs: see `/credits/` on the site (`src/_data/credits.json`).
- Typeface: Alexandria, SIL Open Font License 1.1 (`src/assets/fonts/OFL.txt`).
- Map boundary: Natural Earth, public domain.
