import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import guidesData from '../data/guides.json';
import SmartImage from '../components/SmartImage';
import { guideImage, guideCover } from '../lib/images';
import Photo from '../components/Photo';
import PageHeader from '../components/PageHeader';

export default function GuidesPage() {
  return (
    <div className="space-y-10 pb-16">
      <PageHeader
        bn="পুজো গাইড"
        kicker="Local know-how"
        title="Siliguri Puja guides"
        description="Peak-hour navigation, traffic diversions, idol makers and the big theme spectacles — explained by locals."
        photo="artisan-silhouette"
      />

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guidesData.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="group bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/50 transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="space-y-3">
              {guideCover(guide.slug).photo ? (
                <Photo
                  slug={guideCover(guide.slug).photo}
                  alt={guide.title}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="-mx-6 -mt-6 mb-5 w-[calc(100%+3rem)] max-w-none h-44"
                  imgClassName="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              ) : (
                <SmartImage
                  src={guideImage(guide.slug)}
                  alt={guide.title}
                  className="-mx-6 -mt-6 mb-5 w-[calc(100%+3rem)] max-w-none h-44 object-cover bg-brand-maroon group-hover:scale-[1.03] transition-transform duration-500"
                />
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-vermilion font-bold uppercase tracking-wider text-[11px]">
                  {guide.category}
                </span>
                <span className="text-brand-muted text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{guide.read_time}</span>
                </span>
              </div>

              <h2 className="font-display text-xl font-semibold text-brand-ink group-hover:text-brand-crimson transition-colors line-clamp-2">
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
