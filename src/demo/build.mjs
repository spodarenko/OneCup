// Builds the static demo into dist/demo: home, buy and host page per language + robots, sitemap, llms.txt.
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { pages, render } from "./render.mjs";

const root = new URL("../../", import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), "utf8"));
const out = new URL("dist/demo/", root);
const site = read("src/config/site.json");
const langs = site.languages.map((l) => read(`src/content/${l}.json`));

const css = [
  "config/tokens.css",
  "assets/css/base.css",
  ...[
    "header",
    "hero",
    "about",
    "calc",
    "steps",
    "models",
    "slider",
    "faq",
    "split",
    "marquee",
    "buy",
    "footer",
  ].map((s) => `assets/css/sections/${s}.css`),
];

rmSync(out, { recursive: true, force: true });
const bundle = css
  .map((p) =>
    readFileSync(
      new URL(p.startsWith("config/") ? `src/${p}` : `src/theme/onecup/${p}`, root),
      "utf8",
    ),
  )
  .join("\n");
mkdirSync(out, { recursive: true });
cpSync(new URL("src/theme/onecup/assets/", root), new URL("assets/", out), { recursive: true });
cpSync(new URL("src/config/", root), new URL("config/", out), { recursive: true });
cpSync(new URL("src/demo/favicon.svg", root), new URL("favicon.svg", out));
writeFileSync(new URL("assets/css/demo.css", out), bundle);
// Version query busts browser caches of CSS and JS after each deploy
const v = createHash("sha1")
  .update(bundle)
  .update(readFileSync(new URL("src/theme/onecup/assets/js/main.js", root)))
  .digest("hex")
  .slice(0, 8);

for (const c of langs) {
  for (const [page, sub] of Object.entries(pages)) {
    const dir = new URL(c.path + sub, out);
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      new URL("index.html", dir),
      render(c, langs, site, [`assets/css/demo.css?v=${v}`], page).replace(
        "assets/js/main.js",
        `assets/js/main.js?v=${v}`,
      ),
    );
  }
}

writeFileSync(
  new URL("robots.txt", out),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}sitemap.xml\n`,
);

const alt = (sub) =>
  langs
    .map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${l.lang}" href="${site.url}${l.path}${sub}"/>`,
    )
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${site.url}${sub}"/>`)
    .join("\n");
writeFileSync(
  new URL("sitemap.xml", out),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.values(pages)
  .flatMap((sub) =>
    langs.map((l) => `  <url>\n    <loc>${site.url}${l.path}${sub}</loc>\n${alt(sub)}\n  </url>`),
  )
  .join("\n")}
</urlset>
`,
);

// llms.txt — plain summary for AI search engines (GEO)
const de = langs.find((l) => l.lang === site.defaultLanguage);
writeFileSync(
  new URL("llms.txt", out),
  `# ${site.name}

> ${de.meta.description}

${site.slogan} OneCup builds self-service coffee stations in ${site.city}, Germany, and delivers across Germany.

## Two models
- Buy: ${langs[1].models.buy.text}
- Host: ${langs[1].models.host.text}

## Where stations fit
${langs[1].where.items.map((i) => `- ${i.name}: ${i.text}`).join("\n")}

## FAQ
${langs[1].faq.items.map((i) => `- ${i.q} ${i.a}`).join("\n")}

## Pages
${langs.map((l) => `- [${l.meta.title}](${site.url}${l.path}) (${l.lang})`).join("\n")}

## Contact
- E-mail: ${site.email}
- Phone: ${site.phone}
- Location: ${site.city}, Deutschland
`,
);

console.log(`Built ${langs.length * Object.keys(pages).length} pages → dist/demo`);
