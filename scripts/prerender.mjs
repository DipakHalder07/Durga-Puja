#!/usr/bin/env node
// Runs after the client build (dist/) and the server build (dist-ssr/).
// 1. Renders every URL with React on the server and writes dist/<path>/index.html with the real
//    page content, title, meta description, canonical, Open Graph tags, JSON-LD and preloads.
// 2. Writes 404.html, sitemap.xml, robots.txt, llms.txt, llms-full.txt and feed.xml.
// The domain comes from site.config.json.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { BLOG_POSTS, BLOG_AUTHOR } from '../src/data/blog.js';
import { blogStats, fillTokens, plainText, queryPandals, zoneTable } from '../src/lib/blogQueries.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_DIR = path.join(ROOT, 'dist-ssr');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const { render, headHtml, buildHead, SITE_URL, DATA_UPDATED } = await import(pathToFileURL(path.join(SSR_DIR, 'entry-server.js')).href);

const pandals = readJson('src/data/pandals.json');
const routes = readJson('src/data/routes.json');
const areas = readJson('src/data/areas.json');
const events = readJson('src/data/events.json');
const legal = readJson('src/data/legal.json');
const stats = blogStats(pandals);
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, '.vite', 'manifest.json'), 'utf8'));
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (u) => (/^https?:/.test(u) ? u : `${SITE_URL}${u}`);

// ── Preloads ──────────────────────────────────────────────────────────────────
const entryChunk = Object.values(manifest).find((c) => c.isEntry);
function chunkFiles(key, seen = new Set()) {
  const c = manifest[key];
  if (!c || seen.has(key)) return seen;
  seen.add(key);
  (c.imports || []).forEach((k) => chunkFiles(k, seen));
  return seen;
}
function pagePreloads(file) {
  if (!file || !manifest[file]) return [];
  const entryDeps = chunkFiles(Object.keys(manifest).find((k) => manifest[k] === entryChunk));
  return [...chunkFiles(file)]
    .filter((k) => !entryDeps.has(k))
    .map((k) => `<link rel="modulepreload" crossorigin href="/${manifest[k].file}" />`);
}
// Latin Inter (body) and Fraunces (headings) are needed for the first paint
const fonts = fs
  .readdirSync(path.join(DIST, 'assets'))
  .filter((f) => /^(inter-latin-wght-normal|fraunces-latin-opsz-normal)-.*\.woff2$/.test(f))
  .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${f}" />`);

// ── Pages ─────────────────────────────────────────────────────────────────────
const urls = [
  '/', '/siliguri-puja-pandals', '/siliguri-puja-map', '/siliguri-puja-routes', '/puja-schedule', '/mahalaya',
  '/areas', '/blog', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer', '/photo-credits', '/saved',
  ...pandals.map((p) => `/pandals/${p.slug}`),
  ...routes.map((r) => `/routes/${r.slug}`),
  ...areas.map((a) => `/areas/${a.slug}`),
  ...BLOG_POSTS.map((p) => `/blog/${p.slug}`),
];

const rendered = [];
async function writePage(url, outFile) {
  const { html, meta, file } = await render(url);
  if (!meta.title || !meta.description) console.warn(`⚠ ${url}: missing title or description`);
  const head = [headHtml(meta), ...fonts, ...pagePreloads(file)].join('\n    ');
  const page = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(buildHead(meta).title)}</title>`)
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, page);
  return { url, meta };
}

for (const url of urls) {
  rendered.push(await writePage(url, url === '/' ? path.join(DIST, 'index.html') : path.join(DIST, url, 'index.html')));
}
await writePage('/404', path.join(DIST, '404.html'));

// ── sitemap.xml ───────────────────────────────────────────────────────────────
const postBySlug = Object.fromEntries(BLOG_POSTS.map((p) => [`/blog/${p.slug}`, p]));
const lastmod = (url) =>
  postBySlug[url]?.dateModified ||
  legal[url.slice(1)]?.updated ||
  (url === '/blog' ? BLOG_POSTS.map((p) => p.dateModified).sort().at(-1) : DATA_UPDATED);
const indexable = rendered.filter((r) => !r.meta.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${indexable
  .map(({ url, meta }) => {
    const img = meta.image ? `\n    <image:image><image:loc>${esc(abs(meta.image))}</image:loc></image:image>` : '';
    return `  <url>\n    <loc>${SITE_URL}${url}</loc>\n    <lastmod>${lastmod(url)}</lastmod>${img}\n  </url>`;
  })
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);

// ── robots.txt ────────────────────────────────────────────────────────────────
const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'PerplexityBot',
  'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'CCBot', 'meta-externalagent', 'Amazonbot', 'DuckAssistBot',
];
fs.writeFileSync(
  path.join(DIST, 'robots.txt'),
  `# Pujo Pandal — Siliguri Durga Puja 2026 guide
