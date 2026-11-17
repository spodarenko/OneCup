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
  const sub = pages[page];
  // One menu on every page (Figma 425:3802, 429:5064, 475:2047); the current page is marked
  const navLinks = [
    [`{{base}}${c.path}kaufen/`, c.nav.buyFull, "buy"],
    [`{{base}}${c.path}standort/`, c.nav.hostFull, "host"],
    ["#contact", c.nav.reach],
  ];
  // Language menu — Figma 425:3836: a flag in a dark pill, the list shows flag + name
  const flag = (lang) =>
    `<img class="oc-flag" src="{{base}}assets/img/flags/${lang}.svg" alt="" width="24" height="20">`;
  const others = all
    .map(
      (l) =>
        `<li><a href="{{base}}${l.path}${sub}" hreflang="${l.lang}" lang="${l.lang}"${l.lang === c.lang ? ' aria-current="true"' : ""}>${flag(l.lang)}${l.name}</a></li>`,
    )
    .join("");
  return `<header class="oc-header">
  <a class="oc-header__logo" href="{{base}}${c.path}" aria-label="OneCup">
    <img src="{{base}}assets/img/logo.svg" alt="OneCup" width="184" height="43">
  </a>
  <nav class="oc-header__nav" aria-label="${attr(c.nav.menu)}">
    ${navLinks.map(([href, label, id]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ""}>${label}</a>`).join("\n    ")}
    <a class="oc-header__menu-only" href="#contact">${c.nav.request}</a>
    <ul class="oc-header__langs oc-header__menu-only" aria-label="${attr(c.nav.language)}">${all
      .map(
        (l) =>
          `<li><a href="{{base}}${l.path}${sub}" hreflang="${l.lang}" lang="${l.lang}"${l.lang === c.lang ? ' aria-current="true"' : ""}>${l.label}</a></li>`,
      )
      .join("")}</ul>
  </nav>
  <div class="oc-header__actions">
    <div class="oc-header__ctas">
      <a class="oc-btn oc-btn--wa" href="{{whatsapp}}" aria-label="${attr(c.nav.whatsapp)}" target="_blank" rel="noopener"><img src="{{base}}assets/img/icons/whatsapp.svg" alt="" width="24" height="24"><span>${c.nav.whatsapp}</span></a>
    </div>
    <details class="oc-lang">
      <summary aria-label="${attr(`${c.nav.language}: ${c.name}`)}">${flag(c.lang)}</summary>
      <ul>${others}</ul>
    </details>
  </div>
  <button class="oc-burger" type="button" aria-label="${attr(c.nav.menu)}" aria-expanded="false"><span></span><span></span></button>
</header>`;
}

// Hero — one block for every page: the home page orbits the station on scroll,
// the buy and host pages show a still render
const heroImg = { buy: ["buy-hero", 2294, 1281], host: ["host-hero", 2294, 1281] };

function hero(c, page) {
  const home = page === "home";
  const h = home ? c.hero : c[page].hero;
  const v = home ? h : c[page].v5;
  const subtitle = v.lead;
  const title = home ? `<span class="oc-accent">OneCup</span> – Wake Up` : v.title;
  const ctas = home
    ? [
        [h.ctaBuy, `{{base}}${c.path}kaufen/`, "accent"],
        [h.ctaHost, `{{base}}${c.path}standort/`, "outline"],
      ]
    : [[page === "buy" ? c.nav.buyFull : c.nav.hostFull, "#contact", "accent"]];
  const [src, w, ht] = home ? [] : heroImg[page];
  const media = home
    ? `<div class="oc-hero__media" data-orbit data-frames="72" data-src="{{base}}assets/img/orbit/">
    <img src="{{base}}assets/img/orbit/00.webp" alt="${attr(h.imgAlt)}" width="1920" height="1080" fetchpriority="high" decoding="async">
  </div>`
    : `<div class="oc-hero__media">
    <img src="{{base}}assets/img/${src}.webp" alt="${attr(h.imgAlt)}" width="${w}" height="${ht}" fetchpriority="high" decoding="async">
  </div>`;
  const h1 = `<h1 class="oc-hero__title" data-split>${title}</h1>`;
  return `<section class="oc-hero${home ? "" : ` oc-hero--${page}`}" id="top">
  ${media}
  ${h1}
  <div class="oc-hero__body" data-reveal>
    <p class="oc-hero__subtitle">${subtitle}</p>
    <div class="oc-hero__ctas">
      ${ctas.map(([label, href, kind]) => `<a class="oc-btn oc-btn--${kind}" href="${href}">${label}</a>`).join("\n      ")}
    </div>
  </div>
