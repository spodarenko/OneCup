// Renders one language version of a page (home, buy or host). Content: src/content/<lang>.json, site data: src/config/site.json.
import { icons } from "./icons.mjs";

const attr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const icon = (name, cls = "oc-icon") =>
  `<svg class="${cls}" viewBox="0 0 256 256" aria-hidden="true"><path d="${icons[name]}"/></svg>`;
const img = (name, alt, w, h, extra = "") =>
  `<img src="{{base}}assets/img/${name}.webp" alt="${attr(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async"${extra}>`;

// Sub-path of each page under the language root
export const pages = { home: "", buy: "kaufen/", host: "standort/" };

const eyebrow = (text, cls = "") => `<p class="oc-eyebrow ${cls}">${text}</p>`;

function header(c, all, page) {
  const h = page === "home" ? "" : `{{base}}${c.path}`;
  const sub = pages[page];
  const p = c[page];
  // A page can bring its own menu (Figma per page); otherwise the home sections
  const anchor = (id) =>
    id === "host"
      ? `{{base}}${c.path}standort/`
      : id === "buy"
        ? `{{base}}${c.path}kaufen/`
        : `#${id}`;
  const navLinks = p?.nav
    ? p.nav.map(([id, label]) => [anchor(id), label])
    : [
        [`${h}#calc`, c.nav.calc],
        [`${h}#how`, c.nav.materials],
        [`${h}#models`, c.nav.models],
        [`${h}#where`, c.nav.uses],
        ["#contact", c.nav.reach],
      ];
  const others = all
    .map(
      (l) =>
        `<li><a href="{{base}}${l.path}${sub}" hreflang="${l.lang}" lang="${l.lang}"${l.lang === c.lang ? ' aria-current="true"' : ""}>${l.name}</a></li>`,
    )
    .join("");
  return `<header class="oc-header">
  <a class="oc-header__logo" href="{{base}}${c.path}" aria-label="OneCup">
    <img src="{{base}}assets/img/logo.svg" alt="OneCup" width="183" height="43">
  </a>
  <nav class="oc-header__nav" aria-label="${attr(c.nav.menu)}">
    ${navLinks.map(([href, label]) => `<a href="${href}">${label}</a>`).join("\n    ")}
    <a class="oc-header__menu-only" href="#contact">${c.nav.request}</a>
  </nav>
  <div class="oc-header__actions">
    <div class="oc-header__ctas">
      <a class="oc-btn oc-btn--sm oc-btn--green" href="{{whatsapp}}" target="_blank" rel="noopener">${c.nav.whatsapp}</a>
      ${p?.navCta ? `<a class="oc-btn oc-btn--sm oc-btn--outline" href="#contact">${p.navCta}</a>` : ""}
    </div>
    <details class="oc-lang">
      <summary aria-label="${attr(c.nav.language)}">${c.label}${icon("caret-down")}</summary>
      <ul>${others}</ul>
    </details>
  </div>
  <button class="oc-burger" type="button" aria-label="${attr(c.nav.menu)}" aria-expanded="false"><span></span><span></span></button>
</header>`;
}

// Hero — one block for every page: the home page orbits the station on scroll,
// the buy and host pages show a still render
const heroImg = { buy: ["buy-hero", 2880, 1460], host: ["host-hero", 1122, 1402] };

