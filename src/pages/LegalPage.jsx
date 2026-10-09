import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import legalData from '../data/legal.json';
import Breadcrumbs from '../components/Breadcrumbs';
import { useSeo } from '../lib/seo';
import { breadcrumbs } from '../lib/schema';
import { formatDate } from '../lib/dates';
import NotFoundPage from './NotFoundPage';

export default function LegalPage() {
  const { pathname } = useLocation();
  const pageKey = pathname.replace(/^\/|\/$/g, '');
  const doc = legalData[pageKey];
  if (!doc) return <NotFoundPage />;
  return <LegalDoc doc={doc} path={`/${pageKey}`} />;
}

function LegalDoc({ doc, path }) {
  useSeo({
    title: doc.metaTitle,
    description: doc.description,
    path,
    jsonLd: breadcrumbs([['Home', '/'], [doc.title, path]]),
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
      <Breadcrumbs items={[['Home', '/'], [doc.title]]} />

      <header className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-10 shadow-songi space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ivory text-brand-vermilion text-xs font-semibold border border-brand-border">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Pujo Pandal · durgapujapandal.site</span>
        </div>
        <h1 className="text-h1 font-bold text-brand-ink">{doc.title}</h1>
        <p className="text-sm text-brand-muted">
          Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
        </p>
      </header>

      <article className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-10 shadow-songi space-y-8 text-base text-brand-primary/90">
        <p className="leading-relaxed">{doc.intro}</p>
        {doc.sections.map((sec) => (
          <section key={sec.heading} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-ink">{sec.heading}</h2>
            {sec.paragraphs.map((para) => (
              <p key={para.slice(0, 40)} className="leading-relaxed">{para}</p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
