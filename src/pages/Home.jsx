import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Compass, ShieldCheck, MapPin, CheckCircle2, ArrowRight, 
  Calendar, Clock, Footprints, Bike, Car, Route, BookOpen, Star 
} from 'lucide-react';
import PandalCard from '../components/PandalCard';
import QuickRouteBuilder from '../components/QuickRouteBuilder';
import pandalsData from '../data/pandals.json';
import areasData from '../data/areas.json';
import eventsData from '../data/events.json';
import routesData from '../data/routes.json';
import guidesData from '../data/guides.json';

export default function Home() {
  // Target date for countdown (Mahalaya: Oct 10, 2026 04:00 AM)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-10-10T04:00:00+05:30').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredPandals = pandalsData
    .filter((p) => p.featured || Number(p.pujo_songi_score || 0) >= 9.5)
    .slice(0, 4);

  // Group areas into zones
  const zones = [
    { name: 'South-Central Siliguri', areas: 'Deshbandhupara, Subhas Pally, Babupara, Ashrampara', count: 28 },
    { name: 'Sevoke Road & Eastern Artery', areas: 'Haiderpara, Salugara, Punjabi Para, Ghogomali', count: 18 },
    { name: 'North & Junction Zone', areas: 'Champasari, Pradhannagar, Mallaguri, Central Colony', count: 22 },
    { name: 'Matigara & Western Suburbs', areas: 'Uttarayon, Matigara, Shiv Mandir', count: 15 },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-20">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 w-[28rem] h-[28rem] bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Central Pujo Pandal Festive Emblem from User Logo */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-brand-gold/90 shadow-songi-lg overflow-hidden bg-brand-maroon mx-auto transition-transform duration-300 group-hover:scale-105">
                <img
                  src="/logo-icon.png"
                  alt="Pujo Pandal"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-maroon border border-brand-gold text-amber-200 text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-md">
                ✤ Pujo Pandal ✤
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-card border border-brand-border shadow-songi text-xs font-semibold text-brand-primary">
            <span className="w-2 h-2 rounded-full bg-brand-vermilion animate-ping" />
            <span>Siliguri Durga Puja 2026</span>
            <span className="text-brand-border">•</span>
            <span className="text-brand-vermilion font-bengali font-normal">পুজো প্যান্ডেল</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-brand-primary leading-[1.12]">
              <span className="block text-lg xs:text-xl sm:text-2xl font-bold uppercase tracking-widest text-brand-vermilion mb-1">
                Siliguri Puja 2026
              </span>
              See more pandals. <br />
              <span className="text-brand-vermilion inline-block underline decoration-brand-gold/50 decoration-wavy decoration-2 underline-offset-8">
                Spend less time on the road.
              </span>
            </h1>

            <div className="pt-2 space-y-1">
              <p className="text-xl sm:text-2xl font-black text-brand-maroon font-bengali">
                পুজো ঘোরার সঙ্গী।
              </p>
              <p className="text-sm sm:text-base font-medium text-brand-muted font-bengali">
                আরও প্যান্ডেল দেখুন, কম সময় পথে কাটান।
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Discover Siliguri's Durga Puja pandals and build a smarter Puja plan around your time, travel mode and interests.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href="#quick-route-builder"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white font-bold text-sm uppercase tracking-wider shadow-vermilion-glow hover:shadow-songi-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200/50" />
              <span>BUILD MY PUJA</span>
            </a>

            <Link
              to="/siliguri-puja-pandals"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-card hover:bg-brand-ivory text-brand-primary border border-brand-border font-bold text-sm uppercase tracking-wider shadow-songi hover:border-brand-vermilion/50 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-brand-vermilion" />
              <span>EXPLORE PANDALS</span>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-brand-muted">
            <div className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Real Local Implementation</span>
            </div>
            <span className="text-brand-border">•</span>
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-vermilion" />
              <span>Siliguri Metropolitan Area</span>
            </div>
            <span className="text-brand-border">•</span>
            <div className="inline-flex items-center gap-1.5">
              <span className="font-semibold text-brand-primary">28 Neighborhoods</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS RIBBON / ANNOUNCEMENT */}
      <div className="max-w-4xl mx-auto -mt-6 md:-mt-10">
        <div className="bg-brand-card/95 backdrop-blur-md border border-brand-border rounded-2xl px-5 py-3.5 shadow-songi flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-brand-border/60">
          <div className="flex items-center gap-3 w-full md:w-auto pb-2 md:pb-0">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-primary block">
                83 verified pandals registered in database
              </span>
              <span className="text-[11px] text-brand-muted">
                83 total entries staged for Siliguri Durga Puja 2026
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-2 md:pt-0 md:pl-5">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bengali font-bold text-brand-vermilion">পুজো আসছে</span>
              <span className="text-brand-muted hidden sm:inline">•</span>
              <span className="text-brand-muted hidden sm:inline text-[11px]">
                Count down to the sacred dawn of Birendra Krishna Bhadra's Chandi Path.
              </span>
            </div>
            <Link
              to="/siliguri-puja-pandals"
              className="text-xs font-bold text-brand-vermilion hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK ROUTE BUILDER */}
      <QuickRouteBuilder />

      {/* FESTIVAL COUNTDOWN BANNER */}
      <div className="max-w-4xl mx-auto">
        <div className="w-full bg-gradient-to-r from-brand-maroon via-brand-maroon-dark to-brand-primary text-white rounded-3xl p-6 sm:p-8 shadow-songi flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-brand-gold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>Mahalaya Countdown • 4:00 AM Akashvani</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Siliguri Durga Puja 2026 Begins In
            </h3>
            <p className="text-xs text-white/70 font-bengali">
              মহালয়ার পুণ্য প্রভাতে বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ ও মহানন্দা ঘাটে তর্পণ
            </p>
          </div>

          {/* Time display */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Mins' },
              { val: timeLeft.seconds, label: 'Secs' },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 min-w-[54px] sm:min-w-[60px] border border-white/15"
              >
                <span className="text-xl sm:text-2xl font-black text-brand-gold font-mono">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-white/70">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURED PANDALS */}
      <section aria-label="Featured Pandals" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-vermilion uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Siliguri Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-primary">
              Featured Pandals
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Curated from the live database. Real committee records with traceability.
            </p>
          </div>

          <Link
            to="/siliguri-puja-pandals"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-vermilion hover:text-brand-vermilion-hover transition-colors self-start sm:self-auto"
          >
            <span>Explore All 83 Pandals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      </section>

      {/* EXPLORE BY ZONE */}
      <section aria-label="Explore Siliguri Zone by Zone" className="space-y-6">
        <div className="border-b border-brand-border pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-primary">
              Explore Siliguri Zone by Zone
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Plan your pandal hopping by neighborhood corridors to minimize transit congestion.
            </p>
          </div>
          <Link
            to="/areas"
            className="text-xs font-bold text-brand-vermilion hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>View All Areas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.name}
              className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-brand-vermilion uppercase tracking-wider block">
                  {zone.count} Pandals
                </span>
                <h3 className="text-base font-extrabold text-brand-primary">
                  {zone.name}
                </h3>
                <p className="text-xs text-brand-muted line-clamp-2">
                  {zone.areas}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60">
                <Link
                  to="/siliguri-puja-pandals"
                  className="text-xs font-bold text-brand-primary hover:text-brand-vermilion flex items-center justify-between"
                >
                  <span>Explore Pandals</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-vermilion" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POPULAR SMART ROUTES */}
      <section aria-label="Popular Smart Routes" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-vermilion uppercase tracking-wider mb-1">
              <Route className="w-3.5 h-3.5" />
              <span>Tested Local Circuits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-primary">
              Popular Smart Routes
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Handcrafted routes designed around real traffic diversions and road widths.
            </p>
          </div>

          <Link
            to="/siliguri-puja-routes"
            className="text-xs font-bold text-brand-vermilion hover:text-brand-vermilion-hover flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>All Smart Routes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routesData.map((route) => (
            <div
              key={route.id}
              className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi flex flex-col justify-between hover:border-brand-vermilion/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand-ivory font-bold text-brand-vermilion border border-brand-border/60">
                    {route.duration_str}
                  </span>
                  <span className="text-brand-muted font-medium">
                    {route.distance_km} • {route.travel_mode}
                  </span>
                </div>

                <h3 className="text-lg font-black text-brand-primary line-clamp-2">
                  {route.title}
                </h3>

                <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                  {route.description}
                </p>

                <div className="pt-2 text-xs text-brand-muted">
                  <span className="font-bold text-brand-primary block mb-1">Key Pandals:</span>
                  <span className="text-[11px] text-brand-primary/80">
                    {route.stopping_points.slice(0, 3).map(s => s.replace(/-/g, ' ')).join(' • ')}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                <Link
                  to={`/routes/${route.slug}`}
                  className="w-full py-2.5 rounded-xl bg-brand-ivory hover:bg-white border border-brand-border text-brand-primary text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>View Full Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-vermilion" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PUJA SCHEDULE 2026 PREVIEW */}
      <section aria-label="Festival Schedule" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-vermilion uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Bengal Almanac 1433</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-primary">
              Siliguri Puja Schedule 2026
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Verified dates from Bishuddho Siddhanto Panjika with local ritual timings.
            </p>
          </div>

          <Link
            to="/puja-schedule"
            className="text-xs font-bold text-brand-vermilion hover:text-brand-vermilion-hover flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Complete Schedule &amp; Rituals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {eventsData.map((ev) => (
            <div
              key={ev.id}
              className="bg-brand-card p-4 rounded-2xl border border-brand-border text-center shadow-songi flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-vermilion block">
                  {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
                <h3 className="text-sm font-black text-brand-primary mt-1">
                  {ev.event_name}
                </h3>
              </div>
              <p className="text-[11px] text-brand-muted mt-2 line-clamp-3">
                {ev.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GUIDES PREVIEW */}
      <section aria-label="Puja Guides" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-vermilion uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Expert Hopping Tips</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-brand-primary">
              Siliguri Puja Guides
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              Local advice on navigating police diversions, food stops, and avoiding crowd jams.
            </p>
          </div>

          <Link
            to="/guides"
            className="text-xs font-bold text-brand-vermilion hover:text-brand-vermilion-hover flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Read All Guides</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guidesData.slice(0, 3).map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="group bg-brand-card rounded-2xl border border-brand-border p-5 shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-brand-vermilion font-bold uppercase">
                    {guide.category}
                  </span>
                  <span className="text-brand-muted">{guide.read_time}</span>
                </div>
                <h3 className="text-base font-extrabold text-brand-primary group-hover:text-brand-vermilion transition-colors line-clamp-2">
                  {guide.title}
                </h3>
                <p className="text-xs text-brand-muted leading-relaxed line-clamp-3">
                  {guide.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs font-bold text-brand-vermilion">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
