// Eleventy build for the Asmagh bilingual static site.
//
// Every page template in src/pages is paginated over the two languages, so one
// template produces both /en/... and /ar/.... All copy lives in src/_data.
//
// PATH_PREFIX: GitHub Pages serves a project site from /asmagh/. When a custom
// domain is attached, build with PATH_PREFIX=/ (see README.md).

import { readFileSync } from "node:fs";
import { HtmlBasePlugin } from "@11ty/eleventy";

// The full Asmagh icon sprite (97 icons, ~37 KB). Each page gets only the
// symbols it references, injected at <!--ICON-SPRITE--> in the base layout.
const SPRITE = new Map(
  [...readFileSync("src/_icons/asmagh-icons-sprite.svg", "utf8").matchAll(
    /<symbol id="asmagh-([a-z0-9-]+)"[\s\S]*?<\/symbol>/g
  )].map((m) => [m[1], m[0]])
);

export default function (eleventyConfig) {
  // Rewrites root-relative URLs (href, src, srcset...) to include pathPrefix.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // /en/about/ -> /ar/about/ (and back). Used by the language switch and hreflang.
  eleventyConfig.addFilter("swapLang", (url, lang) => {
    const other = lang === "ar" ? "en" : "ar";
    return String(url).replace(/^\/(en|ar)\//, `/${other}/`);
  });
  eleventyConfig.addFilter("setLang", (url, target) =>
    String(url).replace(/^\/(en|ar)\//, `/${target}/`)
  );

  // Absolute URL for canonical, hreflang, og:image and the sitemap.
  eleventyConfig.addFilter("absUrl", (path, siteUrl) =>
    siteUrl.replace(/\/$/, "") + path
  );

  // Brand line icon. Unknown names fail the build rather than render blank.
  eleventyConfig.addShortcode("icon", (name, cls = "") => {
    if (!SPRITE.has(name)) throw new Error(`Unknown icon "${name}" (not in src/_icons/asmagh-icons-sprite.svg)`);
    return `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#asmagh-${name}"></use></svg>`;
  });

  // Inline only the symbols this page uses.
  eleventyConfig.addTransform("icon-sprite", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html") || !content.includes("<!--ICON-SPRITE-->")) return content;
    const used = [...new Set([...content.matchAll(/href="#asmagh-([a-z0-9-]+)"/g)].map((m) => m[1]))];
    const symbols = used.map((n) => SPRITE.get(n) || "").join("");
    return content.replace(
      "<!--ICON-SPRITE-->",
      `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols}</svg>`
    );
  });

  eleventyConfig.addFilter("find", (arr, key, value) =>
    (arr || []).find((item) => item[key] === value)
  );
  eleventyConfig.addFilter("where", (arr, key, value) =>
    (arr || []).filter((item) => item[key] === value)
  );

  // Four other products for the "Other products" strip: the other gum plus the
  // next crops in catalogue order, wrapping around.
  eleventyConfig.addFilter("related", (products, slug, n = 4) => {
    const others = products.filter((p) => p.slug !== slug);
    const self = products.find((p) => p.slug === slug);
    const gums = others.filter((p) => p.group === "gum");
    const crops = products.filter((p) => p.group === "crop");
    const start = self && self.group === "crop" ? crops.indexOf(self) + 1 : 0;
    const rotated = crops.slice(start).concat(crops.slice(0, start)).filter((p) => p.slug !== slug);
    return gums.concat(rotated).slice(0, n);
  });

  // Western digits in both languages, as on most Arabic trade sites.
  eleventyConfig.addFilter("year", () => String(new Date().getFullYear()));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    pathPrefix: process.env.PATH_PREFIX || "/asmagh/",
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
