import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, CheckCircle2, Bookmark, Plus, ArrowRight, Ban, Check, Sparkles } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import SmartImage from './SmartImage';
import { pandalImage } from '../lib/images';

export default function PandalCard({ pandal }) {
  const { isSaved, toggleSave } = usePlan();
  const saved = isSaved(pandal.id);

  return (
    <article className="group relative flex flex-col bg-brand-card border border-brand-border rounded-2xl overflow-hidden shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/40 transition-all duration-300">
      {/* Cover / Header Gradient */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-tr p-4 flex flex-col justify-between select-none from-brand-maroon via-brand-vermilion to-brand-gold">
        <SmartImage
          src={pandalImage(pandal)}
          alt={`${pandal.name} — ${pandal.theme || pandal.category}`}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30 pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full border-2 border-white/20 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

        {/* Top Badges & Actions */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div>
            {pandal.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-900/80 backdrop-blur-md text-xs font-semibold text-emerald-300 border border-emerald-400/40 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(pandal.id);
              }}
              className={`w-10 h-10 inline-flex items-center justify-center rounded-full transition-all duration-200 active:scale-90 border shadow-xs ${
                saved
                  ? 'bg-brand-vermilion text-white border-brand-vermilion'
                  : 'bg-brand-card/90 text-brand-muted hover:text-brand-vermilion hover:bg-white border-brand-border/80'
              }`}
              aria-label={`Save ${pandal.name} to plan`}
              title={saved ? 'Remove from plan' : 'Save to my plan'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom Theme & Score inside cover */}
        <div className="relative z-10 flex items-end justify-between gap-2">
          <div className="max-w-[70%]">
            {pandal.theme && (
              <span className="text-xs font-medium text-white/95 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-md line-clamp-1">
                {pandal.theme}
              </span>
            )}
          </div>
          <div
            className="inline-flex items-center rounded-lg bg-brand-maroon text-[#FFFBF5] font-semibold shadow-sm text-sm px-2 py-0.5 gap-1 shrink-0"
            title={`Pujo Pandal Score: ${pandal.pujo_songi_score || '9.0'} / 10.0`}
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0 fill-brand-gold/30" />
            <span>{pandal.pujo_songi_score || '9.0'}</span>
            <span className="text-xs text-brand-gold-light/80 font-medium">/10</span>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-sm text-brand-muted">
            <div className="flex items-center gap-1.5 font-medium text-brand-primary truncate mr-2">
              <MapPin className="w-3.5 h-3.5 text-brand-vermilion shrink-0" />
              <Link
                to={`/areas/${pandal.area_slug || 'siliguri-town'}`}
                className="hover:text-brand-vermilion transition-colors truncate"
              >
                {pandal.area_name}
              </Link>
              {pandal.zone && (
                <>
                  <span className="text-brand-border">•</span>
                  <span className="truncate hidden xs:inline">{pandal.zone}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-amber-600 font-semibold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{pandal.rating || '4.8'}</span>
            </div>
          </div>

          {/* Name */}
          <div>
            <h3 className="font-display text-h3 font-semibold text-brand-ink group-hover:text-brand-crimson transition-colors line-clamp-2">
              <Link to={`/pandals/${pandal.slug}`}>{pandal.name}</Link>
            </h3>
          </div>

          {/* Visit Time & Parking */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-brand-muted bg-brand-ivory px-2 py-1 rounded-md border border-brand-border/60">
              <Clock className="w-3 h-3 text-brand-vermilion" />
              <span>~{pandal.estimated_visit_minutes || 30} mins</span>
            </span>

            {pandal.parking_available ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border text-emerald-700 bg-emerald-50 border-emerald-200">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Parking Available</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border text-rose-700 bg-rose-50 border-rose-200">
                <Ban className="w-3.5 h-3.5 shrink-0" />
                <span>No Parking (Walk In)</span>
              </span>
            )}
          </div>

          {/* Category Tag */}
          {pandal.category && (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-ivory/80 text-brand-muted border border-brand-border/40">
                {pandal.category}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-4 border-t border-brand-border/60 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => toggleSave(pandal.id)}
            className={`inline-flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
              saved
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'text-brand-primary bg-brand-ivory hover:bg-brand-border/40 border-brand-border'
            }`}
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-amber-700" />
                <span>Saved to Plan</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-brand-vermilion" />
                <span>Add to Route</span>
              </>
            )}
          </button>

          <Link
            to={`/pandals/${pandal.slug}`}
            className="inline-flex items-center gap-1 h-10 px-1 text-sm font-semibold text-brand-vermilion hover:text-brand-vermilion-hover transition-colors group-hover:translate-x-0.5 duration-200"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
