import React, { Suspense, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { PlanProvider } from './context/PlanContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import MandalaDecorations from './components/MandalaDecorations';
import { ROUTES } from './routes';

// Top of the page on every new route; #hash links scroll to their section
function ScrollManager() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (!hash) return;
    }
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Router is provided by main.jsx (browser) or entry-server.jsx (prerender)
export default function App() {
  return (
    <PlanProvider>
      <ScrollManager />
      <div className="relative min-h-screen flex flex-col text-brand-primary selection:bg-brand-gold selection:text-brand-primary overflow-x-clip">
        <MandalaDecorations />
        <div className="relative z-10 flex-1 flex flex-col">
          <Navbar />
          <main id="main" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
            <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
              <Routes>
                {ROUTES.map(({ path, Page }) => (
                  <Route key={path} path={path} element={<Page />} />
                ))}
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <BottomNav />
        </div>
      </div>
    </PlanProvider>
  );
}
