import React from 'react';
import InteractiveMap from '../components/InteractiveMap';
import { MapPin, Navigation, Info, ShieldCheck } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="space-y-2 border-b border-brand-border/70 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-vermilion">
          <MapPin className="w-3.5 h-3.5" />
          <span>Interactive Festival Atlas</span>
          <span>•</span>
          <span className="font-bengali">শিলিগুড়ি পুজো ম্যাপ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-brand-primary">
          Siliguri Durga Puja Map 2026
        </h1>
        <p className="text-sm sm:text-base text-brand-muted max-w-2xl leading-relaxed">
          Interactive geographical map of all 83 verified Puja pandals across Siliguri. Search by name, select specific neighborhoods, inspect Songi Scores, and open turn-by-turn directions.
        </p>
      </div>

      {/* Main Interactive Map */}
      <InteractiveMap height="h-[70vh] min-h-[550px]" />

      {/* Map Guidance & Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
            <span className="w-3.5 h-3.5 rounded-full bg-brand-maroon inline-block" />
            <span>High Pandal Score Markers (9.4+)</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Numbered pins highlight the Pujo Pandal score out of 10. Deep maroon pins indicate blockbuster theme and architectural installations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Entrance Coordinates</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            All coordinates reflect actual pedestrian gate access rather than postal centroids, ensuring you aren't routed into closed alleyways.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
            <Navigation className="w-4 h-4 text-brand-vermilion" />
            <span>Real-Time GPS Positioning</span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Click "Use My Location" in the top bar to calculate distance to nearby pandals and see your live blue circle on the map.
          </p>
        </div>
      </div>
    </div>
  );
}
