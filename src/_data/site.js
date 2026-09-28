// Site-wide settings. Nothing here is secret: a Formspree form ID is public by
// design (it appears in the page's form action).
//
// PLACEHOLDERS: every value marked TODO must be replaced with the company's
// real details before the site is announced. See README.md -> "Before launch".

export default {
  // Public URL of the site, without a trailing slash. Change when a custom
  // domain is attached (and build with PATH_PREFIX=/).
  url: process.env.SITE_URL || "https://jelever.github.io/asmagh",

  langs: ["ar", "en"],
  defaultLang: "ar",

  brand: {
    teal: "#0B3D3C",
    paper: "#FBF7F0",
  },

  // Formspree form ID (the part after https://formspree.io/f/).
  // TODO: create the form in the company's Formspree account and paste its ID.
  formspreeId: "YOUR_FORM_ID",

  contact: {
    placeholder: true, // TODO: set to false once the real details are in.
    phone: "+249 000 000 000", // TODO
    phoneHref: "+249000000000", // TODO: digits only, with country code
    whatsapp: "249000000000", // TODO: digits only, for https://wa.me/
    email: "info@example.com", // TODO
    address: {
      en: "Khartoum, Sudan", // TODO
      ar: "الخرطوم، السودان", // TODO
    },
    hours: {
      en: "Sunday to Thursday, 8:00–17:00 Sudan time",
      ar: "من الأحد إلى الخميس، 8 صباحًا – 5 مساءً بتوقيت السودان",
    },
  },

  // TODO: add real profiles, e.g. { name: "LinkedIn", url: "https://..." }.
  social: [],

  // Home page metrics. These describe the catalogue on this site, so they are
  // true as written. Replace with company figures (tonnes a year, countries
  // served, years in business) when the company provides them.
  metrics: [
    { value: 2, suffix: "", icon: "gum-on-branch", key: "species" },
    { value: 5, suffix: "", icon: "grading", key: "grades" },
    { value: 3, suffix: "", icon: "powder", key: "forms" },
    { value: 17, suffix: "", icon: "sack", key: "products" },
  ],
};
