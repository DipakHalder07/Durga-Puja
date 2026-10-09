import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

// items: [['Home', '/'], ['Areas', '/areas'], ['Hakimpara']] — the last item is the current page.
// Use the same list with breadcrumbs() from lib/schema for the JSON-LD.
export default function Breadcrumbs({ items, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-brand-muted ${className}`}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map(([label, to], i) => {
          const last = i === items.length - 1;
          return (
            <li key={label} className="inline-flex items-center gap-1.5 min-w-0">
              {last || !to ? (
                <span className="text-brand-ink truncate max-w-[14rem] sm:max-w-md" aria-current={last ? 'page' : undefined}>{label}</span>
              ) : (
                <Link to={to} className="hover:text-brand-crimson">{label}</Link>
              )}
              {!last && <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
