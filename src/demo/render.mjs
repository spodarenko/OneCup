// Renders one language version of the home page. Content: src/content/<lang>.json, site data: src/config/site.json.
import { icons } from "./icons.mjs";

const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const icon = (name, cls = "oc-icon") =>
  `<svg class="${cls}" viewBox="0 0 256 256" aria-hidden="true"><path d="${icons[name]}"/></svg>`;
const img = (name, alt, w, h, extra = "") =>
  `<img src="{{base}}assets/img/${name}.webp" alt="${attr(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"${extra}>`;

const eyebrow = (text, cls = "") => `<p class="oc-eyebrow ${cls}">${text}</p>`;

function header(c, all) {
  const others = all
    .map(
      (l) =>
        `<li><a href="{{base}}${l.path}" hreflang="${l.lang}" lang="${l.lang}"${l.lang === c.lang ? ' aria-current="true"' : ""}>${l.name}</a></li>`,
    )
    .join("");
  return `<header class="oc-header">
  <a class="oc-header__logo" href="{{base}}${c.path}" aria-label="OneCup">
    <img src="{{base}}assets/img/logo.svg" alt="OneCup" width="138" height="33">
  </a>
  <nav class="oc-header__nav" aria-label="${attr(c.nav.menu)}">
    <a class="oc-link" href="#models">${c.nav.buy}</a>
    <a class="oc-link" href="#models">${c.nav.host}</a>
    <a class="oc-link" href="#materials">${c.nav.materials}</a>
    <a class="oc-link" href="#contact">${c.nav.contact}</a>
  </nav>
  <div class="oc-header__actions">
    <div class="oc-header__ctas">
      <a class="oc-btn oc-btn--sm oc-btn--green" href="{{whatsapp}}" target="_blank" rel="noopener">${c.nav.whatsapp}</a>
      <a class="oc-btn oc-btn--sm oc-btn--outline" href="#contact">${c.nav.request}</a>
    </div>
    <details class="oc-lang">
      <summary aria-label="${attr(c.nav.language)}">${c.name}${icon("caret-down")}</summary>
      <ul>${others}</ul>
    </details>
  </div>
</header>`;
}

function hero(c) {
  return `<section class="oc-hero" id="top">
  <div class="oc-hero__pin">
    <h1 class="oc-hero__title" data-split>${c.hero.title}</h1>
    <div class="oc-hero__media">
      <video class="oc-hero__video" muted playsinline preload="auto" poster="{{base}}assets/img/orbit-poster.webp" aria-label="${attr(c.hero.videoLabel)}" width="1280" height="720">
        <source src="{{base}}assets/video/orbit.webm" type="video/webm">
        <source src="{{base}}assets/video/orbit.mp4" type="video/mp4">
      </video>
    </div>
    <div class="oc-hero__body" data-reveal>
      <p class="oc-hero__subtitle">${c.hero.subtitle}</p>
      <div class="oc-hero__ctas">
        <a class="oc-btn oc-btn--accent" href="#models">${c.hero.ctaBuy}</a>
        <a class="oc-btn oc-btn--outline" href="#models">${c.hero.ctaHost}</a>
      </div>
    </div>
  </div>
</section>`;
}

function about(c) {
  const a = c.about;
  const pill = (n, alt) =>
    `<img class="oc-about__pill" src="{{base}}assets/img/${n}.webp" alt="${attr(alt)}" width="72" height="46" loading="lazy">`;
  const [before, after] = a.text.split(a.inlineAfter);
  return `<section class="oc-about oc-light" aria-labelledby="about-title">
  <div class="oc-about__inner">
    ${eyebrow(a.eyebrow)}
    <p class="oc-about__quote" id="about-title" data-fill><span class="oc-about__mark">“</span> <strong>${a.brand}</strong> ${before}${a.inlineAfter} ${pill("about-machine", a.imgMachine)}${after} ${pill("about-station", a.imgStation)} <span aria-hidden="true">”</span></p>
  </div>
</section>`;
}

function metrics(c) {
  const items = c.metrics
    .map(
      (m) => `<div class="oc-metric" data-reveal>
      <p class="oc-metric__value"><span data-count="${m.value}">${m.value}</span><span class="oc-metric__unit">${m.unit}</span></p>
      <h3 class="oc-metric__title">${m.title}</h3>
      <p class="oc-metric__text">${m.text}</p>
    </div>`,
    )
    .join("");
  return `<section class="oc-metrics oc-light" aria-label="${attr(c.metrics.map((m) => m.title).join(", "))}">
  <div class="oc-metrics__grid">${items}</div>
</section>`;
}

