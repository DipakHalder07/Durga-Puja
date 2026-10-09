import { createContext, useContext, useEffect } from 'react';
import { SITE_NAME, DEFAULT_OG_IMAGE, absUrl } from './site.js';

export { SITE_NAME };

// During server rendering, pages write their meta into this object (see src/entry-server.jsx)
export const SeoContext = createContext(null);

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

// The brand suffix is dropped when the page title is already long, so the useful part isn't cut off in results
export const fullTitle = (title) =>
  !title ? SITE_NAME : title.includes(SITE_NAME) || title.length > 52 ? title : `${title} | ${SITE_NAME}`;

// One description of a page → every head tag it needs. Shared by the browser and the prerenderer.
export function buildHead(meta = {}) {
  const { title, description, path = '/', image, imageAlt, type = 'website', noindex = false, article, jsonLd } = meta;
  const url = absUrl(path);
  const img = absUrl(image || DEFAULT_OG_IMAGE);
  const t = fullTitle(title);
  const tags = [
    ['meta', { name: 'description', content: description }],
    ['meta', { name: 'robots', content: noindex ? 'noindex, follow' : ROBOTS_INDEX }],
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:type', content: type }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'en_IN' }],
    ['meta', { property: 'og:title', content: t }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: img }],
    ['meta', { property: 'og:image:alt', content: imageAlt || t }],
    ...(!image || image === DEFAULT_OG_IMAGE
      ? [['meta', { property: 'og:image:width', content: '1200' }], ['meta', { property: 'og:image:height', content: '630' }]]
      : []),
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: t }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: img }],
    ['meta', { name: 'twitter:image:alt', content: imageAlt || t }],
    ...(article
      ? [
          ['meta', { property: 'article:published_time', content: article.publishedTime }],
          ['meta', { property: 'article:modified_time', content: article.modifiedTime }],
          ['meta', { property: 'article:section', content: article.section }],
        ]
      : []),
  ].filter(([, attrs]) => Object.values(attrs).every((v) => v != null && v !== ''));
  const blocks = (Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : []).filter(Boolean);
  return { title: t, tags, jsonLd: blocks };
}

const escAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Head tags as HTML for the prerendered pages
export function headHtml(meta) {
  const { tags, jsonLd } = buildHead(meta);
  return [
    ...tags.map(([tag, attrs]) => `<${tag} data-seo ${Object.entries(attrs).map(([k, v]) => `${k}="${escAttr(v)}"`).join(' ')} />`),
    ...jsonLd.map((d) => `<script type="application/ld+json" data-seo>${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`),
  ].join('\n    ');
}

// Per-page title, description, canonical, Open Graph / Twitter tags and JSON-LD.
// meta: { title, description, path, image, imageAlt, type, noindex, article, jsonLd }
export function useSeo(meta) {
  const ssr = useContext(SeoContext);
  if (ssr) ssr.meta = meta;
  const key = JSON.stringify(meta);

  useEffect(() => {
    const { title, tags, jsonLd } = buildHead(meta);
    document.title = title;
    document.head.querySelectorAll('[data-seo]').forEach((el) => el.remove());
    const frag = document.createDocumentFragment();
    tags.forEach(([tag, attrs]) => {
      const el = document.createElement(tag);
      el.setAttribute('data-seo', '');
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      frag.appendChild(el);
    });
    jsonLd.forEach((d) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo', '');
      s.textContent = JSON.stringify(d);
      frag.appendChild(s);
    });
    document.head.appendChild(frag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}
