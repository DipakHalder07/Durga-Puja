// JSON-LD builders for blog pages — shared by the React pages and scripts/prerender.mjs
import { fillTokens, plainText } from './blogQueries.js';

export const BLOG_PUBLISHER = {
  '@type': 'Organization',
  name: 'Pujo Pandal',
  logo: { '@type': 'ImageObject', url: '/logo-icon.png' },
};

export function postImage(post, photosBySlug) {
  if (post.cover?.photo) return photosBySlug[post.cover.photo]?.src;
  return post.cover?.src;
}

export function postJsonLd(post, { origin, stats, photosBySlug, author }) {
  const url = `${origin}/blog/${post.slug}`;
  const image = postImage(post, photosBySlug);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: fillTokens(post.metaDescription, stats),
      image: image ? [origin + image] : undefined,
      datePublished: post.datePublished,
      dateModified: post.dateModified,
      author: { '@type': 'Organization', name: author },
      publisher: { ...BLOG_PUBLISHER, logo: { ...BLOG_PUBLISHER.logo, url: origin + BLOG_PUBLISHER.logo.url } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      keywords: 'Durga Puja pandal map 2026, Siliguri Durga Puja 2026, Siliguri pandal map',
      inLanguage: 'en-IN',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${origin}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
    post.faqs?.length && {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((f) => ({
        '@type': 'Question',
        name: fillTokens(f.q, stats),
        acceptedAnswer: { '@type': 'Answer', text: plainText(fillTokens(f.a, stats)) },
      })),
    },
  ].filter(Boolean);
}
