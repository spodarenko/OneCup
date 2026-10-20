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
| 5   | Two models (quiz choice)      | 259:2181   |
| 6   | Where it's installed (slider) | 238:347    |
| 7   | FAQ                           | 238:387    |
| 8   | Already running               | 238:411    |
| 9   | Contact                       | 238:451    |
| 10  | Marquee                       | 238:474    |
| —   | Footer                        | 238:477    |

All sections are dark. Calculator: monthly revenue = drinks per day × `calcPrice` × `calcDays` (`src/config/site.json`).

## Motion

Reference: https://www.coffee-tech.com (Webflow + GSAP, ScrollTrigger, SplitText, smooth scroll). Implemented in `src/theme/onecup/assets/js/main.js`:

| Where                   | Effect                                                          |
| ----------------------- | --------------------------------------------------------------- |
| Page                    | Lenis smooth scroll; anchor links scroll smoothly               |
| Hero                    | Static station render; no pin, nothing tied to scroll           |
| Headings `[data-split]` | Lines slide up from a mask (power3.out, 0.9 s, stagger 0.08)    |
| Blocks `[data-reveal]`  | Fade up 40 px (power2.out, 0.8 s)                               |
| Sliders                 | Cards stagger in; buttons scroll one card; image zooms on hover |
| Calculator              | Range input updates the monthly revenue live                    |
| Two models              | Radio cards; the CTA label follows the chosen model             |
| Marquee                 | Loops; speed and direction follow scroll velocity               |
| Links / buttons         | Underline grows from the left; buttons change fill              |

`prefers-reduced-motion` turns all motion off. Without JS the page is fully readable.

## Media

- Images: WebP, resized to 2× their display size (`cwebp`, q 75–82)
- Hero: `hero-station.webp`; Two models background: `models-bg.webp` (exported from Figma, `cwebp`)