</section>`;
}

// Round icon from Figma (48px, brown disc baked into the SVG)
const badge = (name, alt = "") =>
  `<img class="oc-badge" src="{{base}}assets/img/icons/${name}.svg" alt="${attr(alt)}" width="48" height="48" loading="lazy">`;

// About — Figma 426:4176: centred heading, three paragraphs, three icons
function about(c) {
  const a = c.about;
  return `<section class="oc-intro oc-dark" id="about" aria-labelledby="about-title">
  <h2 class="oc-h2 oc-center" id="about-title" data-split>${a.title}</h2>
  <div class="oc-intro__text" data-fill>${a.paras.map((p) => `<p>${p}</p>`).join("")}</div>
  <div class="oc-intro__icons" data-reveal>${["ic-shop", "ic-cup", "ic-service"].map((n, i) => badge(n, a.icons[i])).join("")}</div>
</section>`;
}

function calc(c) {
  const k = c.calc;
  const marks = [10, 50, 100, 150, 200].map((n) => `<span>${n}</span>`).join("");
  return `<section class="oc-calc oc-dark" id="calc" aria-labelledby="calc-title">
  <img class="oc-calc__bg" src="{{base}}assets/img/calc-bg.webp" alt="${attr(k.bgAlt)}" width="1024" height="435" loading="lazy" decoding="async">
  <h2 class="oc-h2 oc-center oc-calc__title" id="calc-title" data-split>${k.heading}</h2>
  <div class="oc-calc__card" data-calc data-price="{{calcPrice}}" data-days="{{calcDays}}" data-locale="${c.ogLocale.replace("_", "-")}">
    <div class="oc-calc__slider">
      <label class="oc-calc__label" for="calc-cups"><span>${k.hint}</span><span class="oc-calc__value"><output for="calc-cups">{{calcValue}}</output> ${k.unit}</span></label>
      <input class="oc-calc__range" id="calc-cups" type="range" min="{{calcMin}}" max="{{calcMax}}" step="{{calcStep}}" value="{{calcValue}}">
      <div class="oc-calc__scale" aria-hidden="true">${marks}</div>
    </div>
    <p class="oc-calc__result-label" id="calc-result-label">${k.result}</p>
    <p class="oc-calc__result" aria-live="polite" aria-labelledby="calc-result-label"><span data-calc-sum></span><span class="oc-calc__cur">€</span></p>
  </div>
  <p class="oc-calc__note">${k.note}</p>
</section>`;
}

// How it works on home — Figma 426:4403: four cards in a row + CTA
function homeSteps(s) {
  const glyphs = ["ic-pin", "g-cup", "g-card", "g-stars"];
  const items = s.items
    .map(
      (it, i) => `<li class="oc-howcard" data-reveal>
      ${i ? `<span class="oc-badge oc-badge--glyph"><img src="{{base}}assets/img/icons/${glyphs[i]}.svg" alt="" width="32" height="32" loading="lazy"></span>` : badge(glyphs[i])}
      <h3 class="oc-howcard__title">${it.label}</h3>
      <p class="oc-howcard__text">${it.text}</p>
    </li>`,
    )
    .join("");
  return `<section class="oc-how oc-dark" id="how" aria-labelledby="how-title">
  <h2 class="oc-h2 oc-center" id="how-title" data-split>${s.heading}</h2>
  <ol class="oc-how__cards">${items}</ol>
  <a class="oc-btn oc-btn--accent" href="#contact">${s.cta}</a>
