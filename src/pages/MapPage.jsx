import React from 'react';
import InteractiveMap from '../components/InteractiveMap';
import { MapPin, Navigation, Info, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useSeo } from '../lib/seo';

export default function MapPage() {
  useSeo({
    title: 'Durga Puja Pandal Map 2026 – Siliguri Live Map',
    description: 'Live Durga Puja pandal map 2026 for Siliguri: every verified pandal with GPS pins, search, area filters, parking info and one-tap Google Maps directions.',
    path: '/siliguri-puja-map',
  });
  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        bn="শিলিগুড়ি পুজো ম্যাপ"
        kicker="Interactive map"
        title="Siliguri Durga Puja Map 2026"
        description="Every verified pandal on one map. Search by name, pick a neighbourhood, and open turn-by-turn directions."
        photo="lights-gate"
      />

      {/* Main Interactive Map */}
      <InteractiveMap height="h-[70vh] min-h-[550px]" />

      {/* Map Guidance & Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <span className="w-3.5 h-3.5 rounded-full bg-brand-maroon inline-block" />
            <span>High Pandal Score Markers (9.4+)</span>
          </div>
          <p className="text-sm text-brand-muted">
            Numbered pins highlight the Pujo Pandal score out of 10. Deep maroon pins indicate blockbuster theme and architectural installations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Entrance Coordinates</span>
          </div>
          <p className="text-sm text-brand-muted">
            All coordinates reflect actual pedestrian gate access rather than postal centroids, ensuring you aren't routed into closed alleyways.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <Navigation className="w-4 h-4 text-brand-vermilion" />
            <span>Real-Time GPS Positioning</span>
          </div>
          <p className="text-sm text-brand-muted">
            Click "Use My Location" in the top bar to calculate distance to nearby pandals and see your live blue circle on the map.
          </p>
        </div>
      </div>
    </div>
  );
}