# ${SITE_URL}

User-agent: *
Allow: /
Disallow: /saved

# Search engines and AI assistants are welcome to read and cite the guide
${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}
Allow: /
Disallow: /saved

Sitemap: ${SITE_URL}/sitemap.xml
`
);

// ── llms.txt / llms-full.txt (https://llmstxt.org) ───────────────────────────
const fmt = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const dateLines = events.map((e) => `- ${e.event_name}: ${fmt(e.date)} — ${e.description}`).join('\n');
const byScore = [...pandals].sort((a, b) => b.pujo_songi_score - a.pujo_songi_score || a.name.localeCompare(b.name));
const areaCounts = Object.values(
  pandals.reduce((acc, p) => ((acc[p.area_slug] ||= { name: p.area_name, slug: p.area_slug, n: 0 }).n++, acc), {})
).sort((a, b) => a.name.localeCompare(b.name));

const llms = `# Pujo Pandal — Siliguri Durga Puja 2026 guide

> Pujo Pandal (${SITE_URL}) is a free, independent guide to Durga Puja in Siliguri, West Bengal, India. It maps ${stats.total} community Durga Puja pandals across ${stats.areas} Siliguri neighbourhoods for 2026, with a smart pandal-hopping route planner, the festival schedule and local guides.

Key facts:
- Durga Puja 2026 in Siliguri runs from Maha Shashti (Saturday, 17 October 2026) to Bijoya Dashami (Wednesday, 21 October 2026). Mahalaya is on Saturday, 10 October 2026.
- ${stats.total} pandals: ${stats.theme} theme, ${stats.traditional} traditional, ${stats.heritage} heritage, ${stats.community} community and ${stats.eco} eco-friendly pujas; ${stats.parking} have parking nearby.
- Busiest evenings: Ashtami and Navami, especially around Hill Cart Road, Sevoke Road and Venus More from 7 PM to midnight.
- Contact: pujopandal@gmail.com · Collegepara, Siliguri, West Bengal 734005.

## Core pages
- [Siliguri Durga Puja 2026 guide](${SITE_URL}/): overview, countdown, featured pandals, zones and FAQs
- [All Siliguri pandals 2026](${SITE_URL}/siliguri-puja-pandals): full list with themes, scores, parking and areas
- [Siliguri Durga Puja pandal map](${SITE_URL}/siliguri-puja-map): interactive map of every pandal with GPS pins
- [Siliguri Puja routes](${SITE_URL}/siliguri-puja-routes): route planner and curated walking, bike and car circuits
- [Durga Puja 2026 schedule](${SITE_URL}/puja-schedule): dates and rituals from Mahalaya to Bijoya Dashami
- [Mahalaya 2026](${SITE_URL}/mahalaya): date, 4 AM broadcast and tarpan in Siliguri
- [Pandals by area](${SITE_URL}/areas): all ${stats.areas} neighbourhoods