function hero(c, page) {
  const home = page === "home";
  const h = home ? c.hero : c[page].hero;
  const subtitle = home
    ? `<span class="oc-accent">{{slogan}}</span>${h.subtitle.replace("OneCup – Wake Up.", "")}`
    : h.subtitle;
  const ctas = home
    ? [
        [h.ctaBuy, `{{base}}${c.path}kaufen/`, "accent"],
        [h.ctaHost, `{{base}}${c.path}standort/`, "outline"],
      ]
    : [[h.cta, "#contact", "accent"], ...(h.more ? [[h.more, "#models", "outline"]] : [])];
  const [src, w, ht] = home ? [] : heroImg[page];
  const media = home
    ? `<div class="oc-hero__media" data-orbit data-frames="72" data-src="{{base}}assets/img/orbit/">
    <img src="{{base}}assets/img/orbit/00.webp" alt="${attr(h.imgAlt)}" width="1920" height="1080" fetchpriority="high" decoding="async">
  </div>`
    : `<div class="oc-hero__media">
    <img src="{{base}}assets/img/${src}.webp" alt="${attr(h.imgAlt)}" width="${w}" height="${ht}" fetchpriority="high" decoding="async">
  </div>`;
  return `<section class="oc-hero${home ? "" : ` oc-hero--${page}`}" id="top">
  <h1 class="oc-hero__title" data-split>${h.title}</h1>
  ${media}
  <div class="oc-hero__body" data-reveal>
    <p class="oc-hero__subtitle">${subtitle}</p>
    <div class="oc-hero__ctas">
      ${ctas.map(([label, href, kind]) => `<a class="oc-btn oc-btn--${kind}" href="${href}">${label}</a>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

// Quote — «About OneCup» on home and «Who it's for» on the buy and host pages
function quote(eb, inner, label) {
  return `<section class="oc-about oc-dark" aria-label="${attr(label)}">
  <div class="oc-about__inner">
    ${eyebrow(eb)}
    <p class="oc-about__quote" data-fill>${inner}</p>
  </div>
</section>`;
}

const pill = (n, alt) =>
  `<img class="oc-about__pill" src="{{base}}assets/img/${n}.webp" alt="${attr(alt)}" width="94" height="60" loading="lazy">`;

function about(c) {
  const a = c.about;
  const [before, after] = a.text.split(a.inlineAfter);
  return quote(
    a.eyebrow,
    `<span class="oc-about__mark">“</span> <strong>${a.brand}</strong> ${before}${a.inlineAfter} ${pill("about-machine", a.imgMachine)}${after} ${pill("about-station", a.imgStation)} <span aria-hidden="true">”</span>`,
    `${a.brand} ${a.inlineAfter}`,
  );
}

function who(w) {
  return quote(
    w.eyebrow,
    `“${w.before} ${pill("buy-pill-1", w.img1)} ${w.after} ${pill("buy-pill-2", w.img2)} ”`,
    w.before,
  );
}

function calc(c) {
  const k = c.calc;
  const marks = [10, 50, 100, 150, 200].map((n) => `<span>${n}</span>`).join("");
  return `<section class="oc-calc oc-dark" id="calc" aria-labelledby="calc-title">
  <img class="oc-calc__bg" src="{{base}}assets/img/calc-bg.webp" alt="${attr(k.bgAlt)}" width="2880" height="1152" loading="lazy" decoding="async">
  <div class="oc-calc__head">
    ${eyebrow(k.eyebrow)}
    <h2 class="oc-calc__title" id="calc-title" data-split>${k.title}</h2>
    <p class="oc-calc__text">${k.text}</p>
  </div>
  <div class="oc-calc__card" data-calc data-price="{{calcPrice}}" data-days="{{calcDays}}" data-locale="${c.ogLocale.replace("_", "-")}">
    <div class="oc-calc__slider">
      <label class="oc-calc__label" for="calc-cups"><span>${k.label}</span><output for="calc-cups">{{calcValue}}</output></label>
      <input class="oc-calc__range" id="calc-cups" type="range" min="{{calcMin}}" max="{{calcMax}}" step="{{calcStep}}" value="{{calcValue}}">
      <div class="oc-calc__scale" aria-hidden="true">${marks}</div>
    </div>
    <p class="oc-calc__result-label" id="calc-result-label">${k.result}</p>
    <p class="oc-calc__result" aria-live="polite" aria-labelledby="calc-result-label"><span data-calc-sum></span><span class="oc-calc__cur">€</span></p>
  </div>
</section>`;
}

// Numbered rows — «How it works» on home, «Your benefits» on buy, «For your guests» on host
function steps(s, id = "how") {
  const items = s.items
    .map(
      (it) => `<li class="oc-step" data-reveal>
      <span class="oc-step__n" aria-hidden="true"><span>${it.n}</span></span>
      <div class="oc-step__text">
        <h3 class="oc-step__label">${it.label}</h3>
        <p class="oc-step__body">${it.text}</p>
      </div>
    </li>`,
    )
    .join("");
  return `<section class="oc-steps oc-dark" id="${id}" aria-labelledby="${id}-title">
  ${eyebrow(s.eyebrow)}
  <h2 class="oc-visually-hidden" id="${id}-title">${s.title}</h2>
  <ol class="oc-steps__list">${items}</ol>
</section>`;
}

function models(c) {
  const m = c.models;
  const card = (k, btn) => `<article class="oc-model${k === "buy" ? " oc-model--accent" : ""}">
      <h3 class="oc-model__title">${m[k].title}</h3>
      <p class="oc-model__text">${m[k].text}</p>
      <a class="oc-btn ${btn}" href="#contact">${m[k].cta}</a>
    </article>`;
  return `<section class="oc-models oc-dark" id="models" aria-labelledby="models-title">
  <img class="oc-models__bg" src="{{base}}assets/img/models-bg.webp" alt="${attr(m.bgAlt)}" width="2880" height="1936" loading="lazy" decoding="async">
  <div class="oc-models__head">
    ${eyebrow(m.eyebrow)}
    <h2 class="oc-h2" id="models-title" data-split>${m.title}</h2>
  </div>
  <div class="oc-models__cards">
    ${card("buy", "oc-btn--accent")}
    ${card("host", "oc-btn--outline")}
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
  return `<section class="oc-slider oc-dark" id="${id}" aria-labelledby="${id}-title">
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
  return `<section class="oc-faq oc-dark" aria-labelledby="faq-title">
  <div class="oc-faq__head">
    ${eyebrow(f.eyebrow)}
    <h2 class="oc-h2" id="faq-title" data-split>${f.title}</h2>
  </div>
  <div class="oc-faq__list">${items}</div>
</section>`;
}

// Split block — 280px head + 824px rows; Contact and the buy-page kit share it
function split(id, head, rows) {
  return `<section class="oc-split oc-dark" id="${id}" aria-labelledby="${id}-title">
  <div class="oc-split__head">
    ${eyebrow(head.eyebrow)}
    <h2 class="oc-h2" id="${id}-title" data-split>${head.title}</h2>
    <p class="oc-split__note">${head.note}</p>
  </div>
  <ul class="oc-split__rows">
    ${rows.join("\n    ")}
  </ul>
</section>`;
}

function contact(c) {
  const k = c.contact;
  const row = (href, label, value, ic, mod = "", ext = "") =>
    `<li><a class="oc-row oc-row--link ${mod}" href="${href}"${ext}><span class="oc-row__label">${label}</span><span class="oc-row__value">${value}</span>${icon(ic, "oc-icon oc-row__icon")}</a></li>`;
  return split("contact", k, [
    row(
      "{{whatsapp}}",
      k.whatsapp,
      "{{phone}}",
      "whatsapp-logo",
      "",
      ' target="_blank" rel="noopener"',
    ),
    row("tel:{{phoneHref}}", k.call, "{{phone}}", "phone"),
    row("mailto:{{email}}", k.email, "{{email}}", "envelope-simple"),
    row("mailto:{{email}}?subject=OneCup", k.form, k.formNote, "arrow-right", "oc-row--accent"),
  ]);
}

function kit(k) {
  return split(
    "kit",
    k,
    k.items.map(
      (it) =>
        `<li class="oc-row oc-row--compact"><span class="oc-row__label">${it.t}</span><span class="oc-row__text">${it.d}</span></li>`,
    ),
  );
}

function marquee() {
  const t = `<span>{{slogan}} /&nbsp;</span>`;
  return `<section class="oc-marquee oc-dark" aria-label="{{slogan}}">
  <div class="oc-marquee__track" aria-hidden="true">${t.repeat(6)}</div>
</section>`;
}

function footer(c, page) {
  const f = c.footer;
  const h = page === "home" ? "" : `{{base}}${c.path}`;
  return `<footer class="oc-footer oc-dark">
  <div class="oc-footer__top">
    <img class="oc-footer__logo" src="{{base}}assets/img/logo-cup.svg" alt="OneCup" width="107" height="142" loading="lazy">
    <div class="oc-footer__col">
      <h2>${f.contacts}</h2>
      <address>${f.city}<br><a href="mailto:{{email}}">{{email}}</a><br><a class="oc-footer__phone" href="tel:{{phoneHref}}">{{phone}}</a></address>
    </div>
    <nav class="oc-footer__col" aria-label="${attr(f.pages)}">
      <h2>${f.pages}</h2>
      <a class="oc-link" href="${h}#top">${f.home}</a>
      <a class="oc-link" href="{{base}}${c.path}kaufen/">${c.nav.buy}</a>
      <a class="oc-link" href="{{base}}${c.path}standort/">${c.nav.host}</a>
      <a class="oc-link" href="${h}#how">${c.nav.materials}</a>
      <a class="oc-link" href="#contact">${c.nav.contact}</a>
    </nav>
    <nav class="oc-footer__col" aria-label="${attr(f.models)}">
      <h2>${f.models}</h2>
      <a class="oc-link" href="{{base}}${c.path}kaufen/">${f.buyModel}</a>
      <a class="oc-link" href="{{base}}${c.path}standort/">${f.hostModel}</a>
    </nav>
    <a class="oc-round oc-footer__top-btn" href="#top" aria-label="${attr(f.toTop)}">${icon("caret-up")}</a>
  </div>
  <div class="oc-footer__bottom">
    <p>© OneCupCoffee® {{year}}</p>
    <p>${f.legal}</p>
  </div>
</footer>`;
}

// Buy page — Figma 333:2861 «Station kaufen»; host page — Figma 266:5465 «Standort anbieten»

function metrics(b) {
  const items = b.metrics
    .map(
      (m) => `<li class="oc-metric">
      <p class="oc-metric__value">${m.v}<span>${m.u}</span></p>
      <h3 class="oc-metric__title">${m.t}</h3>
      <p class="oc-metric__text">${m.d}</p>
    </li>`,
    )
    .join("");
  return `<section class="oc-metrics oc-dark"><ul class="oc-metrics__list">${items}</ul></section>`;
}

// Models list with photos, price and CTA — Figma 333:3128
function lineup(m) {
  const items = m.items
    .map(
      (it, i) => `<li class="oc-lineup__row">
      ${img(`buy-model-${"abc"[i]}`, `${it.t} — ${it.d}`, 240, 180, ' class="oc-lineup__img"')}
      <h3 class="oc-lineup__name">${it.t}</h3>
      <p class="oc-lineup__text">${it.d}</p>
    </li>`,
    )
    .join("");
  return `<section class="oc-lineup oc-dark" id="models" aria-labelledby="lineup-title">
  <div class="oc-lineup__head">
    ${eyebrow(m.eyebrow)}
    <h2 class="oc-h2" id="lineup-title" data-split>${m.title}</h2>
    <p>${m.text}</p>
  </div>
  <ol class="oc-lineup__list">${items}</ol>
  <div class="oc-lineup__foot">
    <p class="oc-lineup__note">${m.note}</p>
    <p class="oc-lineup__price">${m.price}<span>${m.priceNote}</span></p>
    <a class="oc-btn oc-btn--accent" href="#contact">${m.cta}</a>
  </div>
</section>`;
}

// Host page cooperation models — Figma 333:3783 (B7): the home models layout, terms instead of buttons
function hostCoop(h) {
  const m = h.coop;
  const card = (it, i) => `<article class="oc-model${i === 0 ? " oc-model--accent" : ""}">
      <h3 class="oc-model__title">${it.t}</h3>
      <p class="oc-model__text">${it.d}</p>
      <p class="oc-model__terms"><strong>${it.term}</strong>${it.note}</p>
      <a class="oc-btn ${i === 0 ? "oc-btn--accent" : "oc-btn--outline"}" href="#contact">${it.cta}</a>
    </article>`;
  return `<section class="oc-models oc-dark" id="models" aria-labelledby="models-title">
  <img class="oc-models__bg" src="{{base}}assets/img/models-bg.webp" alt="${attr(m.bgAlt)}" width="2880" height="1936" loading="lazy" decoding="async">
  <div class="oc-models__head">
    ${eyebrow(m.eyebrow)}
    <h2 class="oc-h2" id="models-title" data-split>${m.title}</h2>
  </div>
  <div class="oc-models__cards">${m.items.map(card).join("")}</div>
</section>`;
}

function jsonLd(c, site, page, url) {
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
    page === "home" && {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: c.lang,
      mainEntity: c.faq.items.map((it) => ({
        "@type": "Question",
        name: it.q,
        acceptedAnswer: { "@type": "Answer", text: it.a },
      })),
    },
  ].filter(Boolean);
}

