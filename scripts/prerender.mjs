#!/usr/bin/env node
// Runs after `vite build`. For every important URL it writes dist/<path>/index.html with the
// right <title>, meta description, canonical, Open Graph tags and JSON-LD — and, for blog posts,
// the article text inside #root — so search engines and link previews see real content.
// Also writes sitemap.xml and robots.txt. Set your domain in site.config.json (or SITE_URL env).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BLOG_POSTS, BLOG_AUTHOR } from '../src/data/blog.js';
import { queryPandals, blogStats, fillTokens, zoneTable } from '../src/lib/blogQueries.js';
import { postJsonLd, postImage } from '../src/lib/blogSchema.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));

const config = fs.existsSync(path.join(ROOT, 'site.config.json')) ? read('site.config.json') : {};
const SITE_URL = (process.env.SITE_URL || config.siteUrl || '').replace(/\/$/, '');
const SITE_NAME = 'Pujo Pandal';

const pandals = read('src/data/pandals.json');
const routes = read('src/data/routes.json');
const areas = read('src/data/areas.json');
const events = read('src/data/events.json');
const photos = read('src/data/photos.json');
const photosBySlug = Object.fromEntries(photos.map((p) => [p.slug, p]));
const stats = blogStats(pandals);
const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const today = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (t) =>
  esc(fillTokens(t, stats))
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

function blocksToHtml(blocks) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'p': return `<p>${inline(b.text)}</p>`;
        case 'h2': return `<h2 id="${b.id || ''}">${inline(b.text)}</h2>`;
        case 'h3': return `<h3>${esc(b.text)}</h3>`;
        case 'ul': return `<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
        case 'ol': return `<ol>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`;
        case 'tip': return `<aside><strong>${esc(b.title)}</strong> ${inline(b.text)}</aside>`;
        case 'facts': return `<dl>${b.items.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(fillTokens(v, stats))}</dd>`).join('')}</dl>`;
        case 'cta': return `<p><a href="${b.to}">${esc(b.label)}</a></p>`;
        case 'pandals':
          return `<ol>${queryPandals(pandals, b.query)
            .map((p) => `<li><a href="/pandals/${p.slug}">${esc(p.name)}</a> — ${esc(p.area_name)}, ${esc(p.category)}, score ${p.pujo_songi_score}${p.theme ? `. Theme: ${esc(p.theme)}` : ''}</li>`)
            .join('')}</ol>`;
        case 'zones':
          return `<table><tr><th>Zone</th><th>Pandals</th><th>With parking</th></tr>${zoneTable(pandals)
            .map((z) => `<tr><td>${esc(z.name)}</td><td>${z.count}</td><td>${z.parking}</td></tr>`)
            .join('')}</table>`;
        case 'schedule':
          return `<ul>${events.map((e) => `<li>${esc(e.event_name)}: ${e.date}</li>`).join('')}</ul>`;
        case 'table':
          return `<table><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>${b.rows
            .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
            .join('')}</table>`;
        default: return '';
      }
    })
    .join('\n');
}

