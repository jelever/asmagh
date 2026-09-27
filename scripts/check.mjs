// Post-build checks over _site. Run after `npm run build`; CI runs it too.
//   - every internal link and asset resolves to a built file
//   - every page has lang, dir, title, description, hreflang and one <h1>
//   - no prices or currency amounts anywhere (products are listed without prices)
//   - no text left over from the content reference site
// Exits non-zero on any failure.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const OUT = "_site";
const PREFIX = (process.env.PATH_PREFIX || "/asmagh/").replace(/\/?$/, "/");

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
})(OUT);

const problems = [];
const fail = (file, msg) => problems.push(`${relative(OUT, file)}: ${msg}`);

function resolves(url) {
  let path = url.split("#")[0].split("?")[0];
  if (!path.startsWith(PREFIX)) return false;
  path = decodeURI(path.slice(PREFIX.length));
  const target = join(OUT, path);
  if (path === "" || path.endsWith("/")) return existsSync(join(target, "index.html"));
  return existsSync(target);
}

const MONEY = [
  /(?:US\$|\$|€|£)\s?\d/,
  /\d[\d,.]*\s?(?:USD|SDG|EUR|GBP|US dollars?)\b/i,
  /\b(?:USD|SDG|EUR|GBP)\s?\d/,
  /\d[\d,.]*\s?(?:جنيه|دولار)/,
  /per\s+(?:kg|ton|tonne|MT)\b.{0,20}\d/i,
];
const LEFTOVERS = [/arabicgum/i, /\bAbnaa\b/i, /\bASEAE\b/, /Elobied/i, /سيد العبيد/, /\[object Object\]/];

const html = files.filter((f) => f.endsWith(".html"));
for (const file of html) {
  const src = readFileSync(file, "utf8");
  const isRedirect = relative(OUT, file) === "index.html";

  for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(?:https?:|mailto:|tel:|#|data:)/.test(url)) continue;
    if (url.startsWith("/")) {
      if (!resolves(url)) fail(file, `broken link ${url}`);
    } else if (!isRedirect) {
      fail(file, `relative URL ${url} (use a root-relative path)`);
    }
  }

  if (!/<html lang="(ar|en)" dir="(rtl|ltr)"/.test(src)) fail(file, "missing lang/dir on <html>");
  if (!/<title>[^<]{5,}<\/title>/.test(src)) fail(file, "missing <title>");
  if (!/<meta name="description" content="[^"]{10,}">/.test(src)) fail(file, "missing meta description");
  if (!isRedirect && !file.endsWith("404.html")) {
    if ((src.match(/hreflang="(ar|en)" href=/g) || []).length < 2) fail(file, "missing hreflang pair");
    const h1 = (src.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) fail(file, `${h1} <h1> elements`);
  }

  const text = src.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  for (const re of MONEY) if (re.test(text)) fail(file, `looks like a price: ${text.match(re)[0]}`);
  for (const re of LEFTOVERS) if (re.test(src)) fail(file, `leftover text matching ${re}`);
}

// CSS url() references resolve relative to the stylesheet.
for (const file of files.filter((f) => f.endsWith(".css"))) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/url\("?([^")]+)"?\)/g)) {
    if (/^(?:data:|https?:)/.test(m[1])) continue;
    if (!existsSync(join(file, "..", m[1]))) fail(file, `broken url(${m[1]})`);
  }
}

if (problems.length) {
  console.error(`check: ${problems.length} problem(s)\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`check: ${html.length} pages OK (links, meta, hreflang, h1, no prices, no leftovers)`);
