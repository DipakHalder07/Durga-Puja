import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Bookmark, Menu, X, Compass, Route, Calendar, BookOpen, Mail, Sparkles, ChevronRight } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { savedPandalIds, requestUserLocation, isLocating, userLocation } = usePlan();
  const location = useLocation();

  const navLinks = [
    { name: 'Discover', path: '/siliguri-puja-pandals', icon: Compass },
    { name: 'Map', path: '/siliguri-puja-map', icon: MapPin },
    { name: 'Smart Routes', path: '/siliguri-puja-routes', icon: Route },
    { name: 'Puja Schedule', path: '/puja-schedule', icon: Calendar },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Close the menu whenever the page changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape and stop the page scrolling behind the open menu
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full glass-header shadow-songi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-8 min-w-0">
          <Link
            to="/"
            className="group flex items-center gap-2.5 rounded-lg transition-transform active:scale-95 min-w-0"
            aria-label="PUJO PANDAL Homepage"
          >
            <div className="relative flex items-center justify-center shrink-0 w-11 h-11 rounded-full border-2 border-brand-gold overflow-hidden shadow-songi bg-brand-crimson group-hover:scale-105 transition-transform duration-300">
              <img
                src="/logo-icon.webp"
                alt="Pujo Pandal Durga Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col text-left leading-none min-w-0">
              <span className="font-display font-semibold tracking-tight text-brand-gold-light text-lg md:text-xl truncate">
                Pujo Pandal
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm text-white/90 font-bengali-serif">
                  পুজো প্যান্ডেল
                </span>
                <span className="text-xs text-white/60 hidden sm:inline-block">
                  • Siliguri Guide
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-brand-maroon-dark bg-brand-gold-light font-semibold shadow-2xs'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Location button */}
          <button
            type="button"
            onClick={requestUserLocation}
            disabled={isLocating}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 h-10 text-sm font-semibold rounded-xl border transition-all active:scale-95 disabled:opacity-70 ${
              userLocation
                ? 'border-brand-gold bg-brand-gold/20 text-brand-gold-light'
                : 'border-white/20 bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="Find pandals near you"
          >
            <MapPin className={`w-4 h-4 text-brand-gold-light ${isLocating ? 'animate-bounce' : ''}`} />
            <span>{isLocating ? 'Locating…' : userLocation ? 'Location On' : 'Near Me'}</span>
          </button>

          {/* Saved Plan Button */}
          <Link
            to="/saved"
            aria-current={isActive('/saved') ? 'page' : undefined}
            className="relative inline-flex items-center gap-1.5 px-3.5 h-10 text-sm font-semibold rounded-xl transition-all active:scale-95 bg-brand-gold-light text-brand-maroon-dark hover:bg-white shadow-2xs"
            aria-label={`Saved plan, ${savedPandalIds.length} pandals`}
          >
            <Bookmark className={`w-4 h-4 ${savedPandalIds.length > 0 ? 'fill-brand-crimson text-brand-crimson' : ''}`} />
            <span className="hidden xs:inline">Saved</span>
            {savedPandalIds.length > 0 && (
              <span className="min-w-[1.25rem] h-5 px-1.5 inline-flex items-center justify-center bg-brand-crimson text-white text-2xs font-bold rounded-full">
                {savedPandalIds.length}
              </span>
            )}
          </Link>

          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="header-trim" aria-hidden="true" />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 top-[70px] bg-brand-maroon-dark/40 backdrop-blur-[2px] cursor-default"
          />
          <div
            id="mobile-menu"
            className="lg:hidden relative max-h-[calc(100vh-70px)] overflow-y-auto border-b border-brand-border bg-brand-card px-4 pt-4 pb-6 space-y-3 shadow-songi-lg animate-menu-in"
          >
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  requestUserLocation();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 min-h-12 px-3.5 rounded-xl bg-brand-vermilion-light border border-brand-vermilion/20 text-sm font-semibold text-brand-maroon"
              >
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{userLocation ? 'Location On' : 'Near Me'}</span>
              </button>
              <Link
                to="/saved"
                className="flex items-center justify-between min-h-12 px-3.5 rounded-xl bg-brand-vermilion-light border border-brand-vermilion/20 text-sm font-semibold text-brand-maroon"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 shrink-0" />
                  <span>Saved Plan</span>
                </span>
                {savedPandalIds.length > 0 && (
                  <span className="min-w-[1.25rem] h-5 px-1.5 inline-flex items-center justify-center bg-brand-crimson text-white text-2xs font-bold rounded-full">
                    {savedPandalIds.length}
                  </span>
                )}
              </Link>
            </div>

            <nav className="space-y-1" aria-label="Mobile">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3.5 min-h-12 rounded-xl text-base font-medium transition-colors ${
                      active
                        ? 'bg-brand-crimson text-white font-semibold'
                        : 'text-brand-primary hover:bg-brand-ivory'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-brand-gold-light' : 'text-brand-vermilion'}`} />
                    <span className="flex-1">{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${active ? 'text-white/70' : 'text-brand-muted/60'}`} />
                  </Link>
                );
              })}
              <Link
                to="/about"
                className="flex items-center gap-3 px-3.5 min-h-12 rounded-xl text-base font-medium text-brand-muted hover:bg-brand-ivory"
              >
                <Sparkles className="w-5 h-5 text-brand-gold" />
                <span className="flex-1">About Pujo Pandal</span>
                <ChevronRight className="w-4 h-4 text-brand-muted/60" />
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
