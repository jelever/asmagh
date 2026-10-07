// Site-wide settings. Nothing here is secret: a Formspree form ID is public by
// design (it appears in the page's form action).
//
// PLACEHOLDERS: every value marked TODO must be replaced with the company's
// real details before the site is announced. See README.md -> "Before launch".

export default {
  // Public URL of the site, without a trailing slash. Change when a custom
  // domain changes (and keep PATH_PREFIX in step, see eleventy.config.js).
  url: process.env.SITE_URL || "https://asmagh.com",

  langs: ["ar", "en"],
  defaultLang: "ar",

  brand: {
    teal: "#0B3D3C",
    paper: "#FBF7F0",
  },

  // Formspree form ID (the part after https://formspree.io/f/).
  // Endpoint https://formspree.io/f/xaeqqjab. In the form's Formspree settings,
  // reCAPTCHA must stay OFF: the site submits with fetch (AJAX), which
  // Formspree's reCAPTCHA rejects. Spam is handled by the _gotcha honeypot.
  formspreeId: "xaeqqjab",

  contact: {
    placeholder: true, // TODO: set to false once the real details are in.
    phone: "+249 90 444 3343",
    phoneHref: "+249904443343", // digits only, with country code
    whatsapp: "249904443343", // digits only, for https://wa.me/ (same number as phone)
    whatsappDisplay: "+249 90 444 3343",
    email: "contact@asmagh.com",
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
