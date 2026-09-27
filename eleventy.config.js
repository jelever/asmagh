// Eleventy build for the Asmagh bilingual static site.
//
// Every page template in src/pages is paginated over the two languages, so one
// template produces both /en/... and /ar/.... All copy lives in src/_data.
//
// PATH_PREFIX: GitHub Pages serves a project site from /asmagh/. When a custom
// domain is attached, build with PATH_PREFIX=/ (see README.md).

import { HtmlBasePlugin } from "@11ty/eleventy";

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

  // Brand line icon from the inline sprite (partials/sprite.svg).
  eleventyConfig.addShortcode(
    "icon",
    (name, cls = "") =>
      `<svg class="icon ${cls}" aria-hidden="true" focusable="false"><use href="#asmagh-${name}"></use></svg>`
  );

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
