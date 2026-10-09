import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import legalData from '../data/legal.json';

export default function LegalPage() {
  const location = useLocation();
  const pageKey = location.pathname.replace(/^\//, '').replace(/\/$/, '') || 'privacy-policy';

  const doc = legalData[pageKey] || {
    title: pageKey.replace('-', ' ').toUpperCase(),
    paragraphs: [],
  };

  const getPageTitle = () => {
    if (pageKey === 'privacy-policy') return 'Privacy Policy';
    if (pageKey === 'terms') return 'Terms of Service';
    if (pageKey === 'disclaimer') return 'Festival Disclaimer';
    return doc.title;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
      {/* Back link */}
      <div className="flex items-center justify-between gap-4 text-sm text-brand-muted">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span className="text-brand-primary font-bold">Legal &amp; Policy</span>
      </div>

      {/* Header Banner */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-10 shadow-songi space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ivory text-brand-vermilion text-xs font-semibold border border-brand-border">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PUJO PANDAL Guidelines</span>
        </div>
        <h1 className="text-h1 font-bold text-brand-ink">
          {getPageTitle()}
        </h1>
        <p className="text-sm text-brand-muted">
          Last revised for Durga Puja 2026. Applicable across all digital platforms of PUJO PANDAL.
        </p>
      </div>

      {/* Content */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-10 shadow-songi space-y-5 text-base text-brand-primary/90">
        {doc.paragraphs && doc.paragraphs.length > 0 ? (
          doc.paragraphs.map((para, i) => (
            <p key={i} className="leading-relaxed">
              {para}
            </p>
          ))
        ) : (
          <div className="space-y-4">
            <p>
              PUJO PANDAL is an independent, non-commercial community companion initiative built for pilgrims and visitors of Durga Puja in Siliguri.
            </p>
            <p>
              All pandal information, themes, and coordinates are gathered from official committee notifications and verified municipal records. While every attempt is made to keep information updated in real-time, visitors are encouraged to respect local police traffic diversions and administrative advisories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
