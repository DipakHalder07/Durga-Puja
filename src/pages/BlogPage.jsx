import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { PostCover, RichText, STATS } from '../components/BlogBlocks';
import { BLOG_POSTS } from '../data/blog';
import { readingMinutes, fillTokens } from '../lib/blogQueries';
import { useSeo } from '../lib/seo';
import { formatDate } from '../lib/dates';
import { SITE_URL } from '../lib/site';
import { breadcrumbs } from '../lib/schema';

const fmt = (d) => formatDate(d, { month: 'short' });

export default function BlogPage() {
  const [category, setCategory] = useState('All');
  const featured = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const categories = ['All', ...new Set(BLOG_POSTS.map((p) => p.category))];
  const rest = BLOG_POSTS.filter((p) => p !== featured && (category === 'All' || p.category === category));

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Pujo Pandal Blog — Siliguri Durga Puja 2026 guides',
        url: `${SITE_URL}/blog`,
        inLanguage: 'en-IN',
        publisher: { '@id': `${SITE_URL}/#organization` },
        blogPost: BLOG_POSTS.map((p) => ({
          '@type': 'BlogPosting',
          headline: p.title,
          url: `${SITE_URL}/blog/${p.slug}`,
          datePublished: p.datePublished,
          dateModified: p.dateModified,
        })),
      },
      breadcrumbs([['Home', '/'], ['Blog', '/blog']]),
    ],
    []
  );

  useSeo({
    title: 'Siliguri Durga Puja 2026 Blog – Pandal Map Guides & Tips',
    description: `Guides to the Durga Puja pandal map 2026 for Siliguri: ${STATS.total} pandals by zone, walking clusters, parking, theme and traditional pujas, dates and travel tips.`,
    path: '/blog',
    image: '/images/photos/artisan-silhouette.webp',
    jsonLd,
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        bn="পুজোর খবর"
        kicker="Durga Puja pandal map 2026"
        title="The Pujo Pandal blog"
        description="Local guides to Siliguri’s Durga Puja 2026 — the pandal map, walking clusters, parking, dates and the best theme and traditional pujas."
        photo="artisan-silhouette"
      />

      {/* Featured */}
      <Link
        to={`/blog/${featured.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] rounded-3xl overflow-hidden border border-brand-border bg-brand-card hover:shadow-songi-lg transition-shadow"
      >
        <PostCover post={featured} eager sizes="(max-width: 1024px) 100vw, 640px" className="aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]" />
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <span className="eyebrow text-brand-crimson">Start here · {featured.category}</span>
          <h2 className="mt-3 text-h2 font-bold text-brand-ink group-hover:text-brand-crimson transition-colors">{featured.title}</h2>
          <p className="mt-4 text-lead text-brand-muted"><RichText text={featured.excerpt} /></p>
          <p className="mt-5 flex items-center gap-4 text-sm text-brand-muted">
            <time dateTime={featured.dateModified}>{fmt(featured.dateModified)}</time>
            <span className="inline-flex items-center gap-1"><Clock className="w-4 h-4" />{readingMinutes(featured)} min read</span>
          </p>
          <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-crimson">
            Read the guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>

      {/* Filters */}
      <div className="rail -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto" role="tablist" aria-label="Filter articles">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={`shrink-0 h-10 px-4 rounded-full text-sm font-semibold border transition-colors ${
              category === c ? 'bg-brand-ink text-white border-brand-ink' : 'bg-brand-card text-brand-ink border-brand-border hover:border-brand-ink/40'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {rest.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group flex flex-col rounded-2xl border border-brand-border bg-brand-card overflow-hidden hover:shadow-songi-lg hover:border-brand-crimson/40 transition-all"
          >
            <PostCover post={post} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="aspect-[16/10]" />
            <div className="p-5 sm:p-6 flex-1 flex flex-col">
              <span className="eyebrow text-brand-crimson">{post.category}</span>
              <h3 className="font-display text-h3 font-semibold text-brand-ink mt-2 group-hover:text-brand-crimson transition-colors">{post.title}</h3>
              <p className="text-sm text-brand-muted mt-2 line-clamp-3">{fillTokens(post.excerpt, STATS)}</p>
              <p className="mt-auto pt-5 flex items-center gap-4 text-xs text-brand-muted">
                <time dateTime={post.dateModified}>{fmt(post.dateModified)}</time>
                <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{readingMinutes(post)} min</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
