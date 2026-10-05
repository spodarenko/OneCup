# OneCup

Corporate site for OneCup — self-service coffee stations, Cologne. WordPress + Elementor, DE / EN / UA.

## Run locally

Needs Node 20+. No Docker or PHP required.

```bash
npm install
npm run dev     # WP Playground with Hello Elementor + Elementor and the onecup theme mounted
```

## Scripts

| Command          | What it does                                   |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Local WordPress (WP Playground)                |
| `npm run check`  | Prettier check. CI also runs `php -l`          |
| `npm run format` | Prettier write                                 |
| `npm run build`  | `dist/onecup.zip` — the theme, ready to upload |

## Where things are

- `src/theme/onecup/` — child theme of Hello Elementor
- `src/config/tokens.css` — design tokens (colors, spacing, radius, type)
- `docs/` — stack and design rules. This is the source of truth
- `blueprint.json` — WP Playground setup

## What lives outside the repo

- Page content (Elementor, in the WordPress database)
- Figma design and research — `../OneCup/` design project
- Secrets — `.env.local` locally, the host's settings in production. See `.env.example`
