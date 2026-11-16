# Design → code

Figma: «One cup coffee», `fileKey` in `figma.config.json`. Main page: node `425:3517` (v5, dark, DE), 1440 px. Buy 429:4610, host 475:1861.
The design project (research, brief, agents) is `../OneCup/`. It stays outside this repo.

## Rules

- Values only from `src/config/tokens.css`. A hex or pixel value not in tokens → add the token first
- Font: Onest 400 / 500 / 600 is legacy; every page now uses Inter 400 / 500 / 700, caps headings, orange `#f89717`. Scoped by `body.oc-v5` (tokens in the `.oc-v5` block, styles in `sections/home.css`)
- Icons: Phosphor **Regular** for UI (carets, plus). Round 48 px brand icons on home come from Figma as SVG (`assets/img/icons/`). Use real icons, not text arrows (→, +)
- Slogan «OneCup – Wake Up.» stays in English in every language; the H1 says what the brand does

## Home page sections (top → bottom), Figma 425:3517

| #   | Section                                | Figma node | Function        |
| --- | -------------------------------------- | ---------- | --------------- |
| —   | Header (Kaufen · Aufstellen · Kontakt) | 425:3802   | `header()`      |
| 1   | Hero (render, «OneCup – Wake Up»)      | 425:3524   | `hero()`        |
| 2   | About (text + 3 icons)                 | 426:4176   | `about()`       |
| 3   | Revenue calculator                     | 425:3565   | `calc()`        |
| 4   | How it works (4 cards + CTA)           | 426:4403   | `homeSteps()`   |
| 5   | Two models                             | 425:3627   | `models()`      |
| 6   | Where it's installed (slider)          | 425:3646   | `slider()`      |
| 7   | FAQ (first item open)                  | 425:3682   | `faq()`         |
| 8   | Already running (3 photos)             | 466:234    | `live()`        |
| 9   | Contact form + WhatsApp / call / email | 425:3862   | `contactForm()` |
| —   | Footer                                 | 426:4201   | `footer()`      |

No marquee on home. The contact form has no backend yet: submit opens a prefilled email to `{{email}}`; model buttons preselect the topic.

## Buy page `kaufen/` — Figma 429:4610 «Station kaufen»

Hero (three stations, still) → Metrics «Sie benötigen lediglich» (3) → Benefits (5 icons + CTA) → Everything for your start (photo + Classic / Arc / Wood switcher, kit list, price from 6.000 €) → Contact form → Footer.
Copy: `buy.v5` in `src/content/<lang>.json`; DE from Figma, EN / UK translated.

## Host page `standort/` — Figma 475:1861 «Standort anbieten»

Hero (station in a lobby, still) → About (home layout) → Metrics «Nur wenige Voraussetzungen» (2) → Cooperation (home models layout + subtitle and terms) → Contact form → Footer.
Copy: `host.v5`; DE from Figma, EN / UK translated.

All three pages share the header menu (Kaufen · Aufstellen · Kontakt, current page marked), the hero (render first, title over its faded bottom), the contact form (topic switch only on home) and the footer. Calculator: monthly revenue = drinks per day × `calcPrice` × `calcDays` (`src/config/site.json`).

## Motion

Reference: https://www.coffee-tech.com (Webflow + GSAP, ScrollTrigger, SplitText, smooth scroll). Implemented in `src/theme/onecup/assets/js/main.js`:

| Where                   | Effect                                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page                    | Lenis smooth scroll; anchor links scroll smoothly                                                                                                   |
| Hero                    | Pinned when the title reaches the viewport top; 1.5 screens of scroll scrub the station orbit and lift it 5% (72 frames, `assets/img/orbit/`)       |
| Headings `[data-split]` | Lines slide up from a mask (power3.out, 0.9 s, stagger 0.08)                                                                                        |
| Blocks `[data-reveal]`  | Fade up 40 px (power2.out, 0.8 s)                                                                                                                   |
| Sliders                 | Cards stagger in; buttons scroll one card; image zooms on hover                                                                                     |
| Calculator              | Range input updates the monthly revenue live                                                                                                        |
| Two models              | Two glass cards, each with its own request button                                                                                                   |
| Marquee                 | Loops; speed and direction follow scroll velocity                                                                                                   |
| Links / buttons         | Underline grows from the left; every button (pill and round) gets the hero wipe: cream fill slides in from the left, text takes the old fill colour |

`prefers-reduced-motion` turns all motion off. Without JS the page is fully readable.

## Media

- Images: WebP, resized to 2× their display size (`cwebp`, q 75–82)
- Hero: orbit frames `orbit/00–71.webp` from `orbit-6s-scroll.mp4` (every 2nd frame, upscaled to 1920×1080 with lanczos + light unsharp, `cwebp` q 76 `-sharp_yuv`); Two models background: `models-bg.webp` (exported from Figma, `cwebp`)
