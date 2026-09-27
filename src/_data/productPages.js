// One entry per (language, product): drives the paginated product detail page.
import products from "./products.js";

export default ["ar", "en"].flatMap((lang) =>
  products.map((product) => ({ lang, product }))
);
