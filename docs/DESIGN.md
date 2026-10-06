# Design → code

Figma: «One cup coffee», `fileKey` in `figma.config.json`. Main page: node `174:10151`, 1440 px, UA.
The design project (research, brief, agents) is `../OneCup/`. It stays outside this repo.

## Rules

- Values only from `src/config/tokens.css`. A hex or pixel value not in tokens → add the token first
- Font: Onest 400 / 500 / 600
- Icons: Phosphor only, **Regular** weight. Use real icons, not text arrows (→, +)
- Slogan «OneCup – Wake Up.» stays in English in every language; the H1 says what the brand does

## Home page sections (top → bottom)

| #   | Section                       | Figma node |
| --- | ----------------------------- | ---------- |
| —   | Header                        | 187:559    |
| 1   | Hero                          | 174:10152  |
| 2   | About OneCup                  | 174:10169  |
| 3   | Metrics                       | 174:10256  |
| 4   | Materials                     | 174:11012  |
| 5   | Coffee in 3 steps             | 174:10319  |
| 6   | Two models (buy / host)       | 191:699    |
| 7   | Where it's installed (slider) | 174:10409  |
| 8   | FAQ                           | 174:10450  |
| 9   | Already running               | 174:10474  |
| 10  | Contact                       | 174:10515  |
| 11  | Marquee                       | 191:661    |
| —   | Footer                        | 174:10541  |

## Motion

Reference: https://www.coffee-tech.com (Webflow + GSAP, ScrollTrigger, SplitText, smooth scroll). Implemented in `src/theme/onecup/assets/js/main.js`:

| Where                   | Effect                                                                         |
| ----------------------- | ------------------------------------------------------------------------------ |
| Page                    | Lenis smooth scroll; anchor links scroll smoothly                              |
| Hero                    | Section pins for 120% of the viewport; the `orbit` video is scrubbed by scroll |
| Headings `[data-split]` | Lines slide up from a mask (power3.out, 0.9 s, stagger 0.08)                   |
| Blocks `[data-reveal]`  | Fade up 40 px (power2.out, 0.8 s)                                              |
| Sliders                 | Cards stagger in; buttons scroll one card; image zooms on hover                |
| Metrics                 | Numbers count up                                                               |
| Materials               | Row hover/click opens it; image follows the row and cross-fades                |
| Two models              | Station drifts with scroll; cards lift on hover                                |
| Marquee                 | Loops; speed and direction follow scroll velocity                              |
| Links / buttons         | Underline grows from the left; buttons change fill                             |

`prefers-reduced-motion` turns all motion off. Without JS the page is fully readable.

## Media

- Images: WebP, resized to 2× their display size (`cwebp`, q 75–82)
- Hero video: `orbit-6s-scroll.mp4` → `orbit.webm` (VP9) + `orbit.mp4` (H.264), keyframe every 4 frames so scroll scrubbing is smooth; poster `orbit-poster.webp`