function materials(c) {
  const m = c.materials;
  const rows = m.items
    .map(
      (it, i) => `<li class="oc-mat__row${i === 0 ? " is-active" : ""}" data-index="${i}">
      <button class="oc-mat__name" type="button" aria-expanded="${i === 0}" aria-controls="mat-${i}">${it.name}</button>
      <div class="oc-mat__text" id="mat-${i}">
        <h3 class="oc-mat__lead">${it.lead}</h3>
        <p class="oc-mat__desc">${it.text}</p>
      </div>
    </li>`,
    )
    .join("");
  const imgs = m.items
    .map((it, i) => img(it.img, it.alt, 640, 811, i === 0 ? ' class="is-active"' : ""))
    .join("");
  return `<section class="oc-mat oc-dark" id="materials" aria-labelledby="mat-title">
  ${eyebrow(m.eyebrow, "oc-eyebrow--muted")}
  <h2 class="oc-visually-hidden" id="mat-title">${m.title}</h2>
  <div class="oc-mat__body">
    <ul class="oc-mat__list">${rows}</ul>
    <div class="oc-mat__media" aria-hidden="true">${imgs}</div>
  </div>
</section>`;
}

function steps(c) {
  const s = c.steps;
  const items = s.items
    .map(
      (it) => `<li class="oc-step" data-reveal>
      <span class="oc-step__n" aria-hidden="true"><span>${it.n}</span></span>
      <div class="oc-step__text">
        <h3 class="oc-step__label">${it.label}</h3>
        <p class="oc-step__note">${it.note}</p>
        <p class="oc-step__body">${it.text}</p>
      </div>
    </li>`,
    )
    .join("");
  return `<section class="oc-steps oc-light" aria-labelledby="steps-title">
  ${eyebrow(s.eyebrow)}
  <h2 class="oc-visually-hidden" id="steps-title">${s.title}</h2>
  <ol class="oc-steps__list">${items}</ol>
</section>`;
}

function card(m, mod, btn, href) {
  return `<article class="oc-model oc-model--${mod}" data-reveal>
      <h3 class="oc-model__title">${m.title}</h3>
      <p class="oc-model__text">${m.text}</p>
      <ul class="oc-model__points">${m.points.map((p) => `<li>${p}</li>`).join("")}</ul>
      <a class="oc-btn ${btn}" href="${href}">${m.cta}</a>
    </article>`;
}

function models(c) {
  const m = c.models;
  return `<section class="oc-models oc-dark" id="models" aria-labelledby="models-title">
  <div class="oc-models__head">
    ${eyebrow(m.eyebrow)}
    <h2 class="oc-h2" id="models-title" data-split>${m.title}</h2>
  </div>
  <div class="oc-models__stage">
    ${card(m.host, "host", "oc-btn--light", "#contact")}
    <div class="oc-models__station">${img("station", m.stationAlt, 1010, 1250)}</div>
    ${card(m.buy, "buy", "oc-btn--accent", "#contact")}
  </div>
</section>`;
}

function slider(c, key, id) {
  const s = c[key];
  const cards = s.items
    .map(
      (it) => `<li class="oc-card">
        ${img(it.img, `${it.name} — ${it.text}`, 720, 988)}
        <div class="oc-card__text"><h3 class="oc-card__name">${it.name}</h3><p class="oc-card__desc">${it.text}</p></div>
      </li>`,
    )
    .join("");
  return `<section class="oc-slider oc-light" id="${id}" aria-labelledby="${id}-title">
  <div class="oc-slider__head">
    <div>
      ${eyebrow(s.eyebrow)}
      <h2 class="oc-h2" id="${id}-title" data-split>${s.title}</h2>
    </div>
    <div class="oc-slider__controls">
      <button class="oc-round" type="button" data-dir="-1" aria-label="${attr(c.slider.prev)}">${icon("caret-left")}</button>
      <button class="oc-round" type="button" data-dir="1" aria-label="${attr(c.slider.next)}">${icon("caret-right")}</button>
    </div>
  </div>
  <ul class="oc-slider__track" tabindex="0">${cards}</ul>
</section>`;
}

function faq(c) {
  const f = c.faq;
  const items = f.items
    .map(
      (it) => `<details class="oc-faq__item" name="faq">
      <summary><h3>${it.q}</h3>${icon("plus")}</summary>
      <div class="oc-faq__answer"><p>${it.a}</p></div>
    </details>`,
    )
    .join("");
  return `<section class="oc-faq oc-light" aria-labelledby="faq-title">
  <div class="oc-faq__head">
    ${eyebrow(f.eyebrow)}
    <h2 class="oc-h2" id="faq-title" data-split>${f.title}</h2>
  </div>
  <div class="oc-faq__list">${items}</div>
</section>`;
}

