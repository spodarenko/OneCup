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
| —   | Header                        | 174:10643  |
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

## Interactions

- **Materials** — accordion with 3 items (Beans / Cups / Technology). One item open at a time; the open item shows its description. States in Figma section `191:731`

## Motion

Main reference for animation: https://www.coffee-tech.com — not analysed yet. Motion spec goes here before implementation.
