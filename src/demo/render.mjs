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
  const others = all
    .map(
      (l) =>
        `<li><a href="{{base}}${l.path}${sub}" hreflang="${l.lang}" lang="${l.lang}"${l.lang === c.lang ? ' aria-current="true"' : ""}>${l.name}</a></li>`,
    )
    .join("");
  return `<header class="oc-header">
  <a class="oc-header__logo" href="{{base}}${c.path}" aria-label="OneCup">
    <img src="{{base}}assets/img/logo.svg" alt="OneCup" width="138" height="33">
  </a>
  <nav class="oc-header__nav" aria-label="${attr(c.nav.menu)}">
    <a href="{{base}}${c.path}kaufen/"${page === "buy" ? ' aria-current="page"' : ""}>${c.nav.buy}</a>
    <a href="{{base}}${c.path}standort/"${page === "host" ? ' aria-current="page"' : ""}>${c.nav.host}</a>
    <a href="${h}#how">${c.nav.materials}</a>
    <a href="#contact">${c.nav.contact}</a>
    <a class="oc-header__menu-only" href="#contact">${c.nav.request}</a>
  </nav>
  <div class="oc-header__actions">
    <div class="oc-header__ctas">
      <a class="oc-btn oc-btn--sm oc-btn--green" href="{{whatsapp}}" target="_blank" rel="noopener">${c.nav.whatsapp}</a>
    </div>
    <details class="oc-lang">
      <summary aria-label="${attr(c.nav.language)}">${c.label}${icon("caret-down")}</summary>
      <ul>${others}</ul>
    </details>
  </div>
  <button class="oc-burger" type="button" aria-label="${attr(c.nav.menu)}" aria-expanded="false"><span></span><span></span></button>
</header>`;
}

function hero(c) {
  const rest = c.hero.subtitle.replace("OneCup – Wake Up.", "");
  return `<section class="oc-hero" id="top">
  <h1 class="oc-hero__title" data-split>${c.hero.title}</h1>
  <div class="oc-hero__media">
    <img src="{{base}}assets/img/hero-station.webp" alt="${attr(c.hero.imgAlt)}" width="2752" height="1536" fetchpriority="high" decoding="async">
  </div>
  <div class="oc-hero__body" data-reveal>
    <p class="oc-hero__subtitle"><span>{{slogan}}</span>${rest}</p>
    <div class="oc-hero__ctas">
      <a class="oc-btn oc-btn--accent" href="#models">${c.hero.ctaBuy}</a>
      <a class="oc-btn oc-btn--outline" href="#models">${c.hero.ctaHost}</a>
    </div>
  </div>
</section>`;
}

function about(c) {
  const a = c.about;
  const pill = (n, alt) =>
    `<img class="oc-about__pill" src="{{base}}assets/img/${n}.webp" alt="${attr(alt)}" width="72" height="46" loading="lazy">`;
  const [before, after] = a.text.split(a.inlineAfter);
  return `<section class="oc-about oc-dark" aria-labelledby="about-title">
  <div class="oc-about__inner">
    ${eyebrow(a.eyebrow)}
    <p class="oc-about__quote" id="about-title" data-fill><span class="oc-about__mark">“</span> <strong>${a.brand}</strong> ${before}${a.inlineAfter} ${pill("about-machine", a.imgMachine)}${after} ${pill("about-station", a.imgStation)} <span aria-hidden="true">”</span></p>
  </div>
</section>`;
}