## Guides
${BLOG_POSTS.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${plainText(fillTokens(p.excerpt, stats))}`).join('\n')}

## Neighbourhoods
${areaCounts.map((a) => `- [${a.name}](${SITE_URL}/areas/${a.slug}): ${a.n} pandal${a.n === 1 ? '' : 's'}`).join('\n')}

## Curated routes
${routes.map((r) => `- [${r.title}](${SITE_URL}/routes/${r.slug}): ${r.travel_mode}, ${r.stopping_points.length} pandals`).join('\n')}

## Optional
- [Full text of the guide for language models](${SITE_URL}/llms-full.txt)
- [Sitemap](${SITE_URL}/sitemap.xml)
- [About Pujo Pandal](${SITE_URL}/about)
`;
fs.writeFileSync(path.join(DIST, 'llms.txt'), llms);

// Blog body blocks → Markdown
const md = (t) => plainText(fillTokens(t, stats)).replace(/\s+/g, ' ').trim();
const mdLinks = (t) => fillTokens(t, stats).replace(/\]\(\//g, `](${SITE_URL}/`);
function blocksToMd(blocks) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'p': return mdLinks(b.text);
        case 'h2': return `## ${md(b.text)}`;
        case 'h3': return `### ${md(b.text)}`;
        case 'ul': return b.items.map((i) => `- ${mdLinks(i)}`).join('\n');
        case 'ol': return b.items.map((i, n) => `${n + 1}. ${mdLinks(i)}`).join('\n');
        case 'tip': return `> **${b.title}** ${mdLinks(b.text)}`;
        case 'facts': return b.items.map(([k, v]) => `- ${k}: ${fillTokens(v, stats)}`).join('\n');
        case 'pandals':
          return queryPandals(pandals, b.query)
            .map((p, n) => `${n + 1}. [${p.name}](${SITE_URL}/pandals/${p.slug}) — ${p.area_name}, ${p.category}, score ${p.pujo_songi_score}${p.theme ? `; theme “${p.theme}”` : ''}${p.distanceKm != null ? `; ${p.distanceKm.toFixed(1)} km away` : ''}`)
            .join('\n');
        case 'zones':
          return `| Zone | Pandals | With parking |\n|---|---|---|\n${zoneTable(pandals).map((z) => `| ${z.name} | ${z.count} | ${z.parking} |`).join('\n')}`;
        case 'schedule': return dateLines;
        case 'table': return `| ${b.head.join(' | ')} |\n|${b.head.map(() => '---').join('|')}|\n${b.rows.map((r) => `| ${r.join(' | ')} |`).join('\n')}`;
        case 'cta': return `[${b.label}](${SITE_URL}${b.to})`;
        default: return '';
      }
    })
    .filter(Boolean)
    .join('\n\n');
}

const pandalMd = byScore
  .map(
    (p) => `### ${p.name}
- Page: ${SITE_URL}/pandals/${p.slug}
- Area: ${p.area_name} (${p.zone}), Siliguri
- Venue 2026: ${p.venue_name_2026 || p.address_2026}
- Style: ${p.category} · Theme 2026: ${p.theme}
- Pandal score: ${p.pujo_songi_score}/10 · Visit time: ~${p.estimated_visit_minutes} min
- Parking: ${p.parking_available ? 'available' : 'walk-in only'} — ${p.parking_notes}
- Access: ${p.access_notes}
- GPS: ${p.latitude}, ${p.longitude}
- ${p.description}`
  )
  .join('\n\n');

const llmsFull = `${llms}
---

# Durga Puja 2026 dates (Siliguri, West Bengal)
${dateLines}

# All ${stats.total} Siliguri Durga Puja pandals (2026), highest score first
${pandalMd}

# Curated routes
${routes
  .map((r) => `## ${r.title}\n${SITE_URL}/routes/${r.slug}\n${r.travel_mode} · ${r.description}\nStops: ${r.stopping_points.map((s) => pandals.find((p) => p.slug === s)?.name).filter(Boolean).join(' → ')}\nTips:\n${(r.tips || []).map((t) => `- ${t}`).join('\n')}`)
  .join('\n\n')}

# Guides
${BLOG_POSTS.map(
  (p) => `## ${p.title}
${SITE_URL}/blog/${p.slug} · Updated ${p.dateModified} · ${BLOG_AUTHOR}

${md(p.excerpt)}

${blocksToMd(p.body)}

### FAQs
${p.faqs.map((f) => `**${md(f.q)}**\n${md(f.a)}`).join('\n\n')}`
).join('\n\n---\n\n')}
`;
fs.writeFileSync(path.join(DIST, 'llms-full.txt'), llmsFull);

// ── feed.xml (RSS 2.0) ────────────────────────────────────────────────────────
const rfc822 = (iso) => new Date(`${iso}T08:00:00+05:30`).toUTCString();
const posts = [...BLOG_POSTS].sort((a, b) => b.dateModified.localeCompare(a.dateModified));
fs.writeFileSync(
  path.join(DIST, 'feed.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pujo Pandal — Siliguri Durga Puja 2026 guides</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Local guides to Siliguri Durga Puja 2026: the pandal map, zones, walking routes, parking, dates and the best pujas.</description>
    <language>en-in</language>
    <lastBuildDate>${rfc822(posts[0].dateModified)}</lastBuildDate>
${posts
  .map(
    (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${rfc822(p.datePublished)}</pubDate>
      <category>${esc(p.category)}</category>
      <description>${esc(md(p.excerpt))}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`
);

// The manifest and server bundle were only needed for this step
fs.rmSync(path.join(DIST, '.vite'), { recursive: true, force: true });
fs.rmSync(SSR_DIR, { recursive: true, force: true });

console.log(`✓ prerendered ${rendered.length} pages + 404.html, sitemap.xml (${indexable.length} URLs), robots.txt, llms.txt, llms-full.txt, feed.xml for ${SITE_URL}`);