</section>`;
}

function models(c) {
  const m = c.models;
  const card = (k, btn) => `<article class="oc-model${k === "buy" ? " oc-model--accent" : ""}">
      <h3 class="oc-model__title">${m[k].title}</h3>
      <p class="oc-model__text">${m[k].text}</p>
      <a class="oc-btn ${btn}" href="#contact" data-topic="${k}">${m[k].cta}</a>
    </article>`;
  return `<section class="oc-models oc-dark" id="models" aria-labelledby="models-title">
  <img class="oc-models__bg" src="{{base}}assets/img/models-bg.webp" alt="${attr(m.bgAlt)}" width="2880" height="1936" loading="lazy" decoding="async">
  <h2 class="oc-h2 oc-center oc-models__title" id="models-title" data-split>${m.title}</h2>
  <div class="oc-models__cards">
    ${card("buy", "oc-btn--accent")}
    ${card("host", "oc-btn--dark")}
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
  <h2 class="oc-h2 oc-center" id="${id}-title" data-split>${s.heading}</h2>
  <ul class="oc-slider__track" tabindex="0">${cards}</ul>
  <div class="oc-slider__controls">
    <button class="oc-round" type="button" data-dir="-1" aria-label="${attr(c.slider.prev)}">${icon("caret-left")}</button>
    <button class="oc-round" type="button" data-dir="1" aria-label="${attr(c.slider.next)}">${icon("caret-right")}</button>
  </div>
</section>`;
}

// Already running — Figma 466:234: three photo cards, no slider
function live(c) {
  const s = c.live;
  const cards = s.items
    .slice(0, 3)
    .map(
      (it) =>
        `<li class="oc-livecard" data-reveal>${img(it.img, `${it.name} — ${it.text}`, 720, 988)}</li>`,
    )
    .join("");
  return `<section class="oc-live oc-dark" id="live" aria-labelledby="live-title">
  <h2 class="oc-h2 oc-center" id="live-title" data-split>${s.heading}</h2>
  <ul class="oc-live__cards">${cards}</ul>
</section>`;
}

function faq(c) {
  const f = c.faq;
  const items = f.items
    .map(
      (it, i) => `<details class="oc-faq__item" name="faq"${i ? "" : " open"}>
      <summary><h3>${it.q}</h3>${icon("plus")}</summary>
      <div class="oc-faq__answer"><p>${it.a}</p></div>
    </details>`,
    )
    .join("");
  return `<section class="oc-faq oc-dark" aria-labelledby="faq-title">
  <h2 class="oc-h2 oc-center" id="faq-title" data-split>${f.heading}</h2>
  <div class="oc-faq__list">${items}</div>