function page({ url, title, description, image, type = 'website', jsonLd = [], body = '' }) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const abs = (u) => (SITE_URL ? SITE_URL + u : u);
  const img = abs(image || '/images/og/og-image.jpg');
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(fullTitle)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${esc(img)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${type}" />`);
  const extra = [
    SITE_URL && `<link rel="canonical" href="${esc(SITE_URL + url)}" />`,
    SITE_URL && `<meta property="og:url" content="${esc(SITE_URL + url)}" />`,
    `<meta name="twitter:title" content="${esc(fullTitle)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    ...jsonLd.map((d) => `<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`),
  ].filter(Boolean);
  html = html.replace('</head>', `    ${extra.join('\n    ')}\n  </head>`);
  if (body) html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const out = url === '/' ? path.join(DIST, 'index.html') : path.join(DIST, url, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  return url;
}

const pages = [];
const origin = SITE_URL || '';

// Core pages
const CORE = [
  ['/', 'Siliguri Durga Puja 2026 – Pandal Map & Smart Routes', `Durga Puja pandal map 2026 for Siliguri: ${stats.total} verified pandals, smart walking, bike and car routes, Puja dates and local guides.`],
  ['/siliguri-puja-map', 'Durga Puja Pandal Map 2026 – Siliguri Live Map', 'Live Durga Puja pandal map 2026 for Siliguri: every verified pandal with GPS pins, search, area filters, parking info and one-tap Google Maps directions.'],
  ['/siliguri-puja-routes', 'Siliguri Puja Routes 2026 – Smart Pandal Route Planner', 'Plan Durga Puja 2026 pandal hopping in Siliguri: pick a start point, walking, bike or car and your time — get an ordered route on the pandal map.'],
  ['/siliguri-puja-pandals', 'Siliguri Puja Pandals 2026 – All Pandals List', `All ${stats.total} Siliguri Durga Puja pandals for 2026 with themes, scores, parking and areas. Filter and save pandals to your Puja plan.`],
  ['/puja-schedule', 'Durga Puja 2026 Schedule – Siliguri Dates & Timings', 'Durga Puja 2026 dates and ritual timings for Siliguri: Mahalaya 10 Oct, Shashti 17 Oct to Vijaya Dashami 21 Oct, pushpanjali, Sandhi Puja and visarjan.'],
  ['/mahalaya', 'Mahalaya 2026 in Siliguri – Date, Chandi Path & Tarpan', 'Mahalaya 2026 falls on 10 October. The 4 AM Mahishasuramardini broadcast, tarpan on the Mahananda ghats and how Siliguri welcomes Pujo.'],
  ['/areas', 'Siliguri Puja Areas 2026 – Pandals by Neighbourhood', `Explore Siliguri Durga Puja 2026 pandals across ${stats.areas} neighbourhoods and paras, with maps and lists for each area.`],
  ['/about', 'About Pujo Pandal – Siliguri Durga Puja Guide', 'Pujo Pandal is a free, locally built guide to Siliguri’s Durga Puja: the pandal map, smart routes, schedule and blog.'],
  ['/contact', 'Contact Pujo Pandal – Siliguri Puja Desk', 'Contact the Pujo Pandal team with pandal updates, corrections or feedback about Siliguri Durga Puja 2026.'],
  ['/photo-credits', 'Photo Credits – Pujo Pandal', 'Credits for the openly licensed Durga Puja photographs used on Pujo Pandal.'],
];
CORE.forEach(([url, title, description]) => pages.push(page({ url, title, description })));

// Blog index
pages.push(page({
  url: '/blog',
  title: 'Durga Puja Pandal Map 2026 Blog – Siliguri Guides',
  description: `Guides to the Durga Puja pandal map 2026 for Siliguri: ${stats.total} pandals by zone, walking clusters, parking, theme and traditional pujas, dates and travel tips.`,
  body: `<h1>The Pujo Pandal blog</h1><ul>${BLOG_POSTS.map((p) => `<li><a href="/blog/${p.slug}">${esc(p.title)}</a> — ${esc(fillTokens(p.excerpt, stats))}</li>`).join('')}</ul>`,
}));

// Blog posts
for (const post of BLOG_POSTS) {
  const body = `<article><h1>${esc(post.title)}</h1><p>${inline(post.excerpt)}</p>${blocksToHtml(post.body)}<h2>Frequently asked questions</h2>${post.faqs
    .map((f) => `<h3>${esc(fillTokens(f.q, stats))}</h3><p>${inline(f.a)}</p>`)
    .join('')}</article>`;
  pages.push(page({
    url: `/blog/${post.slug}`,
    title: post.metaTitle,
    description: fillTokens(post.metaDescription, stats),
    image: postImage(post, photosBySlug),
    type: 'article',
    jsonLd: postJsonLd(post, { origin, stats, photosBySlug, author: BLOG_AUTHOR }),
    body,
  }));
}

// Pandal pages
for (const p of pandals) {
  pages.push(page({
    url: `/pandals/${p.slug}`,
    title: `${p.name} Durga Puja 2026 – ${p.area_name}, Siliguri`,
    description: `${p.name} (${p.area_name}) on the Siliguri Durga Puja pandal map 2026: theme “${p.theme}”, visit time, parking and directions.`.slice(0, 160),
    image: p.image_url || undefined,
    body: `<h1>${esc(p.name)}</h1><p>${esc(p.area_name)}, Siliguri · ${esc(p.category)}</p><p>${esc(p.description)}</p>`,
  }));
}

// Curated routes
for (const r of routes) {
  pages.push(page({ url: `/routes/${r.slug}`, title: `${r.title} – Siliguri Puja Route 2026`, description: r.description.slice(0, 160), image: `/images/routes/${r.slug}.jpg` }));
}

// Areas
for (const a of areas) {
  pages.push(page({ url: `/areas/${a.slug}`, title: `${a.name} Durga Puja Pandals 2026 – Siliguri`, description: `Durga Puja 2026 pandals in ${a.name}, Siliguri — list, map and directions.` }));
}

// robots.txt + sitemap.xml
let robots = 'User-agent: *\nAllow: /\n';
if (SITE_URL) {
  const lastmod = (u) => BLOG_POSTS.find((p) => u === `/blog/${p.slug}`)?.dateModified || today;
  const prio = (u) => (u === '/' ? '1.0' : u.startsWith('/blog/durga-puja-pandal-map-2026') || u === '/siliguri-puja-map' ? '0.9' : u.startsWith('/blog') ? '0.8' : '0.6');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((u) => `  <url><loc>${SITE_URL}${u === '/' ? '/' : u}</loc><lastmod>${lastmod(u)}</lastmod><priority>${prio(u)}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  robots += `\nSitemap: ${SITE_URL}/sitemap.xml\n`;
} else {
  console.warn('⚠ prerender: no siteUrl in site.config.json — skipped canonical URLs and sitemap.xml');
}
fs.writeFileSync(path.join(DIST, 'robots.txt'), robots);

console.log(`✓ prerendered ${pages.length} pages${SITE_URL ? ` + sitemap.xml for ${SITE_URL}` : ''}`);
