# CLAUDE.md — Asmagh Sudanese Exports (asmagh)

Loaded automatically for sessions in this folder, on top of the portfolio
rules in `../../CLAUDE.md`.

---

## What this is

The company website of Asmagh (أصماغ للصادرات السودانية), a Sudanese exporter
specialising in gum arabic (Hashab and Talha) with a wider catalogue of
Sudanese crops. It is a brochure and lead site for international buyers: the
goal is quote and sample requests. It is a static site, with no server and no
database.

- **Languages:** Arabic (RTL, default) at `/ar/`, English at `/en/`. `/` redirects by browser language.
- **Stack:** Eleventy 3, Nunjucks templates, one CSS file and one JS file, no frameworks.
- **Hosting:** GitHub Pages, deployed by GitHub Actions. There is no Railway project.
- **URL:** https://asmagh.com (custom domain on GitHub Pages, served at the root, so `pathPrefix` is `/`).
  The old https://jelever.github.io/asmagh/ redirects to it.
- **GitHub:** `jelever/asmagh`. It is **public**, because free-plan Pages needs a
  public repository. This is a deliberate exception to the portfolio's
  private-repo rule, chosen by the user.
- **Design:** modelled on `../../references/export-co/olamagri`.
- **Content:** inspired by `../../references/export-co/arabicgum.sd`. That is
  another company's site: never copy its history, stats or names.
- **Identity:** `../../assets/asmagh/`. The site keeps its own copies under
  `src/assets/`, because nothing may be read from `assets/` at runtime.

---

## Status — 2026-09-28

**Done and verified**

- Built all 50 pages: 25 in each language (home, about, products, 17 product
  pages, quality, export, contact, credits), plus 404, the root redirect,
  sitemap and robots.
- Ran `npm run check`, which passes.
- Checked in headless Chrome (puppeteer) at 1440px and 390px, in both
  languages:
  - no horizontal overflow and no console errors;
  - RTL mirroring is correct;
  - mobile menu, desktop dropdown, carousel, form prefill (`?product=&type=`)
    and the form's "not connected" message all work.

**Open work, in priority order**

1. Confirm the address and working hours, then set `contact.placeholder` to
   `false` in `src/_data/site.js`. Phone, WhatsApp and email are real since
   2026-10-05. The contact form is connected to Formspree (`xaeqqjab`)
   since 2026-10-07; keep its reCAPTCHA off.
2. Replace the catalogue metrics with real company figures.
3. Replace the Commons stock photos with company photos. Keep `credits.json` in step.

**Launch baseline:** tracked in `../../SITES.md`.

---

## Commands

```bash
npm start        # dev server on port 8765 (8080 is used by other sessions)
npm run build
npm run check    # run before saying anything is finished; CI runs it too
```

---

## Conventions that will bite

- **No prices, ever.** The user asked for products without prices.
  `scripts/check.mjs` fails the build on currency amounts.
- **Keep the languages in step.** Every key in `i18n.js` must exist in both
  `en` and `ar`, and every product needs both blocks.
  - A duplicate key silently overwrites the earlier one. `home` once did,
    and the breadcrumb showed `[object Object]`.
- **Links are root-relative** (`/en/...`, `/assets/...`), and
  `HtmlBasePlugin` adds the path prefix.
  - Never hard-code a path prefix or the domain in templates. Use `site.url` and root-relative links.
  - CSS `url()` paths are relative to the stylesheet.
- **Use logical CSS properties** (`inset-inline-*`, `border-start-end-radius`,
  `margin-inline-*`). Only arrow icons need explicit `[dir=rtl]` flips.
- **Icons:** `{% icon "name" %}`, with names from `src/_icons/asmagh-icons-sprite.svg`
  (the updated web-assets kit, 97 icons).
  - The build inlines only the symbols a page uses, at `<!--ICON-SPRITE-->` in the base layout.
  - An unknown name fails the build.
  - `npm run check` fails if a used icon's symbol is missing from the page.
- **Spec sheets:** never replace them with a lossy compressor.
  - Use `scripts/compress-pdfs.py`, which proves each page is pixel-identical before keeping a copy.
  - The originals in `assets/` are the client's files. Never write to them.
- **Headings use `{ a, b }` pairs** for the two-tone style. The `tt()` macro
  renders `b` in the accent colour. `a` may be empty.
- **Screenshots:** the Chrome extension's tab is hidden, so scroll animations
  and lazy images do not paint. Use puppeteer-core with reduced motion
  instead.

---

## Site-specific decisions

- **Eleventy rather than hand-written HTML.** Two languages × 25 pages would
  otherwise duplicate the header, footer and product data.
- **Photos come from Wikimedia Commons.** Unsplash and Pexels APIs were
  blocked from this machine.
  - CC BY and CC BY-SA photos need visible credit, so the `/credits/` page is
    required. Do not remove it while those photos are used.
- **The form uses Formspree via fetch**, so success and error messages
  appear in the page's language. It includes a honeypot field (`_gotcha`).
- **Home metrics describe the catalogue** (2, 5, 3, 17) rather than
  invented company figures.

---

## Where things are explained

| | |
|---|---|
| `README.md` | setup, file map, before-launch placeholders, publishing, custom domain |
