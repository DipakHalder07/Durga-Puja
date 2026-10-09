import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Photo from './Photo';

// Section heading: Bengali word in Tiro Bangla, English serif title, short red rule
export function SectionHeading({ bn, title, sub, to, linkLabel, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {bn && <p className="font-bengali-serif text-brand-crimson text-lg sm:text-xl leading-none">{bn}</p>}
          <h2 className="text-h2 font-bold text-brand-ink mt-2">{title}</h2>
          {sub && <p className="text-base text-brand-muted mt-2 max-w-2xl">{sub}</p>}
        </div>
        {to && (
          <Link
            to={to}
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-crimson hover:underline underline-offset-4"
          >
            {linkLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-[3px] w-10 rounded-full bg-brand-crimson" />
        <span className="h-[3px] w-2 rounded-full bg-brand-gold" />
        <span className="h-px flex-1 bg-brand-border" />
      </div>
      {to && (
        <Link
          to={to}
          className="sm:hidden mt-4 inline-flex items-center gap-1.5 min-h-[2.75rem] text-sm font-semibold text-brand-crimson"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// Page header used across inner pages: Bengali kicker, serif title, real photo in a temple-arch frame
export default function PageHeader({ bn, kicker, title, description, photo, photoAlt, children }) {
  return (
    <header className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 sm:gap-12 items-end">
        <div className="min-w-0 space-y-4 order-2 sm:order-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {bn && <span className="font-bengali-serif text-base text-brand-crimson leading-none">{bn}</span>}
            {bn && kicker && <span className="w-1 h-1 rounded-full bg-brand-gold" aria-hidden="true" />}
            {kicker && <span className="eyebrow text-brand-muted">{kicker}</span>}
          </div>
          <h1 className="text-h1 font-bold text-brand-ink">{title}</h1>
          {description && <p className="text-lead text-brand-muted max-w-2xl">{description}</p>}
          {children}
        </div>
        {photo && (
          <div className="order-1 sm:order-2 relative isolate">
            <Photo
              slug={photo}
              alt={photoAlt}
              eager
              sizes="(max-width: 640px) 100vw, 220px"
              className="h-40 w-full rounded-2xl sm:h-60 sm:w-48 sm:rounded-b-2xl sm:rounded-t-full ring-1 ring-brand-gold/40 shadow-songi"
            />
            <span
              className="hidden sm:block absolute inset-0 rounded-t-full rounded-b-2xl border-[3px] border-brand-crimson/90 translate-x-2.5 translate-y-2.5 -z-10"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <div className="laal-paar-thin mt-content rounded-full" aria-hidden="true" />
    </header>
  );
}