export function render(c, all, site, css, page = "home") {
  const sub = pages[page];
  const url = site.url + c.path + sub;
  const meta = page === "home" ? c.meta : c[page].meta;
  const alternates = all
    .map((l) => `<link rel="alternate" hreflang="${l.lang}" href="${site.url}${l.path}${sub}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${site.url}${sub}">`)
    .join("\n    ");
  const html = `<!doctype html>
<html lang="${c.lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${meta.title}</title>
    <meta name="description" content="${attr(meta.description)}">
    <link rel="canonical" href="${url}">
    ${alternates}
    <meta name="theme-color" content="#0d0e13">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="OneCup">
    <meta property="og:title" content="${attr(meta.title)}">
    <meta property="og:description" content="${attr(meta.description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${site.url}assets/img/station.webp">
    <meta property="og:locale" content="${c.ogLocale}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="{{base}}favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="image" href="{{base}}assets/img/${page === "home" ? "orbit/00" : heroImg[page][0]}.webp" fetchpriority="high">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&display=swap"></noscript>
    ${css.map((h) => `<link rel="stylesheet" href="{{base}}${h}">`).join("\n    ")}
    <script type="application/ld+json">${JSON.stringify(jsonLd(c, site, page, url))}</script>
  </head>
  <body>
    <a class="oc-skip" href="#main">${{ de: "Zum Inhalt springen", en: "Skip to content", uk: "Перейти до змісту" }[c.lang]}</a>
    ${header(c, all, page)}
    <main id="main">
      ${
        page === "host"
          ? [
              hero(c, page),
              who(c.host.who),
              metrics(c.host),
              steps(c.host.steps),
              hostCoop(c.host),
              contact(c),
              marquee(),
            ].join("\n      ")
          : page === "buy"
            ? [
                hero(c, page),
                who(c.buy.who),
                metrics(c.buy),
                steps(c.buy.steps, "benefits"),
                kit(c.buy.kit),
                lineup(c.buy.lineup),
                contact(c),
                marquee(),
              ].join("\n      ")
            : [
                hero(c, page),
                about(c),
                calc(c),
                steps(c.steps),
                models(c),
                slider(c, "where", "where"),
                faq(c),
                slider(c, "live", "live"),
                contact(c),
                marquee(),
              ].join("\n      ")
      }
    </main>
    ${footer(c, page)}
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js" defer></script>
    <script src="{{base}}assets/js/main.js" defer></script>
  </body>
</html>
`;
  const base = "../".repeat((c.path + sub).split("/").filter(Boolean).length);
  const vars = { base, ...site };
  return html.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));
}
