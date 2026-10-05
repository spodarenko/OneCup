# Stack

**WordPress + Elementor (free)** on top of **Hello Elementor**, with the `onecup` child theme.
Why: the client edits texts and images in DE / EN / UA without a developer.

| Part          | Where                               | Notes                                                                                               |
| ------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| Child theme   | `src/theme/onecup/`                 | Enqueues tokens and the Onest font; custom CSS and widgets go here                                  |
| Design tokens | `src/config/tokens.css`             | The only place for colors, spacing, radius and type. Copied into the theme as `config/` at build    |
| Page content  | Elementor (database)                | Not in the repo. Templates are exported to `src/elementor/` when they stabilise                     |
| Local WP      | `npm run dev`                       | WP Playground (Node/WASM, no Docker). Installs Hello Elementor + Elementor, mounts theme and config |
| Release       | `npm run build` → `dist/onecup.zip` | Upload via WP admin → Themes. CI uploads the same zip as an artifact                                |

## Planned, not built yet

- **Multilingual in WordPress** — plugin to choose (Polylang vs WPML); the demo already has DE/EN/UA
- **Contact form → info@onecupcoffee.de + Telegram** — small plugin in `src/plugins/onecup-leads/`; secrets from `.env.example` go to the host, never the repo
- **Redirects from the old site** onecupcoffee.de — keep SEO positions
- **Hosting** — managed WordPress