function contact(c) {
  const k = c.contact;
  const row = (href, label, value, ic, mod = "", ext = "") =>
    `<li><a class="oc-contact__row ${mod}" href="${href}"${ext}><span class="oc-contact__label">${label}</span><span class="oc-contact__value">${value}</span>${icon(ic, "oc-icon oc-contact__icon")}</a></li>`;
  return `<section class="oc-contact oc-light" id="contact" aria-labelledby="contact-title">
  <div class="oc-contact__head">
    ${eyebrow(k.eyebrow)}
    <h2 class="oc-h2" id="contact-title" data-split>${k.title}</h2>
    <p class="oc-contact__note">${k.note}</p>
  </div>
  <ul class="oc-contact__list">
    ${row("{{whatsapp}}", k.whatsapp, "{{phone}}", "whatsapp-logo", "", ' target="_blank" rel="noopener"')}
    ${row("tel:{{phoneHref}}", k.call, "{{phone}}", "phone")}
    ${row("mailto:{{email}}", k.email, "{{email}}", "envelope-simple")}
    ${row("mailto:{{email}}?subject=OneCup", k.form, k.formNote, "arrow-right", "oc-contact__row--accent")}
  </ul>
</section>`;
}

function marquee() {
  const t = `<span>{{slogan}} /&nbsp;</span>`;
  return `<section class="oc-marquee oc-dark" aria-label="{{slogan}}">
  <div class="oc-marquee__track" aria-hidden="true">${t.repeat(6)}</div>
</section>`;
}

function footer(c) {
  const f = c.footer;
  return `<footer class="oc-footer oc-dark">
  <div class="oc-footer__top">
    <img class="oc-footer__logo" src="{{base}}assets/img/logo-cup.svg" alt="OneCup" width="107" height="142" loading="lazy">
    <div class="oc-footer__col">
      <h2>${f.contacts}</h2>
      <address>${f.city}<br><a href="mailto:{{email}}">{{email}}</a><br><a class="oc-footer__phone" href="tel:{{phoneHref}}">{{phone}}</a></address>
    </div>
    <nav class="oc-footer__col" aria-label="${attr(f.pages)}">
      <h2>${f.pages}</h2>
      <a class="oc-link" href="#top">${f.home}</a>
      <a class="oc-link" href="#models">${c.nav.buy}</a>
      <a class="oc-link" href="#models">${c.nav.host}</a>
      <a class="oc-link" href="#materials">${c.nav.materials}</a>
      <a class="oc-link" href="#contact">${c.nav.contact}</a>
    </nav>
    <nav class="oc-footer__col" aria-label="${attr(f.models)}">
      <h2>${f.models}</h2>
      <a class="oc-link" href="#models">${f.buyModel}</a>
      <a class="oc-link" href="#models">${f.hostModel}</a>
    </nav>
    <a class="oc-round oc-round--light oc-footer__top-btn" href="#top" aria-label="${attr(f.toTop)}">${icon("caret-up")}</a>
  </div>
  <div class="oc-footer__bottom">
    <p>© OneCupCoffee® {{year}}</p>
    <p>${f.legal}</p>
  </div>
</footer>`;
}

function jsonLd(c, site) {
  const url = site.url + c.path;
  return [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": site.url + "#business",
      name: site.name,
      slogan: site.slogan,
      description: c.meta.description,
      url,
      logo: site.url + "assets/img/logo-cup.svg",
      image: site.url + "assets/img/station.webp",
      email: site.email,
      telephone: site.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressCountry: site.country,
      },
      areaServed: { "@type": "Country", name: "Deutschland" },
      knowsLanguage: site.languages,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      inLanguage: site.languages,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: c.lang,
      mainEntity: c.faq.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    },
  ];
}

export function render(c, all, site, css) {
  const url = site.url + c.path;
  const alternates = all
    .map((l) => `<link rel="alternate" hreflang="${l.lang}" href="${site.url}${l.path}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${site.url}">`)
    .join("\n    ");
  const html = `<!doctype html>
<html lang="${c.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${c.meta.title}</title>
    <meta name="description" content="${attr(c.meta.description)}">
    <link rel="canonical" href="${url}">
    ${alternates}
    <meta name="theme-color" content="#0d0e13">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="OneCup">
    <meta property="og:title" content="${attr(c.meta.title)}">
    <meta property="og:description" content="${attr(c.meta.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${site.url}assets/img/station.webp">
    <meta property="og:locale" content="${c.ogLocale}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="{{base}}favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="image" href="{{base}}assets/img/orbit-poster.webp" fetchpriority="high">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap"></noscript>
    ${css.map((h) => `<link rel="stylesheet" href="{{base}}${h}">`).join("\n    ")}
    <script type="application/ld+json">${JSON.stringify(jsonLd(c, site))}</script>
  </head>
  <body>
    <a class="oc-skip" href="#main">${{ de: "Zum Inhalt springen", en: "Skip to content", uk: "Перейти до змісту" }[c.lang]}</a>
    ${header(c, all)}
    <main id="main">
      ${hero(c)}
      ${about(c)}
      ${metrics(c)}
      ${materials(c)}
      ${steps(c)}
      ${models(c)}
      ${slider(c, "where", "where")}
      ${faq(c)}
      ${slider(c, "live", "live")}
      ${contact(c)}
      ${marquee()}
    </main>
    ${footer(c)}
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js" defer></script>
    <script src="{{base}}assets/js/main.js" defer></script>
  </body>
</html>
`;
  const base = c.path ? "../" : "";
  const vars = { base, ...site };
  return html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}
