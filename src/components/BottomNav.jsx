import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MapPin, Route, Bookmark } from 'lucide-react';
import { usePlan } from '../context/PlanContext';

export default function BottomNav() {
  const location = useLocation();
  const { savedPandalIds } = usePlan();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Pandals', path: '/siliguri-puja-pandals', icon: Compass },
    { label: 'Map', path: '/siliguri-puja-map', icon: MapPin },
    { label: 'Routes', path: '/siliguri-puja-routes', icon: Route },
    { label: 'Saved', path: '/saved', icon: Bookmark, badge: savedPandalIds.length },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav aria-label="Quick navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-bottom-nav border-t border-brand-border/70 shadow-[0_-4px_16px_-6px_rgba(58,2,18,0.12)] px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-md mx-auto flex items-stretch gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              aria-current={active ? 'page' : undefined}
              aria-label={item.badge > 0 ? `${item.label}, ${item.badge} saved` : item.label}
              className={`relative flex-1 flex flex-col items-center justify-center min-h-[52px] py-1 rounded-xl transition-colors duration-200 active:scale-95 ${
                active ? 'text-brand-crimson' : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-colors duration-200 ${
                  active ? 'bg-brand-vermilion-light' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 inline-flex items-center justify-center bg-brand-crimson text-white text-[9px] font-bold rounded-full ring-2 ring-brand-card">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