</section>`;
}

// Contact form — Figma 425:3862 (home); buy and host keep the split rows.
// No backend yet: submit opens a prefilled email (main.js)
function contactForm(c, page) {
  const k = c.contact;
  const f = c.form;
  const home = page === "home";
  const title = home ? f.title : c[page].v5.formTitle;
  const field = (name, label, type = "text", req = false) =>
    `<label class="oc-field"><span class="oc-visually-hidden">${label}</span><input name="${name}" type="${type}" placeholder="${attr(label)}"${req ? " required" : ""}></label>`;
  const topic = (v, label, on) =>
    `<label class="oc-topic__opt"><input type="radio" name="topic" value="${attr(label)}" data-topic="${v}"${on ? " checked" : ""}><span>${label}</span></label>`;
  const alt = (href, label, name, ext = "") =>
    `<a class="oc-alt__link" href="${href}"${ext}>${badge(name)}<span>${label}</span></a>`;
  return `<section class="oc-form oc-dark" id="contact" aria-labelledby="contact-title">
  <div class="oc-form__head">
    <h2 class="oc-h2 oc-center" id="contact-title" data-split>${k.title}</h2>
    <p class="oc-form__note">${k.note}</p>
  </div>
  <form class="oc-form__card" data-mailto="{{email}}" data-subject="${attr(f.subject)}" data-reveal>
    ${
      home
        ? `<fieldset class="oc-topic">
      <legend class="oc-form__title">${title}</legend>
      <div class="oc-topic__opts">${topic("buy", f.buy, true)}${topic("host", f.host)}</div>
    </fieldset>`
        : `<p class="oc-form__title">${title}</p><input type="hidden" name="topic" value="${attr(page === "buy" ? f.buy : f.host)}">`
    }
    ${field("name", f.name, "text", true)}
    ${field("email", f.email, "email", true)}
    ${field("phone", f.phone, "tel")}
    <label class="oc-field"><span class="oc-visually-hidden">${f.message}</span><textarea name="message" rows="1" placeholder="${attr(f.message)}"></textarea></label>
    <label class="oc-check"><input type="checkbox" name="consent" required><span>${f.consent}</span></label>
    <button class="oc-btn oc-btn--accent oc-form__submit" type="submit">${f.submit}</button>
  </form>
  <div class="oc-alt" data-reveal>
    ${alt("{{whatsapp}}", k.whatsapp, "ic-whatsapp", ' target="_blank" rel="noopener"')}
    ${alt("tel:{{phoneHref}}", k.call, "ic-phone")}
    ${alt("mailto:{{email}}", k.email, "ic-mail")}
  </div>
</section>`;
}

// Metrics — Figma 429:4697 (buy, 3) and 477:2345 (host, 2): centred heading, orange values
function v5Metrics(v) {
  const items = v.metrics
    .map(
      (m) => `<li class="oc-metric">
      <p class="oc-metric__value">${m.v}<span>${m.u}</span></p>
      <h3 class="oc-metric__title">${m.t}</h3>
      <p class="oc-metric__text">${m.d}</p>
    </li>`,
    )
    .join("");
  return `<section class="oc-metrics oc-dark" aria-labelledby="metrics-title">
  <h2 class="oc-h2 oc-center" id="metrics-title" data-split>${v.metricsTitle}</h2>
  <ul class="oc-metrics__list">${items}</ul>
</section>`;
}

// Benefits — Figma 429:5980: five round icons with caps labels + CTA
function benefits(v) {
  const icons = ["ic-bulb", "ic-hand", "ic-box", "ic-gear", "ic-house"];
  return `<section class="oc-points oc-dark" id="benefits" aria-labelledby="benefits-title">
  <h2 class="oc-h2 oc-center" id="benefits-title" data-split>${v.benefitsTitle}</h2>
  <ul class="oc-points__list">${v.benefits.map((b, i) => `<li data-reveal>${badge(icons[i])}<span>${b}</span></li>`).join("")}</ul>
  <a class="oc-btn oc-btn--accent" href="#contact">${v.cta}</a>
