import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Sparkles, Clock, Ban, Check, Bookmark, 
  ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2, Navigation, Share2 
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import pandalsData from '../data/pandals.json';
import SmartImage from '../components/SmartImage';
import { pandalImage } from '../lib/images';

export default function PandalDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave } = usePlan();

  const pandal = pandalsData.find((p) => p.slug === slug);

  if (!pandal) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-brand-primary">Pandal Not Found</h2>
        <p className="text-sm text-brand-muted">
          The requested Durga Puja pandal could not be found in the 2026 registry.
        </p>
        <Link
          to="/siliguri-puja-pandals"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-vermilion text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Pandals</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(pandal.id);

  // Nearby pandals in same area
  const nearbyPandals = pandalsData
    .filter((p) => p.area_slug === pandal.area_slug && p.id !== pandal.id)
    .slice(0, 3);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${pandal.latitude},${pandal.longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pandal.name} — Siliguri Durga Puja 2026`,
        text: `Check out ${pandal.name} in ${pandal.area_name} on Pujo Songi!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-brand-muted">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-brand-primary">Home</Link>
          <span>/</span>
          <Link to="/siliguri-puja-pandals" className="hover:text-brand-primary">Pandals</Link>
          <span>/</span>
          <span className="text-brand-primary truncate max-w-[150px]">{pandal.name}</span>
        </div>
      </div>

      {/* Pandal Header Hero Banner */}
      <div className="bg-brand-card rounded-3xl border border-brand-border shadow-songi overflow-hidden">
      <SmartImage
        src={pandalImage(pandal)}
        alt={`${pandal.name} — ${pandal.theme || pandal.category}`}
        className="w-full h-52 sm:h-72 md:h-80 object-cover"
        wrapperClassName="relative bg-brand-maroon"
        loading="eager"
      >
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/50 text-white/90 text-[10px] font-medium backdrop-blur-sm">
          Illustrative image
        </span>
      </SmartImage>
      <div className="p-6 sm:p-8 md:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-ivory border border-brand-border text-xs font-bold text-brand-vermilion">
                <MapPin className="w-3.5 h-3.5" />
                <Link to={`/areas/${pandal.area_slug}`} className="hover:underline">
                  {pandal.area_name}
                </Link>
                <span>•</span>
                <span>{pandal.zone}</span>
              </span>

              {pandal.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified 2026</span>
                </span>
              )}

              <span className="px-2.5 py-1 rounded-full bg-brand-ivory text-xs font-medium text-brand-muted border border-brand-border/60">
                {pandal.category}
              </span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-brand-primary tracking-tight">
              {pandal.name}
            </h1>

            {pandal.theme && (
              <div className="text-sm xs:text-base sm:text-lg font-bold text-brand-maroon">
                Theme: <span className="text-brand-primary font-normal">{pandal.theme}</span>
              </div>
            )}
          </div>

          {/* Score & Rating Panel */}
          <div className="flex flex-wrap sm:flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 w-full md:w-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-center bg-brand-maroon text-[#FFFBF5] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-brand-gold fill-brand-gold/40" />
                  <span className="text-lg sm:text-xl font-black">{pandal.pujo_songi_score || '9.5'}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                  Pandal Score
                </span>
              </div>

              <div className="text-center bg-brand-ivory border border-brand-border px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-black text-lg sm:text-xl">
                  <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-500 text-amber-500" />
                  <span>{pandal.rating || '4.9'}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] text-brand-muted tracking-wider block">
                  {pandal.rating_count || 500}+ ratings
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => toggleSave(pandal.id)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                  saved
                    ? 'bg-brand-vermilion text-white border-brand-vermilion'
                    : 'bg-brand-card text-brand-primary border-brand-border hover:bg-brand-ivory'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-brand-card text-brand-primary border border-brand-border hover:bg-brand-ivory text-xs transition-all active:scale-95 shadow-xs"
                title="Share pandal"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Extensive details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme & Architectural Concept */}
          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-3">
            <h2 className="text-lg font-black text-brand-primary uppercase tracking-wide">
              Theme &amp; Architectural Concept
            </h2>
            <p className="text-sm text-brand-primary/90 leading-relaxed">
              {pandal.description}
            </p>
          </div>

          {/* Visitor Transit & Crowd Guide */}
          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-4">
            <h2 className="text-lg font-black text-brand-primary uppercase tracking-wide">
              Visitor Transit &amp; Crowd Guide
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-brand-ivory border border-brand-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                  <Clock className="w-4 h-4 text-brand-vermilion" />
                  <span>Estimated Visit Duration</span>
                </div>
                <p className="text-sm font-semibold text-brand-maroon">
                  ~{pandal.estimated_visit_minutes || 30} minutes
                </p>
                <p className="text-[11px] text-brand-muted">
                  Includes queue wait, inner sanctum darshan, and idol viewing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-ivory border border-brand-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                  {pandal.parking_available ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Ban className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Parking Status</span>
                </div>
                <p className="text-sm font-semibold text-brand-primary">
                  {pandal.parking_available ? 'Designated Parking Hub Available' : 'Strict Pedestrian No-Parking Zone'}
                </p>
                <p className="text-[11px] text-brand-muted">
                  {pandal.parking_notes || 'Park at designated peripheral parking stands.'}
                </p>
              </div>
            </div>

            {pandal.access_notes && (
              <div className="p-4 rounded-xl bg-amber-50/60 border border-brand-gold/40 text-xs space-y-1">
                <span className="font-bold text-brand-primary block">Pedestrian Access Corridor:</span>
                <p className="text-brand-muted">{pandal.access_notes}</p>
              </div>
            )}
          </div>

          {/* Administrative Details */}
          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-4">
            <h2 className="text-lg font-black text-brand-primary uppercase tracking-wide">
              Administrative &amp; Committee Records
            </h2>

            <div className="divide-y divide-brand-border/60 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-brand-muted">Committee Name:</span>
                <span className="font-bold text-brand-primary text-right">{pandal.committee_name || pandal.name}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-brand-muted">Official Venue:</span>
                <span className="font-bold text-brand-primary text-right">{pandal.venue_name_2026 || pandal.address_2026}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-brand-muted">Locality &amp; Ward:</span>
                <span className="font-bold text-brand-primary text-right">{pandal.area_name}, Siliguri</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-brand-muted">Geocoding Verification:</span>
                <span className="font-bold text-emerald-700 text-right">{pandal.coordinate_status || 'VERIFIED_2026'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-brand-muted">Verification Source:</span>
                <span className="font-bold text-brand-primary text-right">{pandal.coordinate_source || 'Municipal Records'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Directions & Map & Nearby */}
        <div className="space-y-6">
          {/* Interactive Google Map Location Preview (No Key Needed!) */}
          <div className="bg-brand-card rounded-2xl border border-brand-border p-4 shadow-songi space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-vermilion" />
                <span>Google Maps View</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified GPS
              </span>
            </div>

            <div className="rounded-xl overflow-hidden border border-brand-border/80 h-56 w-full bg-brand-ivory">
              <iframe
                title={`Google Map for ${pandal.name}`}
                src={`https://maps.google.com/maps?q=${pandal.latitude},${pandal.longitude}&hl=en&z=16&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-songi transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>

            <div className="text-[11px] text-brand-muted text-center pt-0.5 font-mono">
              GPS: {pandal.latitude}, {pandal.longitude}
            </div>
          </div>

          {/* Nearby Pandals in this Area */}
          {nearbyPandals.length > 0 && (
            <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-4">
              <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider">
                More in {pandal.area_name}
              </h3>

              <div className="space-y-3">
                {nearbyPandals.map((np) => (
                  <Link
                    key={np.id}
                    to={`/pandals/${np.slug}`}
                    className="block p-3 rounded-xl bg-brand-ivory hover:bg-white border border-brand-border hover:border-brand-vermilion/40 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-primary truncate mr-2">{np.name}</span>
                      <span className="font-bold text-brand-maroon shrink-0">★ {np.rating}</span>
                    </div>
                    {np.theme && (
                      <p className="text-[11px] text-brand-muted line-clamp-1 mt-1">{np.theme}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky actions: always one tap away while scrolling */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <div className="lg:hidden fixed inset-x-0 z-30 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] px-3 pb-2">
        <div className="max-w-md mx-auto flex items-center gap-2 p-2 rounded-2xl bg-brand-card/95 backdrop-blur-md border border-brand-border shadow-songi-lg">
          <button
            type="button"
            onClick={() => toggleSave(pandal.id)}
            aria-pressed={saved}
            className={`flex-1 h-12 rounded-xl inline-flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-95 ${
              saved
                ? 'bg-brand-vermilion-light text-brand-crimson border border-brand-vermilion/30'
                : 'bg-brand-ivory text-brand-primary border border-brand-border'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-crimson' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share pandal"
            className="h-12 w-12 shrink-0 rounded-xl inline-flex items-center justify-center bg-brand-ivory text-brand-primary border border-brand-border active:scale-95"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[1.6] h-12 rounded-xl inline-flex items-center justify-center gap-2 bg-brand-crimson text-white text-sm font-bold shadow-vermilion-glow active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
}
