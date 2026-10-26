# Design → code

Figma: «One cup coffee», `fileKey` in `figma.config.json`. Main page: node `238:133` (v4, dark), 1440 px, UA.
The design project (research, brief, agents) is `../OneCup/`. It stays outside this repo.

## Rules

- Values only from `src/config/tokens.css`. A hex or pixel value not in tokens → add the token first
- Font: Onest 400 / 500 / 600
- Icons: Phosphor only, **Regular** weight. Use real icons, not text arrows (→, +)
- Slogan «OneCup – Wake Up.» stays in English in every language; the H1 says what the brand does

## Home page sections (top → bottom)

| #   | Section                       | Figma node |
| --- | ----------------------------- | ---------- |
| —   | Header                        | 238:536    |
| 1   | Hero                          | 238:134    |
| 2   | About OneCup                  | 245:651    |
| 3   | Revenue calculator            | 246:741    |
| 4   | How it works (4 steps)        | 238:271    |
| 5   | Two models (glass cards)      | 317:365    |
| 6   | Where it's installed (slider) | 238:347    |
| 7   | FAQ                           | 238:387    |
| 8   | Already running               | 238:411    |
| 9   | Contact                       | 238:451    |
| 10  | Marquee                       | 238:474    |
| —   | Footer                        | 238:477    |

## Buy page `kaufen/` (top → bottom)

Figma node `333:2861` «Station kaufen». One per language: `/kaufen/`, `/en/kaufen/`, `/uk/kaufen/`. Content: `buy` in `src/content/<lang>.json` (own header menu `nav` + `navCta`); UA copy from Figma, EN/DE translated.

Hero → Who it's for (quote) → Metrics → Your benefits (steps) → What's included (split) → Models (list with price and CTA) → Contact → Marquee → Footer.

## Shared blocks

Every page is built from the same functions in `src/demo/render.mjs`, so a change to a block shows on all pages:

| Block                   | Function                            | Used on                                                          |
| ----------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| Hero                    | `hero(c, page)`                     | home (scroll orbit), buy, host (still render)                    |
| Quote                   | `quote()` via `about()` / `who()`   | home, buy, host                                                  |
| Metrics                 | `metrics()`                         | buy, host                                                        |
| Numbered rows           | `steps(s, id)`                      | home «How it works», buy «Your benefits», host «For your guests» |
| Split 280 + 824         | `split()` via `contact()` / `kit()` | all pages (contact), buy (kit)                                   |
| Two models cards        | `models()` / `hostCoop()`           | home, host                                                       |
| Marquee, footer, header | `marquee()`, `footer()`, `header()` | all pages                                                        |

Buttons: one size everywhere, 16/24 SemiBold, 12×24 padding, 24 radius (50px); the header WhatsApp/secondary buttons are 14/20 (38px).

## Host page `standort/` (top → bottom)

Figma node `266:5465` «Standort anbieten». One per language: `/standort/`, `/en/standort/`, `/uk/standort/`. Content: `host` in `src/content/<lang>.json`; UA copy from Figma, EN/DE translated. Same section functions as the buy page; hidden Figma frames («Для кого» cards) are not built.

Hero (station render) → About quote → Metrics (230 V · 24/7 · ~1 m²) → For your guests (steps 01–04, home layout) → Cooperation models (Figma 333:3783: home models layout, terms instead of buttons) → Contact → Marquee → Footer.

All sections are dark. Calculator: monthly revenue = drinks per day × `calcPrice` × `calcDays` (`src/config/site.json`).

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
