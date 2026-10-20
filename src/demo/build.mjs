// Builds the static demo into dist/demo: home + buy page per language + robots, sitemap, llms.txt.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { render } from "./render.mjs";

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
    "contact",
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

for (const c of langs) {
  const dir = new URL(c.path, out);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL("index.html", dir), render(c, langs, site, ["assets/css/demo.css"]));
  const buy = new URL(`${c.path}kaufen/`, out);
  mkdirSync(buy, { recursive: true });
  writeFileSync(new URL("index.html", buy), render(c, langs, site, ["assets/css/demo.css"], "buy"));
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
${["", "kaufen/"]
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

console.log(`Built ${langs.length * 2} pages → dist/demo`);
