import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MapPin, Route as RouteIcon, BookOpen } from 'lucide-react';
import { DhakSketch } from '../components/BengalArt';
import { useSeo } from '../lib/seo';

const LINKS = [
  { to: '/siliguri-puja-pandals', label: 'All Siliguri pandals', icon: Compass },
  { to: '/siliguri-puja-map', label: 'Durga Puja pandal map', icon: MapPin },
  { to: '/siliguri-puja-routes', label: 'Smart Puja routes', icon: RouteIcon },
  { to: '/blog', label: 'Guides & tips', icon: BookOpen },
];

export default function NotFoundPage() {
  const { pathname } = useLocation();
  useSeo({
    title: 'Page not found',
    description: 'This page does not exist. Find Siliguri Durga Puja 2026 pandals, the pandal map and smart routes on Pujo Pandal.',
    path: pathname,
    noindex: true,
  });

  return (
    <div className="py-16 sm:py-24 text-center max-w-xl mx-auto space-y-5">
      <DhakSketch className="w-24 h-24 mx-auto text-brand-crimson" />
      <p className="font-bengali-serif text-lg text-brand-crimson">পথ হারিয়েছেন?</p>
      <h1 className="text-h1 font-bold text-brand-ink">This page has wandered off</h1>
      <p className="text-base text-brand-muted">
        The link may be old or mistyped. Every Siliguri pandal, area and route is still here — pick a place to start.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-left">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link to={to} className="flex items-center gap-3 min-h-12 px-4 rounded-xl border border-brand-border bg-brand-card font-semibold text-brand-ink hover:border-brand-crimson/40">
              <Icon className="w-5 h-5 text-brand-crimson" /> {label}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/" className="inline-flex items-center h-12 px-6 rounded-full bg-brand-crimson text-white font-semibold">
        Back to the home page
      </Link>
    </div>
  );
}
