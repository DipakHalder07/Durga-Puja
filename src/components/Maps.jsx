import React, { lazy, Suspense, useEffect, useState } from 'react';

// Leaflet needs a browser, and it is heavy, so maps load in their own chunk after the page
// is interactive. The placeholders keep the same size so nothing jumps when the map appears.
const InteractiveMapImpl = lazy(() => import('./InteractiveMap'));
const RouteMapImpl = lazy(() => import('./RouteMap'));
const PandalsMapImpl = lazy(() => import('./PandalsMap'));

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

const Loading = () => <span className="text-sm text-brand-muted">Loading map…</span>;

export function PandalsMap(props) {
  const mounted = useMounted();
  const shell = (
    <div
      className={`relative z-0 w-full rounded-2xl overflow-hidden border border-brand-border bg-brand-paper flex items-center justify-center ${props.className || 'h-64 sm:h-80'}`}
      aria-busy="true"
    >
      <Loading />
    </div>
  );
  return mounted ? <Suspense fallback={shell}><PandalsMapImpl {...props} /></Suspense> : shell;
}

export function RouteMap(props) {
  const mounted = useMounted();
  const shell = (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-2 sm:p-3 shadow-songi" aria-busy="true">
      <p className="px-2 pt-1 pb-3 font-display text-lg font-semibold text-brand-ink">{props.title || 'Route map'}</p>
      <div className={`rounded-xl border border-brand-border/70 bg-brand-paper flex items-center justify-center ${props.className || 'h-80 sm:h-[26rem]'}`}>
        <Loading />
      </div>
    </div>
  );
  return mounted ? <Suspense fallback={shell}><RouteMapImpl {...props} /></Suspense> : shell;
}

export function InteractiveMap(props) {
  const mounted = useMounted();
  const shell = (
    <div className="relative w-full rounded-3xl overflow-hidden border border-brand-border bg-brand-card shadow-songi" aria-busy="true">
      <div className="h-[9.5rem] sm:h-[6.5rem] md:h-[4.75rem] border-b border-brand-border" />
      <div className={`w-full bg-brand-paper flex items-center justify-center ${props.height || 'h-[650px]'}`}>
        <Loading />
      </div>
    </div>
  );
  return mounted ? <Suspense fallback={shell}><InteractiveMapImpl {...props} /></Suspense> : shell;
}
