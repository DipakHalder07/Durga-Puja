import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-brand-card border-t border-brand-border/70 mt-10 lg:mt-16 pt-10 lg:pt-12 pb-24 lg:pb-12 text-sm text-brand-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8 lg:gap-12 pb-12 border-b border-brand-border/60">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center shrink-0 w-9 h-9 rounded-full border-2 border-brand-gold overflow-hidden shadow-xs bg-brand-maroon">
                <img
                  src="/logo-icon.png"
                  alt="Pujo Pandal Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="font-extrabold tracking-tight text-brand-primary text-base">PUJO PANDAL</span>
                <span className="text-xs font-semibold text-brand-vermilion font-bengali mt-0.5">পুজো প্যান্ডেল</span>
              </div>
            </Link>

            <p className="font-bengali font-bold text-brand-maroon text-base">
              পুজো ঘোরার সঙ্গী।
            </p>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm">
              An authentic, friendly digital companion for exploring Durga Puja pandals across Siliguri. Built with local care, zero fabricated traffic simulation, and verified community curation.
            </p>

            <div className="pt-2 space-y-1.5 text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-vermilion shrink-0" />
                <span>Collegepara, Siliguri, West Bengal — 734005</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-vermilion shrink-0" />
                <a href="mailto:pujopandal@gmail.com" className="hover:text-brand-vermilion transition-colors">
                  pujopandal@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Phase 1 Architecture • Real Implementation Only</span>
              </div>
            </div>
          </div>

          {/* Col 1: Discovery */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary">
              Puja Discovery
            </h4>
            <ul className="space-y-1 text-sm lg:text-xs">
              <li>
                <Link to="/" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/siliguri-durga-puja-guide" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Siliguri Puja Guide 2026</Link>
              </li>
              <li>
                <Link to="/siliguri-puja" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Siliguri Puja Hub</Link>
              </li>
              <li>
                <Link to="/siliguri-puja-pandals" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Explore Pandals</Link>
              </li>
              <li>
                <Link to="/siliguri-puja-map" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Siliguri Puja Map</Link>
              </li>
              <li>
                <Link to="/siliguri-puja-routes" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Smart Routes</Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Festival & Culture */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary">
              Festival &amp; Culture
            </h4>
            <ul className="space-y-1 text-sm lg:text-xs">
              <li>
                <Link to="/puja-schedule" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Puja Schedule 2026</Link>
              </li>
              <li>
                <Link to="/mahalaya" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Mahalaya 2026</Link>
              </li>
              <li>
                <Link to="/best-puja-pandals-in-siliguri" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Best Pandals in Siliguri</Link>
              </li>
              <li>
                <Link to="/pandal-hopping-in-siliguri" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Pandal Hopping Guide</Link>
              </li>
              <li>
                <Link to="/guides" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Siliguri Guides</Link>
              </li>
              <li>
                <Link to="/areas" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Neighborhood Areas</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-primary">
              Information &amp; Trust
            </h4>
            <ul className="space-y-1 text-sm lg:text-xs">
              <li>
                <Link to="/about" className="inline-block py-1 hover:text-brand-vermilion transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Contact Desk</Link>
              </li>
              <li>
                <Link to="/saved" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Saved Puja Plan</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="inline-block py-1 hover:text-brand-vermilion transition-colors">Disclaimer</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted">
          <div>
            © 2026 PUJO PANDAL. Curated with pride for Siliguri and North Bengal.
          </div>
          <div className="flex items-center gap-1.5 font-medium text-brand-primary">
            <span>Live Festival Portal • Durga Puja 1433 / 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
