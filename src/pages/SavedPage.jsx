import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, MapPin, Trash2, ExternalLink, Compass, ArrowRight, Share2 } from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import PandalCard from '../components/PandalCard';
import PageHeader from '../components/PageHeader';
import { DhakSketch } from '../components/BengalArt';

export default function SavedPage() {
  const { savedPandals, savedPandalIds, toggleSave } = usePlan();

  const totalMinutes = savedPandals.reduce((acc, p) => acc + (p.estimated_visit_minutes || 30), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const googleMapsRouteUrl =
    savedPandals.length > 0
      ? `https://www.google.com/maps/dir/${savedPandals.map((p) => `${p.latitude},${p.longitude}`).join('/')}`
      : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Siliguri Puja 2026 Plan — Pujo Pandal',
        text: `I have saved ${savedPandals.length} pandals for Durga Puja 2026 in Siliguri!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Plan link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        bn="আমার পুজো"
        kicker="Your saved plan"
        title="My Puja plan"
        description="Your bookmarked pandals, saved privately on this device. See your total darshan time and navigate the circuit."
        photo="boron-hands"
      />

      {savedPandals.length > 0 ? (
        <div className="space-y-8">
          {/* Summary Ribbon */}
          <div className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-brand-maroon text-[#FFFBF5] font-black text-lg flex items-center justify-center shrink-0">
                {savedPandals.length}
              </div>
              <div>
                <span className="text-sm font-extrabold text-brand-primary block">
                  {savedPandals.length} Pandals in your itinerary
                </span>
                <span className="text-xs text-brand-muted flex items-center gap-1.5 justify-center sm:justify-start">
                  <Clock className="w-3.5 h-3.5 text-brand-vermilion" />
                  <span>Estimated Total Darshan Time: ~{totalHours} hours</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {googleMapsRouteUrl && (
                <a
                  href={googleMapsRouteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Open Route in Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-brand-ivory hover:bg-white text-brand-primary border border-brand-border text-xs transition-colors"
                title="Share your plan"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pandals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {savedPandals.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center space-y-4 bg-brand-card rounded-3xl border border-brand-border p-8 shadow-songi max-w-xl mx-auto">
          <DhakSketch className="w-24 h-24 mx-auto text-brand-crimson" />
          <p className="font-bengali-serif text-lg text-brand-crimson">এখনও কিছু রাখা হয়নি</p>
          <h2 className="text-2xl font-bold text-brand-ink">No pandals saved yet</h2>
          <p className="text-xs text-brand-muted max-w-sm mx-auto leading-relaxed">
            Click the bookmark icon on any pandal card or detail page to add it to your custom festival plan.
          </p>
          <Link
            to="/siliguri-puja-pandals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-xs font-bold uppercase tracking-wider shadow-songi transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Pandals Now</span>
          </Link>
        </div>
      )}
    </div>
  );
}