</section>`;
}

// Everything for your start — Figma 466:418: photo with model switcher, kit list, price
function start(v, cta) {
  const models = v.models
    .map(
      (name, i) =>
        `<button class="oc-start__thumb" type="button" data-model="${i}" aria-label="${attr(name)}"${i === 1 ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${img(`buy-model-${"abc"[i]}`, "", 96, 96)}</button>`,
    )
    .join("");
  return `<section class="oc-start oc-dark" id="models" aria-labelledby="start-title">
  <h2 class="oc-h2 oc-center" id="start-title" data-split>${v.startTitle}</h2>
  <div class="oc-start__grid">
    <div class="oc-start__media" data-reveal>
      <div class="oc-start__photo">${v.models.map((name, i) => img(`buy-model-${"abc"[i]}`, `OneCup ${name}`, 480, 410, i === 1 ? "" : " hidden")).join("")}</div>
      <div class="oc-start__thumbs">${models}</div>
    </div>
    <div class="oc-start__info" data-reveal>
      <h3 class="oc-start__name">${v.startName}</h3>
      <ul class="oc-start__list">${v.startList.map((x) => `<li>${x}</li>`).join("")}</ul>
      <p class="oc-start__label">${v.priceLabel}</p>
      <p class="oc-start__price">${v.price}</p>
      <p class="oc-start__label oc-start__label--light">${v.priceNote}</p>
      <a class="oc-btn oc-btn--accent" href="#contact">${cta}</a>
    </div>
  </div>
</section>`;
}

// Host about — Figma 477:2320: the home About block with host copy
function hostAbout(v) {
  return `<section class="oc-intro oc-dark" id="about" aria-labelledby="about-title">
  <h2 class="oc-h2 oc-center" id="about-title" data-split>${v.aboutTitle}</h2>
  <div class="oc-intro__text" data-fill>${v.about.map((p) => `<p>${p}</p>`).join("")}</div>
  <div class="oc-intro__icons" data-reveal>${["ic-shop", "ic-cup", "ic-service"].map((n) => badge(n)).join("")}</div>
</section>`;
}

// Host cooperation — Figma 477:2292: home models layout + subtitle and terms
function coop(v) {
  const card = (it, i) => `<article class="oc-model${i === 0 ? " oc-model--accent" : ""}">
      <h3 class="oc-model__title">${it.t}</h3>
      <p class="oc-model__text">${it.d}</p>
      <p class="oc-model__terms"><strong>${it.term}</strong>${it.note}</p>
      <a class="oc-btn ${i === 0 ? "oc-btn--accent" : "oc-btn--dark"}" href="#contact">${it.cta}</a>
    </article>`;
  return `<section class="oc-models oc-models--coop oc-dark" id="models" aria-labelledby="models-title">
  <img class="oc-models__bg" src="{{base}}assets/img/models-bg.webp" alt="" width="2880" height="1936" loading="lazy" decoding="async">
  <div class="oc-models__head oc-center">
    <h2 class="oc-h2" id="models-title" data-split>${v.coopTitle}</h2>
    <p class="oc-models__sub">${v.coopText}</p>
  </div>
  <div class="oc-models__cards">${v.coop.map(card).join("")}</div>
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
    <p><span class="oc-accent">© OneCupCoffee®</span> {{year}}. ${f.rights}</p>
    <p class="oc-footer__legal">${f.legal}</p>
    <p class="oc-footer__dev">${f.devBy} <span>Intelliweb</span></p>
  </div>
</footer>`;
}

// Buy page — Figma 333:2861 «Station kaufen»; host page — Figma 266:5465 «Standort anbieten»

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
    <meta property="og:image" content="${site.url}assets/img/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="${c.ogLocale}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="icon" href="{{base}}favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="image" href="{{base}}assets/img/${page === "home" ? "orbit/00" : heroImg[page][0]}.webp" fetchpriority="high">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Onest:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Onest:wght@400;500;600&display=swap"></noscript>
    ${css.map((h) => `<link rel="stylesheet" href="{{base}}${h}">`).join("\n    ")}
    <script type="application/ld+json">${JSON.stringify(jsonLd(c, site, page, url))}</script>
  </head>
  <body class="oc-v5">
    <a class="oc-skip" href="#main">${{ de: "Zum Inhalt springen", en: "Skip to content", uk: "Перейти до змісту" }[c.lang]}</a>
    ${header(c, all, page)}
    <main id="main">
      ${
        page === "host"
          ? [
              hero(c, page),
              hostAbout(c.host.v5),
              v5Metrics(c.host.v5),
              coop(c.host.v5),
              contactForm(c, page),
            ].join("\n      ")
          : page === "buy"
            ? [
                hero(c, page),
                v5Metrics(c.buy.v5),
                benefits(c.buy.v5),
                start(c.buy.v5, c.nav.buyFull),
                contactForm(c, page),
              ].join("\n      ")
            : [
                hero(c, page),
                about(c),
                calc(c),
                homeSteps(c.steps),
                models(c),
                slider(c, "where", "where"),
                faq(c),
                live(c),
                contactForm(c, page),
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
