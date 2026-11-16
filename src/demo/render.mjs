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
        [`{{base}}${c.path}kaufen/`, c.nav.buyFull],
        [`{{base}}${c.path}standort/`, c.nav.hostFull],
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
    <a class="oc-header__menu-only" href="#contact">${p?.navCta ?? c.nav.request}</a>
    <ul class="oc-header__langs oc-header__menu-only" aria-label="${attr(c.nav.language)}">${all
      .map(
        (l) =>
          `<li><a href="{{base}}${l.path}${sub}" hreflang="${l.lang}" lang="${l.lang}"${l.lang === c.lang ? ' aria-current="true"' : ""}>${l.label}</a></li>`,
      )
      .join("")}</ul>
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
  const subtitle = home ? h.lead : h.subtitle;
  const title = home ? `<span class="oc-accent">OneCup</span> – Wake Up` : h.title;
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
  const h1 = `<h1 class="oc-hero__title" data-split>${title}</h1>`;
  return `<section class="oc-hero${home ? "" : ` oc-hero--${page}`}" id="top">
  ${home ? media + "\n  " + h1 : h1 + "\n  " + media}
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

// Round icon from Figma (48px, brown disc baked into the SVG)
const badge = (name, alt = "") =>
  `<img class="oc-badge" src="{{base}}assets/img/icons/${name}.svg" alt="${attr(alt)}" width="48" height="48" loading="lazy">`;

// About — Figma 426:4176: centred heading, three paragraphs, three icons
function about(c) {
  const a = c.about;
  return `<section class="oc-intro oc-dark" id="about" aria-labelledby="about-title">
  <h2 class="oc-h2 oc-center" id="about-title" data-split>${a.title}</h2>
  <div class="oc-intro__text" data-reveal>${a.paras.map((p) => `<p>${p}</p>`).join("")}</div>
  <div class="oc-intro__icons" data-reveal>${["ic-shop", "ic-cup", "ic-service"].map((n, i) => badge(n, a.icons[i])).join("")}</div>
</section>`;
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

// Numbered rows — «How it works» on home, «Your benefits» on buy, «For your guests» on host
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

// Contact form — Figma 425:3862 (home); buy and host keep the split rows.
// No backend yet: submit opens a prefilled email (main.js)
function contactForm(c) {
  const k = c.contact;
  const f = c.form;
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
    <fieldset class="oc-topic">
      <legend class="oc-form__title">${f.title}</legend>
      <div class="oc-topic__opts">${topic("buy", f.buy, true)}${topic("host", f.host)}</div>
    </fieldset>
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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Onest:wght@400;500;600&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Onest:wght@400;500;600&display=swap"></noscript>
    ${css.map((h) => `<link rel="stylesheet" href="{{base}}${h}">`).join("\n    ")}
    <script type="application/ld+json">${JSON.stringify(jsonLd(c, site, page, url))}</script>
  </head>
  <body${page === "home" ? ' class="oc-v5"' : ""}>
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
                homeSteps(c.steps),
                models(c),
                slider(c, "where", "where"),
                faq(c),
                live(c),
                contactForm(c),
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
