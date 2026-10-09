import { useEffect } from 'react';

export const SITE_NAME = 'Pujo Pandal';
const DEFAULT_IMAGE = '/images/og/og-image.jpg';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// Per-page title, description, canonical, Open Graph / Twitter tags and JSON-LD structured data
export function useSeo({ title, description, path, image, type = 'website', jsonLd }) {
  useEffect(() => {
    const origin = window.location.origin;
    const url = origin + (path ?? window.location.pathname);
    const img = (image || DEFAULT_IMAGE).startsWith('http') ? image : origin + (image || DEFAULT_IMAGE);
    const fullTitle = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : SITE_NAME;

    document.title = fullTitle;
    setMeta('name', 'description', description);
    setCanonical(url);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);

    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    const blocks = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    blocks.forEach((data) => {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.dataset.seoJsonld = '';
      s.textContent = JSON.stringify(data);
      document.head.appendChild(s);
    });
  }, [title, description, path, image, type, jsonLd]);
}
