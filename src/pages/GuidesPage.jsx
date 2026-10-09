import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import guidesData from '../data/guides.json';
import SmartImage from '../components/SmartImage';
import { guideImage } from '../lib/images';

export default function GuidesPage() {
  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="space-y-2 border-b border-brand-border/70 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-vermilion">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curated Hopping Wisdom</span>
          <span>•</span>
          <span className="font-bengali">পুজো গাইড</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-brand-primary">
          Siliguri Puja Guides &amp; Insights
        </h1>
        <p className="text-sm sm:text-base text-brand-muted max-w-2xl leading-relaxed">
          Master the festival with local insider guides covering peak hour navigation, traffic diversions, traditional idol sculptors, and thematic spectacles.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guidesData.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="group bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/50 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-3">
              <SmartImage
                src={guideImage(guide.slug)}
                alt={guide.title}
                className="-mx-6 -mt-6 mb-5 w-[calc(100%+3rem)] max-w-none h-40 object-cover bg-brand-maroon group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-vermilion font-bold uppercase tracking-wider text-[11px]">
                  {guide.category}
                </span>
                <span className="text-brand-muted text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{guide.read_time}</span>
                </span>
              </div>

              <h2 className="text-lg font-extrabold text-brand-primary group-hover:text-brand-vermilion transition-colors line-clamp-2">
                {guide.title}
              </h2>

              <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                {guide.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs font-bold text-brand-vermilion">
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
