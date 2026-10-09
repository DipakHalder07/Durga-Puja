import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, Clock, CalendarDays, Share2, ChevronDown, Route as RouteIcon, MapPin, ArrowRight } from 'lucide-react';
import BlogBlocks, { PostCover, RichText, STATS } from '../components/BlogBlocks';
import { BLOG_POSTS, BLOG_AUTHOR, getPost } from '../data/blog';
import { fillTokens, readingMinutes, plainText } from '../lib/blogQueries';
import { postJsonLd, postImage } from '../lib/blogSchema';
import { useSeo } from '../lib/seo';
import { PHOTOS } from '../components/Photo';
import { LotusSketch, DurgaEyesSketch } from '../components/BengalArt';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group flex flex-col rounded-2xl border border-brand-border bg-brand-card overflow-hidden hover:shadow-songi-lg hover:border-brand-crimson/40 transition-all">
      <PostCover post={post} className="h-40" sizes="(max-width: 768px) 100vw, 33vw" />
      <div className="p-4 flex-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-crimson">{post.category}</span>
        <h3 className="font-display text-lg font-semibold text-brand-ink leading-snug mt-1 group-hover:text-brand-crimson transition-colors">{post.title}</h3>
      </div>
    </Link>
  );
}

function Toc({ items }) {
  return (
    <ol className="space-y-1.5 text-sm">
      {items.map((h, i) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className="flex gap-2 py-1 text-brand-ink/80 hover:text-brand-crimson">
            <span className="text-brand-crimson/70 tabular-nums">{i + 1}.</span>
            <span>{plainText(fillTokens(h.text, STATS))}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getPost(slug);
  if (!post) return <Navigate to="/blog" replace />;
  return <Post post={post} />;
}

function Post({ post }) {
  const minutes = readingMinutes(post);
  const toc = post.body.filter((b) => b.type === 'h2');
  const related = post.related.map(getPost).filter(Boolean);
  const jsonLd = useMemo(
    () => postJsonLd(post, { origin: window.location.origin, stats: STATS, photosBySlug: PHOTOS, author: BLOG_AUTHOR }),
    [post]
  );

  useSeo({
    title: post.metaTitle,
    description: fillTokens(post.metaDescription, STATS),
    path: `/blog/${post.slug}`,
    image: postImage(post, PHOTOS),
    type: 'article',
    jsonLd,
  });

  const share = () => {
    const data = { title: post.title, text: fillTokens(post.excerpt, STATS), url: window.location.href };
    if (navigator.share) navigator.share(data).catch(() => {});
    else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  return (
    <article className="pb-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-muted mb-5">
        <Link to="/" className="hover:text-brand-crimson">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/blog" className="hover:text-brand-crimson">Blog</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-ink truncate">{post.category}</span>
      </nav>

      {/* Header */}
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-brand-vermilion-light text-brand-crimson font-semibold">{post.category}</span>
          <span className="font-bengali-serif text-brand-crimson">শারদীয়া ১৪৩৩</span>
        </span>
        <h1 className="mt-4 text-[2rem] leading-[1.12] sm:text-5xl font-bold text-brand-ink">{post.title}</h1>
        <p className="mt-4 text-lg text-brand-muted leading-relaxed"><RichText text={post.excerpt} /></p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-brand-muted">
          <span className="inline-flex items-center gap-2">
            <img src="/logo-icon.png" alt="" className="w-7 h-7 rounded-full border border-brand-gold" />
            <span className="font-medium text-brand-ink">{BLOG_AUTHOR}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <time dateTime={post.dateModified}>Updated {fmtDate(post.dateModified)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" />{minutes} min read</span>
          <button type="button" onClick={share} className="inline-flex items-center gap-1.5 font-medium text-brand-crimson hover:underline">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </header>

      <PostCover post={post} eager sizes="(max-width: 1024px) 100vw, 1100px" className="mt-7 aspect-[16/9] sm:aspect-[21/9] rounded-3xl shadow-songi" />

      <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-10 lg:gap-14">
        <div className="min-w-0 max-w-3xl">
          {/* TOC on phones */}
          {toc.length > 2 && (
            <details className="lg:hidden group mb-6 rounded-2xl border border-brand-border bg-brand-card">
              <summary className="flex items-center justify-between cursor-pointer list-none px-4 py-3 font-semibold text-brand-ink">
                In this article
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-4 pb-4"><Toc items={toc} /></div>
            </details>
          )}

          <div className="text-[17px] leading-[1.75] text-brand-ink/90">
            <BlogBlocks blocks={post.body} />
          </div>

          {/* FAQ */}
          {post.faqs?.length > 0 && (
            <section aria-labelledby="faq" className="mt-14">
              <h2 id="faq" className="scroll-mt-28 text-[1.6rem] sm:text-3xl font-bold text-brand-ink">Frequently asked questions</h2>
              <div className="mt-5 divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-card">
                {post.faqs.map((f, i) => (
                  <details key={i} className="group px-5" open={i === 0}>
                    <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-4 font-semibold text-brand-ink">
                      <span>{fillTokens(f.q, STATS)}</span>
                      <ChevronDown className="w-5 h-5 shrink-0 text-brand-crimson transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="pb-4 -mt-1 text-[15px] leading-relaxed text-brand-ink/80"><RichText text={f.a} /></p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 flex items-center gap-3 text-brand-gold" aria-hidden="true">
            <span className="h-px flex-1 bg-current opacity-50" />
            <LotusSketch className="w-10 h-7" strokeWidth={2} />
            <span className="h-px flex-1 bg-current opacity-50" />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-5">
            {toc.length > 0 && (
              <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-muted mb-3">In this article</p>
                <Toc items={toc} />
              </div>
            )}
            <div className="relative overflow-hidden rounded-2xl bg-brand-crimson text-white p-5">
              <DurgaEyesSketch className="w-24 h-10 text-brand-gold-light/80" />
              <p className="font-display text-xl font-semibold mt-2">Plan your Pujo route</p>
              <p className="text-sm text-white/80 mt-1">Start point, travel mode and time — we order the pandals for you.</p>
              <Link to="/siliguri-puja-routes" className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-brand-gold text-brand-maroon-dark text-sm font-semibold">
                <RouteIcon className="w-4 h-4" /> Build my route
              </Link>
            </div>
            <Link to="/siliguri-puja-map" className="flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-card p-4 hover:border-brand-crimson/40">
              <MapPin className="w-5 h-5 text-brand-crimson" />
              <span className="text-sm font-semibold text-brand-ink flex-1">Open the pandal map</span>
              <ArrowRight className="w-4 h-4 text-brand-crimson" />
            </Link>
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section aria-label="Related articles" className="mt-14">
          <p className="font-bengali-serif text-brand-crimson">আরও পড়ুন</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-ink mt-1">Keep reading</h2>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((p) => <PostCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}

      <p className="mt-10 text-xs text-brand-muted">
        Published {fmtDate(post.datePublished)} · Pandal lists update automatically from verified 2026 records.
        {' '}<Link to="/blog" className="underline underline-offset-2 hover:text-brand-crimson">All {BLOG_POSTS.length} articles</Link>
      </p>
    </article>
  );
}
