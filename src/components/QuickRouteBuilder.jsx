import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation, Footprints, Bike, Car, Check, Sparkles, Zap,
  Compass, Users, RotateCcw, ArrowRight, MapPin, Clock, Bookmark, Share2, Loader2, Plus, Minus, AlertCircle, Route as RouteIcon
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import RouteMap from './RouteMap';
import {
  STARTING_POINTS, AREA_STARTING_POINTS, buildRoute, formatDuration, formatKm,
} from '../lib/routeEngine';

const MY_LOCATION = 'My Current Location';
const START_TIMES = [
  { label: '10 AM', min: 600 },
  { label: '4 PM', min: 960 },
  { label: '6 PM', min: 1080 },
  { label: '8 PM', min: 1200 },
];
const clockLabel = (dayMin) => {
  const m = ((Math.round(dayMin) % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  return `${((h + 11) % 12) + 1}:${mm} ${h < 12 ? 'AM' : 'PM'}`;
};

function StepTitle({ id, n, title, bn, aside }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 id={id} className="flex items-center gap-3 text-base sm:text-lg font-semibold text-brand-ink">
        <span className="w-8 h-8 rounded-full border-2 border-brand-crimson text-brand-crimson font-bengali-serif text-lg flex items-center justify-center leading-none pt-0.5">{n}</span>
        {title}
      </h3>
      {aside ?? <span className="font-bengali-serif text-sm text-brand-muted">{bn}</span>}
    </div>
  );
}

export default function QuickRouteBuilder({ showHeader = true }) {
  const { userLocation, requestUserLocation, isLocating, savedPandalIds, toggleSave } = usePlan();

  const [startingPoint, setStartingPoint] = useState('Sevoke More');
  const [showMoreStarts, setShowMoreStarts] = useState(false);
  const [travelMode, setTravelMode] = useState('Bike / Scooty');
  const [minutesAvailable, setMinutesAvailable] = useState(180);
  const [preference, setPreference] = useState('Top Themes');
  const [isCircular, setIsCircular] = useState(true);
  const [startTime, setStartTime] = useState(1080);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState(null);
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const [roadKm, setRoadKm] = useState(null);
  const resultRef = useRef(null);
  const pendingBuild = useRef(false);

  const startingPoints = STARTING_POINTS.map((p) => p.name);

  const popularRoutes = [
    { name: 'Central Heritage', time: '2.5h', start: 'Venus More', mode: 'Walking', pref: 'Traditional', minutes: 150 },
    { name: 'Sevoke Mega Themes', time: '3.5h', start: 'Sevoke More', mode: 'Bike / Scooty', pref: 'Top Themes', minutes: 210 },
    { name: 'South Siliguri', time: '3h', start: 'Siliguri Junction', mode: 'Car / Auto', pref: 'Family Friendly', minutes: 180 },
  ];

  const runBuild = (overrides = {}) => {
    const opts = {
      start: startingPoint, mode: travelMode, minutes: minutesAvailable, pref: preference, circular: isCircular, ...overrides,
    };
    const origin = opts.start === MY_LOCATION
      ? (userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null)
      : [...STARTING_POINTS, ...AREA_STARTING_POINTS].find((p) => p.name === opts.start);

    if (!origin) {
      if (isLocating) {
        // Build automatically as soon as the location arrives
        pendingBuild.current = true;
        setIsBuilding(true);
      } else {
        setError('Please allow location access, or pick a starting point.');
      }
      return;
    }
    setError(null);
    setIsBuilding(true);
    // Short pause so the button feedback is visible before the result appears
    setTimeout(() => {
      const route = buildRoute({
        origin,
        originName: opts.start === MY_LOCATION ? (userLocation?.isSimulated ? 'Siliguri centre (location unavailable)' : 'Your location') : opts.start,
        travelMode: opts.mode,
        minutes: opts.minutes,
        goal: opts.pref,
        circular: opts.circular,
        fromMyLocation: opts.start === MY_LOCATION && !userLocation?.isSimulated,
      });
      setRoadKm(null);
      setGeneratedRoute(route);
      setIsBuilding(false);
    }, 450);
  };

  useEffect(() => {
    if (pendingBuild.current && userLocation) {
      pendingBuild.current = false;
      runBuild();
    } else if (pendingBuild.current && !isLocating) {
      pendingBuild.current = false;
      setIsBuilding(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, isLocating]);

  // Bring the result into view once it is ready (important on phones)
  useEffect(() => {
    if (generatedRoute) resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [generatedRoute]);

  const handleApplyPreset = (preset) => {
    setStartingPoint(preset.start);
    setTravelMode(preset.mode);
    setPreference(preset.pref);
    setMinutesAvailable(preset.minutes);
    runBuild({ start: preset.start, mode: preset.mode, pref: preset.pref, minutes: preset.minutes });
  };

  const handleGenerateRoute = (e) => {
    e.preventDefault();
    runBuild();
  };

  const routePandals = useMemo(() => generatedRoute?.stops.map((s) => s.pandal) || [], [generatedRoute]);
  const allSaved = routePandals.length > 0 && routePandals.every((p) => savedPandalIds.includes(p.id));

  const saveAll = () => {
    routePandals.forEach((p) => {
      if (allSaved || !savedPandalIds.includes(p.id)) toggleSave(p.id);
    });
  };

  const shareRoute = () => {
    if (!generatedRoute) return;
    const text = `My Siliguri Puja route (${formatDuration(generatedRoute.totalMinutes)}, ${generatedRoute.stops.length} pandals):\n` +
      generatedRoute.stops.map((s, i) => `${i + 1}. ${s.pandal.name}`).join('\n');
    if (navigator.share) {
      navigator.share({ title: 'My Puja Route', text, url: generatedRoute.googleMapsUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${text}\n${generatedRoute.googleMapsUrl}`);
      alert('Route copied to clipboard!');
    }
  };

  const MODES = [
    { title: 'Walking', label: 'Walk', desc: 'Dense clusters', hint: '≈2.5 km', icon: Footprints },
    { title: 'Bike / Scooty', label: 'Bike', desc: 'Cross zones', hint: '≈8 km', icon: Bike },
    { title: 'Car / Auto', label: 'Car', desc: 'With parking', hint: '≈10 km', icon: Car },
  ];
  const GOALS = [
    { title: 'Top Themes', bn: 'সেরা থিম', desc: 'Best-rated installations', icon: Sparkles },
    { title: 'Maximum Pandals', bn: 'বেশি প্যান্ডেল', desc: 'As many as you can', icon: Zap },
    { title: 'Traditional', bn: 'সাবেকি', desc: 'Heritage & classic pujas', icon: Compass },
    { title: 'Family Friendly', bn: 'পরিবার', desc: 'Parking, shorter visits', icon: Users },
  ];
  const POPULAR_IMG = {
    'Central Heritage': '/images/routes/central-siliguri-heritage-walk.jpg',
    'Sevoke Mega Themes': '/images/routes/eastern-corridor-grand-themes.jpg',
    'South Siliguri': '/images/routes/north-junction-family-express.jpg',
  };
  const modeLabel = MODES.find((m) => m.title === travelMode)?.label || travelMode;
  const startLabel = startingPoint === MY_LOCATION ? 'My location' : startingPoint;
  const timeLabel = `${Math.floor(minutesAvailable / 60)}h${minutesAvailable % 60 ? ` ${minutesAvailable % 60}m` : ''}`;
  const chip = (selected) =>
    `h-10 px-4 rounded-full text-sm font-medium border transition-all active:scale-95 ${
      selected
        ? 'bg-brand-crimson text-white border-brand-crimson shadow-xs'
        : 'bg-brand-card text-brand-ink border-brand-border hover:border-brand-crimson/40'
    }`;

  return (
    <div id="quick-route-builder" className="scroll-mt-24">
      <section
        aria-label="Smart Puja Route Planner"
        className="relative w-full bg-brand-card rounded-[2rem] border border-brand-border shadow-songi max-w-4xl mx-auto overflow-hidden"
      >
        <div className="laal-paar-thin" aria-hidden="true" />
        <div className="p-5 sm:p-8 md:p-10">
          {showHeader && (
            <header className="pb-6">
              <p className="font-bengali-serif text-brand-crimson text-lg leading-none">রুট বানান</p>
              <h2 className="mt-1.5 text-[1.65rem] sm:text-3xl font-bold text-brand-ink">Smart Puja Route Planner</h2>
              <p className="text-sm text-brand-muted mt-1">Four quick choices — we pick and order the pandals for you.</p>
            </header>
          )}

          {/* Popular one-tap routes */}
          <div className="pb-7">
            <p className="text-sm font-semibold text-brand-ink mb-3">
              Popular routes <span className="font-normal text-brand-muted">· tap to build instantly</span>
            </p>
            <div className="rail -mx-5 px-5 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto">
              {popularRoutes.map((rt) => (
                <button
                  key={rt.name}
                  type="button"
                  onClick={() => handleApplyPreset(rt)}
                  className="group relative shrink-0 w-[62vw] xs:w-[48vw] sm:w-auto h-28 rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-transform"
                >
                  <img src={POPULAR_IMG[rt.name]} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <span className="absolute left-3 right-3 bottom-2.5 text-white">
                    <span className="block font-display text-base font-semibold leading-tight">{rt.name}</span>
                    <span className="block text-[11px] text-white/80 mt-0.5">{rt.time} · {rt.mode} · {rt.pref}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerateRoute} className="space-y-8 border-t border-brand-border pt-7">
            {/* 1 · Start */}
            <div role="group" aria-labelledby="step-start" className="space-y-3">
              <StepTitle id="step-start" n="১" title="Where do you start?" bn="শুরু কোথা থেকে?" />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    requestUserLocation();
                    setStartingPoint(MY_LOCATION);
                  }}
                  className={`${chip(startingPoint === MY_LOCATION)} inline-flex items-center gap-2`}
                >
                  <Navigation className="w-4 h-4" />
                  {isLocating ? 'Locating…' : userLocation ? 'My location' : 'Use my location'}
                </button>
                {startingPoints.map((pt) => (
                  <button key={pt} type="button" onClick={() => setStartingPoint(pt)} className={chip(startingPoint === pt)}>
                    {pt}
                  </button>
                ))}
                {showMoreStarts &&
                  AREA_STARTING_POINTS.map((pt) => (
                    <button key={pt.name} type="button" onClick={() => setStartingPoint(pt.name)} className={chip(startingPoint === pt.name)}>
                      {pt.name}
                    </button>
                  ))}
              </div>
              <button
                type="button"
                onClick={() => setShowMoreStarts((v) => !v)}
                className="inline-flex items-center gap-1 text-sm font-medium text-brand-crimson hover:underline underline-offset-4"
                aria-expanded={showMoreStarts}
              >
                {showMoreStarts ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showMoreStarts ? 'Fewer starting points' : `${AREA_STARTING_POINTS.length} more neighbourhoods`}
              </button>
            </div>

            {/* 2 · Mode */}
            <div role="group" aria-labelledby="step-mode" className="space-y-3">
              <StepTitle id="step-mode" n="২" title="How will you travel?" bn="কীভাবে ঘুরবেন?" />
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {MODES.map(({ title, label, desc, hint, icon: Icon }) => {
                  const on = travelMode === title;
                  return (
                    <button
                      key={title}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setTravelMode(title)}
                      className={`relative rounded-2xl border p-3 sm:p-4 text-center transition-all active:scale-[0.98] ${
                        on ? 'border-brand-crimson bg-brand-vermilion-light ring-1 ring-brand-crimson' : 'border-brand-border bg-brand-card hover:border-brand-crimson/40'
                      }`}
                    >
                      <span className={`mx-auto w-11 h-11 rounded-full flex items-center justify-center ${on ? 'bg-brand-crimson text-white' : 'bg-brand-paper text-brand-ink'}`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="block mt-2 text-sm font-semibold text-brand-ink">{label}</span>
                      <span className="block text-[11px] text-brand-muted leading-tight">{desc}</span>
                      <span className="hidden sm:block text-[11px] text-brand-crimson/80 mt-1">{hint} range</span>
                      {on && <Check className="absolute top-2 right-2 w-4 h-4 text-brand-crimson" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 · Time */}
            <div role="group" aria-labelledby="step-time" className="space-y-3">
              <StepTitle
                id="step-time"
                n="৩"
                title="How much time?"
                aside={<span className="font-display text-xl font-semibold text-brand-crimson">{timeLabel}</span>}
              />
              <div className="grid grid-cols-4 gap-1 p-1 rounded-full bg-brand-paper border border-brand-border">
                {[120, 180, 240, 300].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setMinutesAvailable(mins)}
                    className={`h-10 rounded-full text-sm font-semibold transition-all ${
                      minutesAvailable === mins ? 'bg-brand-card text-brand-crimson shadow-songi' : 'text-brand-ink/70 hover:text-brand-ink'
                    }`}
                  >
                    {mins / 60} hrs
                  </button>
                ))}
              </div>
              <input
                type="range"
                min="60"
                max="420"
                step="30"
                value={minutesAvailable}
                onChange={(e) => setMinutesAvailable(Number(e.target.value))}
                className="w-full accent-brand-crimson"
                aria-label="Fine-tune available time"
              />
              <div className="flex justify-between text-xs text-brand-muted -mt-1">
                <span>1 hr</span>
                <span>Drag to fine-tune</span>
                <span>7 hrs</span>
              </div>
            </div>

            {/* 4 · Goal */}
            <div role="group" aria-labelledby="step-goal" className="space-y-3">
              <StepTitle id="step-goal" n="৪" title="What do you want to see?" bn="পছন্দ কী?" />
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {GOALS.map(({ title, bn, desc, icon: Icon }) => {
                  const on = preference === title;
                  return (
                    <button
                      key={title}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setPreference(title)}
                      className={`relative rounded-2xl border p-3.5 sm:p-4 text-left transition-all active:scale-[0.98] ${
                        on ? 'border-brand-crimson bg-brand-vermilion-light ring-1 ring-brand-crimson' : 'border-brand-border bg-brand-card hover:border-brand-crimson/40'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${on ? 'text-brand-crimson' : 'text-brand-gold'}`} />
                      <span className="block mt-2 text-sm font-semibold text-brand-ink leading-tight">{title}</span>
                      <span className="block font-bengali-serif text-xs text-brand-crimson/80 mt-0.5">{bn}</span>
                      <span className="hidden sm:block text-xs text-brand-muted mt-1">{desc}</span>
                      {on && <Check className="absolute top-3 right-3 w-4 h-4 text-brand-crimson" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Round trip */}
            <label className="flex items-center justify-between gap-4 rounded-2xl bg-brand-paper border border-brand-border px-4 py-3 cursor-pointer">
              <span className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-brand-crimson" />
                <span>
                  <span className="block text-sm font-semibold text-brand-ink">Come back to the start</span>
                  <span className="block text-xs text-brand-muted">Round trip — handy if you parked or are staying nearby</span>
                </span>
              </span>
              <input type="checkbox" checked={isCircular} onChange={(e) => setIsCircular(e.target.checked)} className="sr-only peer" />
              <span className="relative w-12 h-7 shrink-0 rounded-full bg-brand-border peer-checked:bg-brand-crimson transition-colors after:absolute after:top-1 after:left-1 after:w-5 after:h-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-crimson" />
            </label>

            {error && (
              <p role="alert" className="flex items-center gap-2 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Sticky summary + build (stays in reach while scrolling the form on phones) */}
            <div className="sticky z-20 bottom-[calc(4.6rem+env(safe-area-inset-bottom,0px))] lg:bottom-4 -mx-2 sm:mx-0">
              <div className="flex items-center gap-3 rounded-2xl bg-brand-ink text-white p-2 pl-4 shadow-songi-lg">
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-sm font-semibold truncate">{startLabel} · {modeLabel} · {timeLabel}</p>
                  <p className="text-xs text-white/65 truncate">{preference} · {isCircular ? 'Round trip' : 'One way'}</p>
                </div>
                <button
                  type="submit"
                  disabled={isBuilding}
                  className="shrink-0 h-12 px-5 sm:px-7 rounded-xl bg-brand-crimson hover:bg-brand-vermilion-hover disabled:opacity-80 font-semibold text-[15px] inline-flex items-center gap-2 transition-colors active:scale-[0.98]"
                >
                  {isBuilding ? <Loader2 className="w-5 h-5 animate-spin" /> : <RouteIcon className="w-5 h-5" />}
                  {isBuilding ? 'Building…' : 'Build route'}
                </button>
              </div>
            </div>
          </form>

        {/* Generated route */}
        {generatedRoute && (
          <div ref={resultRef} className="scroll-mt-24 mt-8 pt-6 border-t border-brand-border space-y-5 animate-menu-in" aria-live="polite">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-vermilion text-white text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Your {generatedRoute.goal} route</span>
                </span>
                <h3 className="text-lg sm:text-xl font-black text-brand-primary mt-2 leading-snug">
                  From {generatedRoute.originName} • {generatedRoute.travelMode}
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  {generatedRoute.circular ? 'Returns to your starting point' : 'One-way route'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGeneratedRoute(null)}
                className="shrink-0 text-xs font-semibold text-brand-muted hover:text-brand-primary underline underline-offset-2 py-1"
              >
                Clear
              </button>
            </div>

            {generatedRoute.stops.length === 0 ? (
              <div className="rounded-2xl border border-brand-border bg-brand-ivory p-5 text-sm text-brand-primary">
                Not enough time to reach a pandal from here. Try adding more time or switching to a faster travel mode.
              </div>
            ) : (
              <>
                {/* Summary stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: 'Pandals', value: generatedRoute.stops.length },
                    { label: 'Total time', value: formatDuration(generatedRoute.totalMinutes) },
                    { label: roadKm ? 'Road distance' : 'Distance', value: formatKm(roadKm ?? generatedRoute.distanceKm) },
                    { label: 'On the road', value: formatDuration(generatedRoute.travelMinutes) },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl bg-brand-ivory border border-brand-border/70 px-3 py-2.5 text-center">
                      <div className="text-base sm:text-lg font-black text-brand-primary leading-tight">{s.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-brand-muted mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                {generatedRoute.budgetMin - generatedRoute.totalMinutes >= 30 && (
                  <p className="text-[11px] text-brand-muted bg-brand-vermilion-light/60 border border-brand-vermilion/15 rounded-lg px-3 py-2">
                    You'll have about <strong>{formatDuration(generatedRoute.budgetMin - generatedRoute.totalMinutes)}</strong> spare for food, queues or a bonus stop.
                  </p>
                )}

                <RouteMap
                  origin={generatedRoute.origin}
                  originName={generatedRoute.originName}
                  stops={routePandals}
                  circular={generatedRoute.circular}
                  travelMode={generatedRoute.travelMode}
                  onRoadDistance={setRoadKm}
                />

                {/* Start time */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-xs font-bold text-brand-primary flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-vermilion" /> Start at
                  </span>
                  <div className="flex gap-1.5">
                    {START_TIMES.map((t) => (
                      <button
                        key={t.min}
                        type="button"
                        onClick={() => setStartTime(t.min)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          startTime === t.min
                            ? 'bg-brand-primary text-white border-brand-primary'
                            : 'bg-brand-ivory text-brand-primary border-brand-border/70'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <ol className="relative space-y-0">
                  <li className="flex items-center gap-3 pb-3">
                    <span className="w-8 h-8 rounded-full bg-brand-gold text-brand-maroon-dark text-[11px] font-black flex items-center justify-center shrink-0 ring-4 ring-brand-card">S</span>
                    <div className="text-xs">
                      <span className="font-bold text-brand-primary">{generatedRoute.originName}</span>
                      <span className="text-brand-muted"> • leave {clockLabel(startTime)}</span>
                    </div>
                  </li>
                  {generatedRoute.stops.map((s, i) => (
                    <li key={s.pandal.id} className="relative pl-11 pb-3">
                      <span className="absolute left-[15px] -top-3 bottom-0 w-0.5 bg-brand-border" aria-hidden="true" />
                      <span className="absolute left-0 top-3 w-8 h-8 rounded-full bg-brand-crimson text-white text-xs font-black flex items-center justify-center ring-4 ring-brand-card">
                        {i + 1}
                      </span>
                      <p className="text-[11px] text-brand-muted pl-0.5 pb-1">
                        {travelMode === 'Walking' ? <Footprints className="inline w-3 h-3 mr-1" /> : travelMode === 'Car / Auto' ? <Car className="inline w-3 h-3 mr-1" /> : <Bike className="inline w-3 h-3 mr-1" />}
                        {formatKm(s.legKm)} • ~{s.legMin} min
                      </p>
                      <Link
                        to={`/pandals/${s.pandal.slug}`}
                        className="block rounded-xl border border-brand-border/70 bg-white hover:border-brand-vermilion/40 p-3 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="block text-sm font-bold text-brand-primary leading-snug">{s.pandal.name}</span>
                            <span className="block text-[11px] text-brand-muted truncate">{s.pandal.area_name} • {s.pandal.theme}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="block text-xs font-black text-brand-crimson">{clockLabel(startTime + s.arriveMin)}</span>
                            <span className="block text-[10px] text-brand-muted">stay ~{s.stayMin} min</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                  {generatedRoute.circular && (
                    <li className="relative pl-11">
                      <span className="absolute left-[15px] -top-3 h-3 w-0.5 bg-brand-border" aria-hidden="true" />
                      <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-brand-gold text-brand-maroon-dark text-[11px] font-black flex items-center justify-center ring-4 ring-brand-card">S</span>
                      <p className="text-xs pt-2 text-brand-muted">
                        Back at <span className="font-bold text-brand-primary">{generatedRoute.originName}</span> around {clockLabel(startTime + generatedRoute.totalMinutes)}
                      </p>
                    </li>
                  )}
                </ol>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <a
                    href={generatedRoute.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sm:col-span-3 h-12 rounded-xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-sm font-bold flex items-center justify-center gap-2 shadow-vermilion-glow transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Start Navigation in Google Maps</span>
                  </a>
                  <button
                    type="button"
                    onClick={saveAll}
                    className={`h-11 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                      allSaved ? 'bg-brand-vermilion-light border-brand-vermilion/30 text-brand-crimson' : 'bg-brand-card border-brand-border text-brand-primary hover:bg-brand-ivory'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${allSaved ? 'fill-brand-crimson' : ''}`} />
                    <span>{allSaved ? 'Saved to My Plan' : 'Save All Stops'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareRoute}
                    className="h-11 rounded-xl border border-brand-border bg-brand-card text-brand-primary hover:bg-brand-ivory text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Route</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('quick-route-builder')?.scrollIntoView({ behavior: 'smooth' })}
                    className="h-11 rounded-xl border border-brand-border bg-brand-card text-brand-primary hover:bg-brand-ivory text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <RouteIcon className="w-4 h-4" />
                    <span>Change Options</span>
                  </button>
                </div>
                <p className="text-[10px] text-brand-muted text-center leading-relaxed">
                  Times include ~12% festival traffic buffer{generatedRoute.travelMode !== 'Walking' ? ' and parking time' : ''}. Check police diversions on the day.
                </p>
              </>
            )}
          </div>
        )}
        </div>
      </section>
    </div>
  );
}
