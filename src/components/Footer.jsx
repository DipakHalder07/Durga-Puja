import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail } from 'lucide-react';
import { AlpanaSketch, LaalPaar, DurgaEyesSketch } from './BengalArt';

const LINK_GROUPS = [
  {
    title: 'Puja discovery',
    links: [
      ['Home', '/'],
      ['Explore pandals', '/siliguri-puja-pandals'],
      ['Siliguri Puja map', '/siliguri-puja-map'],
      ['Smart routes', '/siliguri-puja-routes'],
      ['Neighbourhood areas', '/areas'],
      ['Saved Puja plan', '/saved'],
    ],
  },
  {
    title: 'Festival & culture',
    links: [
      ['Puja schedule 2026', '/puja-schedule'],
      ['Mahalaya 2026', '/mahalaya'],
      ['Durga Puja pandal map 2026', '/blog/durga-puja-pandal-map-2026'],
      ['Zone-wise pandal map', '/blog/siliguri-durga-puja-pandal-map-2026-zone-wise'],
      ['Walking pandal routes', '/blog/durga-puja-pandal-map-2026-walking-routes'],
      ['Blog', '/blog'],
    ],
  },
  {
    title: 'About',
    links: [
      ['About us', '/about'],
      ['Contact', '/contact'],
      ['Photo credits', '/photo-credits'],
      ['Privacy policy', '/privacy-policy'],
      ['Terms of service', '/terms'],
      ['Disclaimer', '/disclaimer'],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full mt-section bg-brand-crimson text-white/80 overflow-hidden">
      <LaalPaar className="-scale-y-100" style={{ backgroundColor: '#FAF5EB' }} />
      <AlpanaSketch className="absolute -right-32 top-10 w-[26rem] h-[26rem] text-white/[0.07] pointer-events-none" />
      <AlpanaSketch className="absolute -left-40 -bottom-40 w-[28rem] h-[28rem] text-white/[0.05] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-28 lg:pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-10 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="w-12 h-12 rounded-full border-2 border-brand-gold overflow-hidden bg-brand-maroon shrink-0">
                <img src="/logo-icon.webp" alt="" className="w-full h-full object-cover" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-xl font-semibold text-white">Pujo Pandal</span>
                <span className="block font-bengali-serif text-brand-gold-light">পুজো প্যান্ডেল</span>
              </span>
            </Link>
            <p className="font-bengali-serif text-2xl text-white">পুজো ঘোরার সঙ্গী</p>
            <p className="text-base max-w-sm">
              A friendly companion for exploring Durga Puja pandals across Siliguri — built with local care and verified committee records.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-gold-light shrink-0" /> Collegepara, Siliguri, West Bengal 734005</p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-gold-light shrink-0" />
                <a href="mailto:pujopandal@gmail.com" className="hover:text-white underline-offset-4 hover:underline">pujopandal@gmail.com</a>
              </p>
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title} className={group.title === 'About' ? 'col-span-2 sm:col-span-1' : ''}>
              <h4 className="eyebrow text-brand-gold-light mb-3">{group.title}</h4>
              <ul className={`text-sm ${group.title === 'About' ? 'grid grid-cols-2 sm:block gap-x-6' : ''}`}>
                {group.links.map(([label, to]) => (
                  <li key={to}>
                    <Link to={to} className="inline-block py-2 hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <DurgaEyesSketch className="w-28 h-11 text-brand-gold-light/70 order-first sm:order-none" />
          <p>© 2026 Pujo Pandal · Made with love in Siliguri</p>
          <p className="font-bengali-serif text-sm text-white/70">শুভ শারদীয়া ১৪৩৩</p>
        </div>
      </div>
    </footer>
  );
}
