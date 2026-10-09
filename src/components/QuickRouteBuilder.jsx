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

  return (
    <div id="quick-route-builder" className="scroll-mt-24">
      <section
        aria-label="Smart Puja Route Planner"
        className="w-full bg-brand-card/95 rounded-3xl border border-brand-border/70 p-6 sm:p-8 md:p-10 shadow-songi transition-all max-w-4xl mx-auto"
      >
        {/* Header */}
        {showHeader && (
        <header className="space-y-1.5 pb-6 border-b border-brand-border/40">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-ink">
            Smart Puja Route Planner
          </h2>
          <p className="text-xs sm:text-sm text-brand-muted">
            Plan around your time, starting point and way of travelling.
          </p>
        </header>
        )}

        {/* Popular 1-tap routes */}
        <div className={`${showHeader ? 'py-5' : 'pb-5'} border-b border-brand-border/40`}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">
              POPULAR ROUTES
            </span>
            <span className="text-[11px] text-brand-muted/70 hidden sm:inline">
              1-tap instant circuits
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {popularRoutes.map((rt) => (
              <button
                key={rt.name}
                type="button"
                onClick={() => handleApplyPreset(rt)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-ivory hover:bg-white text-brand-primary border border-brand-border/80 hover:border-brand-vermilion/50 transition-all active:scale-95 shadow-2xs"
              >
                <span className="text-brand-primary font-bold">{rt.name}</span>
                <span className="text-brand-muted">·</span>
                <span className="text-brand-vermilion font-medium">{rt.time}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Wizard */}
        <form onSubmit={handleGenerateRoute} className="pt-6 space-y-7">
          {/* STEP 1: Starting point */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <span className="uppercase tracking-wider">STARTING POINT</span>
              </div>
              <span className="text-[11px] text-brand-muted font-bengali font-normal">
                শুরু কোথা থেকে?
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    requestUserLocation();
                    setStartingPoint(MY_LOCATION);
                  }}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-[0.99] shadow-2xs ${
                    startingPoint === MY_LOCATION
                      ? 'bg-brand-primary text-white border-brand-primary'
                      : 'bg-brand-ivory text-brand-primary border-brand-border/80 hover:bg-white hover:border-brand-primary/50'
                  }`}
                >
                  <Navigation className="w-4 h-4 text-brand-vermilion" />
                  <span>
                    {isLocating
                      ? 'Locating...'
                      : userLocation
                      ? '📍 Using Current GPS Location'
                      : '📍 Use my location'}
                  </span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {startingPoints.map((pt) => {
                  const selected = startingPoint === pt;
                  return (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setStartingPoint(pt)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                        selected
                          ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                          : 'shadow-2xs bg-brand-ivory/70 text-brand-primary border-brand-border/70 hover:bg-white hover:border-brand-border'
                      }`}
                    >
                      <span>{pt}</span>
                    </button>
                  );
                })}
                {showMoreStarts &&
                  AREA_STARTING_POINTS.map((pt) => {
                    const selected = startingPoint === pt.name;
                    return (
                      <button
                        key={pt.name}
                        type="button"
                        onClick={() => setStartingPoint(pt.name)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                          selected
                            ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                            : 'shadow-2xs bg-brand-ivory/70 text-brand-primary border-brand-border/70 hover:bg-white hover:border-brand-border'
                        }`}
                      >
                        {pt.name}
                      </button>
                    );
                  })}
              </div>
              <button
                type="button"
                onClick={() => setShowMoreStarts((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-vermilion hover:underline"
                aria-expanded={showMoreStarts}
              >
                {showMoreStarts ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{showMoreStarts ? 'Fewer starting points' : `More starting points (${AREA_STARTING_POINTS.length} areas)`}</span>
              </button>
            </div>
          </div>

          <div className="border-t border-brand-border/30" />

          {/* STEP 2: Travel Mode */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span className="uppercase tracking-wider">TRAVEL MODE</span>
              </div>
              <span className="text-[11px] text-brand-muted font-bengali font-normal">
                কীভাবে ঘুরবেন?
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'Walking', desc: 'Best for nearby clusters', icon: Footprints },
                { title: 'Bike / Scooty', desc: 'Fastest for covering zones', icon: Bike },
                { title: 'Car / Auto', desc: 'Parking-aware routes', icon: Car },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = travelMode === mode.title;
                return (
                  <button
                    key={mode.title}
                    type="button"
                    onClick={() => setTravelMode(mode.title)}
                    className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.99] flex items-center justify-between gap-3 shadow-2xs ${
                      isSelected
                        ? 'bg-brand-vermilion/10 border-brand-vermilion text-brand-primary ring-1 ring-brand-vermilion'
                        : 'bg-brand-ivory/60 border-brand-border/60 text-brand-primary hover:bg-white hover:border-brand-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-brand-vermilion text-white'
                            : 'bg-brand-card text-brand-muted border border-brand-border/60'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="block font-bold text-xs sm:text-sm text-brand-primary truncate">
                          {mode.title}
                        </span>
                        <span className="block text-[11px] text-brand-muted truncate">
                          {mode.desc}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-vermilion shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-brand-border/30" />

          {/* STEP 3: Time Available */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <span className="uppercase tracking-wider">TIME AVAILABLE</span>
              </div>
              <span className="text-xs font-bold text-brand-vermilion">
                {Math.floor(minutesAvailable / 60)}h {minutesAvailable % 60 ? `${minutesAvailable % 60}m` : ''}
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2">
                {[120, 180, 240, 300].map((mins) => {
                  const hours = mins / 60;
                  const selected = minutesAvailable === mins;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setMinutesAvailable(mins)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all text-center active:scale-95 ${
                        selected
                          ? 'bg-brand-primary text-white border-brand-primary shadow-xs'
                          : 'shadow-2xs bg-brand-ivory/70 text-brand-primary border-brand-border/70 hover:bg-white hover:border-brand-border'
                      }`}
                    >
                      {hours}h
                    </button>
                  );
                })}
              </div>

              <div className="pt-1">
                <input
                  type="range"
                  min="60"
                  max="420"
                  step="30"
                  value={minutesAvailable}
                  onChange={(e) => setMinutesAvailable(Number(e.target.value))}
                  className="w-full h-1.5 bg-brand-border/80 rounded-lg appearance-none cursor-pointer accent-brand-vermilion"
                  aria-label="Adjust available minutes"
                />
                <div className="flex justify-between text-[10px] text-brand-muted font-medium mt-1">
                  <span>1h</span>
                  <span>3h (Standard)</span>
                  <span>7h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-border/30" />

          {/* STEP 4: What do you want to see? */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-brand-primary">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-[11px] font-black flex items-center justify-center shrink-0">
                  4
                </span>
                <span className="uppercase tracking-wider">WHAT DO YOU WANT TO SEE?</span>
              </div>
              <span className="text-[11px] text-brand-muted font-bengali font-normal">
                পছন্দ কী?
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { title: 'Top Themes', desc: 'Best-rated / featured pandals', icon: Sparkles },
                { title: 'Maximum Pandals', desc: 'See the most venues possible', icon: Zap },
                { title: 'Traditional', desc: 'Heritage & classic pujas', icon: Compass },
                { title: 'Family Friendly', desc: 'Easier walking & lower crowd exposure', icon: Users },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = preference === item.title;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setPreference(item.title)}
                    className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.99] flex items-center gap-3 shadow-2xs ${
                      isSelected
                        ? 'bg-brand-vermilion/10 border-brand-vermilion text-brand-primary ring-1 ring-brand-vermilion font-bold'
                        : 'bg-brand-ivory/60 border-brand-border/60 text-brand-primary hover:bg-white hover:border-brand-border'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-brand-vermilion' : 'text-brand-muted'
                      }`}
                    />
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-brand-primary truncate">
                        {item.title}
                      </span>
                      <span className="block text-[11px] text-brand-muted truncate font-normal">
                        {item.desc}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-brand-vermilion ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Circular route toggle */}
          <div className="flex items-center justify-between py-2 text-xs">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-brand-vermilion shrink-0" />
              <span className="font-semibold text-brand-primary">Circular route (return to start)</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isCircular}
                onChange={(e) => setIsCircular(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-brand-border/80 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-vermilion" />
            </label>
          </div>

          {/* Submit button */}
          <div className="pt-2 space-y-2.5">
            {error && (
              <p role="alert" className="flex items-center gap-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}
            <button
              type="submit"
              disabled={isBuilding}
              className="w-full py-4 px-6 rounded-2xl bg-brand-vermilion hover:bg-brand-vermilion-hover disabled:opacity-80 text-white font-extrabold text-sm sm:text-base tracking-wide transition-all shadow-songi hover:shadow-songi-lg flex items-center justify-center gap-2 active:scale-[0.99] group"
            >
              {isBuilding ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>BUILDING YOUR ROUTE…</span>
                </>
              ) : (
                <>
                  <span>BUILD MY PUJA ROUTE</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-brand-muted">
              Verified coordinates • Open in Google Maps
            </p>
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
      </section>
    </div>
  );
}