function calc(c) {
  const k = c.calc;
  const marks = [10, 50, 100, 150, 200].map((n) => `<span>${n}</span>`).join("");
  return `<section class="oc-calc oc-dark" aria-labelledby="calc-title">
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

function steps(c) {
  const s = c.steps;
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
  return `<section class="oc-steps oc-dark" id="how" aria-labelledby="steps-title">
  ${eyebrow(s.eyebrow)}
  <h2 class="oc-visually-hidden" id="steps-title">${s.title}</h2>
  <ol class="oc-steps__list">${items}</ol>
</section>`;
}

function choice(m, key, checked) {
  return `<label class="oc-choice">
        <input type="radio" name="model" value="${key}" data-cta="${attr(m.cta)}"${checked ? " checked" : ""}>
        <span class="oc-choice__radio" aria-hidden="true"><svg viewBox="0 0 14 14" width="14" height="14"><path d="M2.5 7.5L5.5 10.5L11.5 3.5"/></svg></span>
        <span class="oc-choice__text"><span class="oc-choice__title">${m.title}</span><span class="oc-choice__desc">${m.text}</span></span>
      </label>`;
}

function models(c) {
  const m = c.models;
  return `<section class="oc-models oc-dark" id="models" aria-labelledby="models-title">
  <img class="oc-models__bg" src="{{base}}assets/img/models-bg.webp" alt="${attr(m.bgAlt)}" width="2752" height="1847" loading="lazy" decoding="async">
  <div class="oc-models__head">
    ${eyebrow(m.eyebrow, "oc-eyebrow--muted")}
    <h2 class="oc-h2" id="models-title" data-split>${m.title}</h2>
  </div>
  <fieldset class="oc-models__choices">
    <legend class="oc-visually-hidden">${m.title}</legend>
    ${choice(m.buy, "buy", true)}
    ${choice(m.host, "host", false)}
  </fieldset>
  <div class="oc-models__foot">
    <p>${m.note}</p>
    <a class="oc-btn oc-btn--accent" href="#contact" data-model-cta>${m.buy.cta}</a>
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

function contact(c) {
  const k = c.contact;
  const row = (href, label, value, ic, mod = "", ext = "") =>
    `<li><a class="oc-contact__row ${mod}" href="${href}"${ext}><span class="oc-contact__label">${label}</span><span class="oc-contact__value">${value}</span>${icon(ic, "oc-icon oc-contact__icon")}</a></li>`;
  return `<section class="oc-contact oc-dark" id="contact" aria-labelledby="contact-title">
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
    <a class="oc-round oc-round--light oc-footer__top-btn" href="#top" aria-label="${attr(f.toTop)}">${icon("caret-up")}</a>
  </div>
  <div class="oc-footer__bottom">
    <p>© OneCupCoffee® {{year}}</p>
    <p>${f.legal}</p>
  </div>
</footer>`;
}

// Buy page — Figma 266:4358 «Station kaufen»; host page — Figma 266:5465 «Standort anbieten»
const heroImg = { buy: ["buy-hero", 1024, 683], host: ["host-hero", 1122, 1402] };

function buyHero(b, page) {
  const [src, w, h] = heroImg[page];
  return `<section class="oc-hero oc-hero--${page}" id="top">
  <h1 class="oc-hero__title" data-split>${b.hero.title}</h1>
  <div class="oc-hero__media">
    <img src="{{base}}assets/img/${src}.webp" alt="${attr(b.hero.imgAlt)}" width="${w}" height="${h}" fetchpriority="high" decoding="async">
  </div>
  <div class="oc-hero__body" data-reveal>
    <p class="oc-hero__subtitle">${b.hero.subtitle}</p>
    <div class="oc-hero__ctas">
      <a class="oc-btn oc-btn--accent" href="#contact">${b.hero.cta}</a>
      <a class="oc-btn oc-btn--outline" href="${b.kit ? "#kit" : "#models"}">${b.hero.kit ?? b.hero.more}</a>
    </div>
  </div>
</section>`;
}

function buyWho(b) {
  const w = b.who;
  const pill = (n, alt) =>
    `<img class="oc-about__pill" src="{{base}}assets/img/buy-pill-${n}.webp" alt="${attr(alt)}" width="94" height="60" loading="lazy">`;
  return `<section class="oc-about oc-dark" aria-label="${attr(w.before)}">
  <div class="oc-about__inner">
    ${eyebrow(w.eyebrow)}
    <p class="oc-about__quote oc-about__quote--plain" data-fill>“${w.before} ${pill(1, w.img1)} ${w.after} ${pill(2, w.img2)} ”</p>
  </div>
</section>`;
}

function buyMetrics(b) {
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

function buyGuests(b) {
  const g = b.guests;
  const items = g.items.map((it) => `<li><h3>${it.t}</h3><p>${it.d}</p></li>`).join("");
  return `<section class="oc-guests oc-dark" aria-label="${attr(g.eyebrow)}">
  ${eyebrow(g.eyebrow)}
  <ul class="oc-guests__list">${items}</ul>
</section>`;
}

const pad = (i) => String(i + 1).padStart(2, "0");

function buyKit(b) {
  const k = b.kit;
  const items = k.items
    .map(
      (it, i) =>
        `<li class="oc-kit__row"><span class="oc-kit__n">${pad(i)}</span><h3>${it.t}</h3><p>${it.d}</p></li>`,
    )
    .join("");
  return `<section class="oc-kit oc-dark" id="kit" aria-labelledby="kit-title">
  ${eyebrow(k.eyebrow, "oc-eyebrow--muted")}
  <h2 class="oc-h2" id="kit-title" data-split>${k.title}</h2>
  <ol class="oc-kit__list">${items}</ol>
</section>`;
}

function buyLineup(b) {
  const m = b.lineup;
  const items = m.items
    .map(
      (it, i) => `<li class="oc-lineup__row">
      <span class="oc-kit__n">${pad(i)}</span>
      <h3 class="oc-lineup__name">${it.t}</h3>
      <p class="oc-lineup__price">${it.p ? `${m.from} ${it.p}` : ""}<span>${it.d}</span></p>
      ${img(`buy-model-${"abc"[i]}`, `${it.t} — ${it.d}`, 240, 180, ' class="oc-lineup__img"')}
    </li>`,
    )
    .join("");
  return `<section class="oc-lineup oc-dark" id="models" aria-labelledby="lineup-title">
  <div class="oc-lineup__head">
    ${eyebrow(m.eyebrow, "oc-eyebrow--muted")}
    <h2 class="oc-h2" id="lineup-title" data-split>${m.title}</h2>
    <p>${m.text}</p>
  </div>
  <ol class="oc-lineup__list">${items}</ol>
  ${m.cta ? `<a class="oc-btn oc-btn--accent" href="#contact">${m.cta}</a>` : ""}
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
    <link rel="preload" as="image" href="{{base}}assets/img/${page === "home" ? "hero-station" : heroImg[page][0]}.webp" fetchpriority="high">
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
              buyHero(c.host, page),
              buyWho(c.host),
              buyMetrics(c.host),
              buyGuests(c.host),
              buyLineup(c.host),
              contact(c),
              marquee(),
            ].join("\n      ")
          : page === "buy"
            ? [
                buyHero(c.buy, page),
                buyWho(c.buy),
                buyMetrics(c.buy),
                buyGuests(c.buy),
                calc(c),
                buyKit(c.buy),
                buyLineup(c.buy),
                contact(c),
                marquee(),
              ].join("\n      ")
            : [
                hero(c),
                about(c),
                calc(c),
                steps(c),
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
