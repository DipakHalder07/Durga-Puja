import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import areasData from '../data/areas.json';
import pandalsData from '../data/pandals.json';

export default function AreasPage() {
  const pandalsByArea = pandalsData.reduce((acc, p) => {
    acc[p.area_name] = (acc[p.area_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="space-y-2 border-b border-brand-border/70 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-vermilion">
          <MapPin className="w-3.5 h-3.5" />
          <span>Siliguri Municipal Zones</span>
          <span>•</span>
          <span className="font-bengali">এলাকা ভিত্তিক পুজো</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-brand-primary">
          Siliguri Puja Neighborhoods &amp; Areas
        </h1>
        <p className="text-sm sm:text-base text-brand-muted max-w-2xl leading-relaxed">
          Explore Durga Puja pandals organized by municipal localities and residential paras across the Siliguri Metropolitan Area.
        </p>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {areasData.map((area) => {
          const count = pandalsByArea[area.name] || 0;
          return (
            <Link
              key={area.id}
              to={`/areas/${area.slug}`}
              className="group p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand-vermilion uppercase tracking-wide">
                    {count} {count === 1 ? 'Pandal' : 'Pandals'}
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-vermilion transition-colors" />
                </div>
                <h3 className="text-base font-extrabold text-brand-primary group-hover:text-brand-vermilion transition-colors">
                  {area.name}
                </h3>
                {area.description && (
                  <p className="text-xs text-brand-muted line-clamp-2">
                    {area.description}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs font-bold text-brand-primary group-hover:text-brand-vermilion">
                <span>View Pandals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
