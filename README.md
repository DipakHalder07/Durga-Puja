# Pujo Pandal — Siliguri Durga Puja 2026 guide

Live site: https://durgapujapandal.site

React + Vite site with an interactive pandal map, smart pandal-hopping routes, the Puja schedule and local guides for Durga Puja in Siliguri.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build

```bash
npm run build
```

1. `vite build` — client bundle in `dist/` (each page is its own chunk; Leaflet maps load only where a map is shown).
2. `vite build --ssr src/entry-server.jsx` — server bundle in `dist-ssr/`.
3. `node scripts/prerender.mjs` — renders every page to static HTML with its title, description, canonical, Open Graph tags and JSON-LD, then writes `404.html`, `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt` and `feed.xml`.

The browser hydrates the prerendered HTML, so search engines and link previews see full content.

## Deploy (Vercel)

Import the GitHub repo in Vercel — `vercel.json` sets the build command, output directory, clean URLs, redirects for old URLs and cache headers. `dist/` and `node_modules/` are not committed.

In Vercel → Settings → Domains, add `durgapujapandal.site` and redirect `www.durgapujapandal.site` to it. Then submit `https://durgapujapandal.site/sitemap.xml` in Google Search Console.

## Content

| What | Where |
| --- | --- |
| Domain | `site.config.json` |
| Pandals, areas, routes, festival dates | `src/data/*.json` |
| Blog posts | `src/data/blog.js` |
| Page titles, descriptions, structured data | `useSeo()` in each page under `src/pages/` |
| Sitemap `lastmod` for data pages | `DATA_UPDATED` in `src/lib/site.js` |
