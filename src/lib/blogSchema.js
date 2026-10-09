// JSON-LD builders for blog pages
import { fillTokens, plainText } from './blogQueries.js';
import { SITE_URL, SITE_NAME, LOGO, absUrl } from './site.js';
import { breadcrumbs, faqPage } from './schema.js';

export function postImage(post, photosBySlug) {
  if (post.cover?.photo) return photosBySlug[post.cover.photo]?.src;
  return post.cover?.src;
}

export function postJsonLd(post, { stats, photosBySlug, author }) {
  const url = absUrl(`/blog/${post.slug}`);
  const image = postImage(post, photosBySlug);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: fillTokens(post.metaDescription, stats),
      image: image ? [absUrl(image)] : undefined,
      datePublished: `${post.datePublished}T08:00:00+05:30`,
      dateModified: `${post.dateModified}T08:00:00+05:30`,
      author: { '@type': 'Organization', name: author, url: `${SITE_URL}/about` },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, logo: { '@type': 'ImageObject', url: absUrl(LOGO) } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      articleSection: post.category,
      keywords: ['Siliguri Durga Puja 2026', 'Durga Puja pandal map 2026', 'Siliguri pandals', post.category].join(', '),
      inLanguage: 'en-IN',
      contentLocation: { '@type': 'City', name: 'Siliguri', address: { '@type': 'PostalAddress', addressRegion: 'West Bengal', addressCountry: 'IN' } },
    },
    breadcrumbs([['Home', '/'], ['Blog', '/blog'], [post.title, `/blog/${post.slug}`]]),
    faqPage(post.faqs?.map((f) => ({ q: fillTokens(f.q, stats), a: plainText(fillTokens(f.a, stats)) }))),
  ].filter(Boolean);
}
