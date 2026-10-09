import React from 'react';
import { ChevronDown } from 'lucide-react';
import { RichText } from './BlogBlocks';

// Visible FAQ. Pair it with faqPage(faqs) in the page's JSON-LD so the markup matches the page.
export default function Faq({ faqs, title = 'Frequently asked questions', bn = 'প্রশ্ন ও উত্তর', id = 'faq', className = '' }) {
  if (!faqs?.length) return null;
  return (
    <section aria-labelledby={id} className={`space-y-content ${className}`}>
      <div>
        {bn && <p className="font-bengali-serif text-brand-crimson text-lg sm:text-xl leading-none">{bn}</p>}
        <h2 id={id} className="scroll-mt-28 text-h2 font-bold text-brand-ink mt-2">{title}</h2>
      </div>
      <div className="divide-y divide-brand-border rounded-2xl border border-brand-border bg-brand-card">
        {faqs.map((f, i) => (
          <details key={f.q} className="group px-5 sm:px-6" open={i === 0}>
            <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-5 text-base sm:text-lg leading-snug font-semibold text-brand-ink">
              <h3 className="font-sans text-base sm:text-lg font-semibold">{f.q}</h3>
              <ChevronDown className="w-5 h-5 shrink-0 text-brand-crimson transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <p className="pb-5 -mt-1 text-base text-brand-ink/80"><RichText text={f.a} /></p>
          </details>
        ))}
      </div>
    </section>
  );
}
