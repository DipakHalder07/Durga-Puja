import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Navigation, Footprints, Bike, Car, Check, Sparkles, Zap,
  Compass, Users, RotateCcw, MapPin, Clock, Bookmark, Share2, Loader2, Plus, Minus, AlertCircle, Route as RouteIcon,
  ChevronUp, ChevronDown, Trash2, BadgeCheck, Undo2,
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import RouteMap from './RouteMap';
import { LotusSketch } from './BengalArt';
import {
  STARTING_POINTS, AREA_STARTING_POINTS, buildRoute, timeRoute, formatDuration, formatKm,
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

// One question card: Bengali numeral, plain-language question, Bengali sub-line
function QCard({ n, title, bn, children }) {
  return (
    <fieldset className="min-w-0 rounded-2xl border border-brand-border bg-brand-ivory/60 p-4 sm:p-5">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-start gap-3 mb-4" aria-hidden="true">
        <span className="font-bengali-serif text-3xl leading-none text-brand-crimson/85">{n}</span>
        <div className="min-w-0 pt-0.5">
          <p className="font-display text-h3 font-semibold text-brand-ink">{title}</p>
          <p className="font-bengali-serif text-sm text-brand-muted">{bn}</p>
        </div>
      </div>
      {children}
    </fieldset>
  );
}

// Timeline badges sit on a vertical rail; the ring masks the rail behind them
const RING = 'ring-4 ring-brand-card sm:ring-brand-ivory';
const MODE_ICONS = { Walking: Footprints, 'Bike / Scooty': Bike, 'Car / Auto': Car };

// Travel between two timeline points: "8 min · 1.2 km"
function Leg({ km, min, mode }) {
  const Icon = MODE_ICONS[mode] || Bike;
  return (
    <li className="flex items-center gap-3 py-2.5" aria-label={`${min} minutes, ${formatKm(km)}`}>
      <span className="w-10 shrink-0 flex justify-center" aria-hidden="true">
        <span className={`relative w-3 h-3 rounded-full bg-brand-gold ${RING}`} />
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-border bg-brand-card px-3 py-1 text-sm text-brand-muted" aria-hidden="true">
        <Icon className="w-4 h-4 text-brand-crimson" />
        <strong className="font-semibold text-brand-ink">{min} min</strong> · {formatKm(km)}
      </span>
    </li>
  );
}

function IconButton({ label, onClick, disabled, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-brand-muted transition-colors disabled:opacity-30 disabled:pointer-events-none ${
        danger ? 'hover:bg-rose-50 hover:text-rose-700' : 'hover:bg-brand-paper hover:text-brand-ink'
      }`}
    >
      {children}
    </button>
  );
}

export default function QuickRouteBuilder({ showHeader = true }) {
  const { userLocation, requestUserLocation, isLocating, savedPandalIds, toggleSave } = usePlan();

  const [startingPoint, setStartingPoint] = useState('Sevoke More');
  const [travelMode, setTravelMode] = useState('Bike / Scooty');
  const [minutesAvailable, setMinutesAvailable] = useState(180);
  const [preference, setPreference] = useState('Top Themes');
  const [isCircular, setIsCircular] = useState(true);
  const [startTime, setStartTime] = useState(1080);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState(null);
  const [generatedRoute, setGeneratedRoute] = useState(null);
  const [roadKm, setRoadKm] = useState(null);
  const [suggested, setSuggested] = useState(null); // the planner's original stop order
  const [focusIdx, setFocusIdx] = useState(null);
  const [lastRemoved, setLastRemoved] = useState(null);
  const resultRef = useRef(null);
  const mapBoxRef = useRef(null);
  const pendingBuild = useRef(false);
  const scrollToResult = useRef(false);

  const startingPoints = STARTING_POINTS.map((p) => p.name);

  const popularRoutes = [
    { name: 'Central Heritage', time: '2.5h', start: 'Venus More', mode: 'Walking', pref: 'Traditional', minutes: 150 },
    { name: 'Sevoke Mega Themes', time: '3.5h', start: 'Sevoke More', mode: 'Bike / Scooty', pref: 'Top Themes', minutes: 210 },
    { name: 'Family Express', time: '3h', start: 'Siliguri Junction', mode: 'Car / Auto', pref: 'Family Friendly', minutes: 180 },
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
      setSuggested(route.stops.map((s) => s.pandal));
      setFocusIdx(null);
      setLastRemoved(null);
      scrollToResult.current = true;
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

  // Bring a freshly built result into view (not after every edit)
  useEffect(() => {
    if (generatedRoute && scrollToResult.current) {
      scrollToResult.current = false;
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

  // Visitor edits: remove / reorder stops, then re-time the whole route
  const retime = (pandals) => {
    setGeneratedRoute((r) => timeRoute({ ...r, pandals }));
    setRoadKm(null);
    setFocusIdx(null);
  };
  const removeStop = (i) => {
    const list = [...routePandals];
    const [pandal] = list.splice(i, 1);
    setLastRemoved({ pandal, index: i });
    retime(list);
  };
  const undoRemove = () => {
    if (!lastRemoved) return;
    const list = [...routePandals];
    list.splice(Math.min(lastRemoved.index, list.length), 0, lastRemoved.pandal);
    setLastRemoved(null);
    retime(list);
  };
  const moveStop = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= routePandals.length) return;
    const list = [...routePandals];
    [list[i], list[j]] = [list[j], list[i]];
    setLastRemoved(null);
    retime(list);
  };
  const resetSuggested = () => {
    setLastRemoved(null);
    retime(suggested);
  };
  const edited = !!suggested && (suggested.length !== routePandals.length || suggested.some((p, i) => p.id !== routePandals[i]?.id));
  const overBy = generatedRoute ? generatedRoute.totalMinutes - generatedRoute.budgetMin : 0;

  // Card tap → highlight on the map (on phones, bring the map into view first)
  const focusStop = (i) => {
    setFocusIdx(i);
    const box = mapBoxRef.current;
    if (!box || window.matchMedia('(min-width: 1024px)').matches) return;
    const r = box.getBoundingClientRect();
    if (r.top < 64 || r.bottom > window.innerHeight) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  // Marker tap → highlight the card (desktop list sits beside the map)
  const selectFromMap = (i) => {
    setFocusIdx(i);
    if (window.matchMedia('(min-width: 1024px)').matches) {
      document.getElementById(`route-stop-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
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
    { title: 'Walking', label: 'Walk', icon: Footprints, hint: 'Best for nearby pandals' },
    { title: 'Bike / Scooty', label: 'Bike', icon: Bike, hint: 'Fastest across the city' },
    { title: 'Car / Auto', label: 'Car', icon: Car, hint: 'Picks pandals with parking' },
  ];
  const GOALS = [
    { title: 'Top Themes', bn: 'সেরা থিম', hint: 'Best-rated pandals', icon: Sparkles },
    { title: 'Maximum Pandals', bn: 'বেশি প্যান্ডেল', hint: 'See as many as possible', icon: Zap },
    { title: 'Traditional', bn: 'সাবেকি', hint: 'Classic & heritage pujas', icon: Compass },
    { title: 'Family Friendly', bn: 'পরিবার', hint: 'Easy for kids & elders', icon: Users },
  ];
  const hrs = (m) => {
    const h = Math.floor(m / 60);
    const half = m % 60 >= 30;
    return `${h}${half ? '½' : ''} ${h === 1 && !half ? 'hour' : 'hours'}`;
  };
  const mode = MODES.find((m) => m.title === travelMode) || MODES[1];
  const startLabel = startingPoint === MY_LOCATION ? 'My location' : startingPoint;
  // Rough guide shown under the time stepper
  const perStop = travelMode === 'Walking' ? 45 : travelMode === 'Car / Auto' ? 55 : 48;
  const approxPandals = Math.max(1, Math.floor(minutesAvailable / perStop));
  const changeTime = (d) => setMinutesAvailable((m) => Math.min(420, Math.max(60, m + d)));

  const choice = (on) =>
    `rounded-xl border-2 transition-colors active:scale-[0.98] ${
      on ? 'border-brand-crimson bg-brand-card text-brand-crimson shadow-songi' : 'border-brand-border bg-brand-card text-brand-ink hover:border-brand-crimson/40'
    }`;

  return (
    <div id="quick-route-builder" className="scroll-mt-24">
      <section
        aria-label="Smart Puja Route Planner"
        className="relative w-full bg-brand-card rounded-2xl border-x border-brand-border shadow-songi overflow-clip"
      >
        <div className="laal-paar-thin" aria-hidden="true" />
        <LotusSketch className="absolute right-5 top-6 w-14 h-10 text-brand-gold/50 pointer-events-none hidden sm:block" strokeWidth={1.6} />

        <div className="px-4 sm:px-8 lg:px-10 pt-6 sm:pt-8 pb-6 sm:pb-8">
          {showHeader && (
            <header className="mb-6 pr-16">
              <p className="font-bengali-serif text-brand-crimson text-lg sm:text-xl leading-none">রুট বানান</p>
              <h2 className="mt-2 text-h2 font-bold text-brand-ink">Smart Puja Route Planner</h2>
              <p className="text-base text-brand-muted mt-2">Answer four easy questions — we choose the pandals and put them in the best order.</p>
            </header>
          )}

          {/* Ready-made routes */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-semibold text-brand-ink mr-1">In a hurry? Try:</span>
            {popularRoutes.map((rt) => (
              <button
                key={rt.name}
                type="button"
                onClick={() => handleApplyPreset(rt)}
                className="h-10 px-4 rounded-full border border-brand-crimson/30 bg-brand-vermilion-light/60 text-sm font-medium text-brand-crimson hover:bg-brand-vermilion-light transition-colors"
              >
                {rt.name} · {rt.time}
              </button>
            ))}
          </div>

          <form onSubmit={handleGenerateRoute}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {/* 1 · Start */}
              <QCard n="১" title="Where do you start?" bn="শুরু কোথা থেকে?">
                <button
                  type="button"
                  onClick={() => {
                    requestUserLocation();
                    setStartingPoint(MY_LOCATION);
                  }}
                  className={`w-full h-14 px-4 flex items-center gap-3 text-left ${choice(startingPoint === MY_LOCATION)}`}
                >
                  <Navigation className="w-5 h-5 shrink-0" />
                  <span className="font-semibold">{isLocating ? 'Finding you…' : 'Use my location'}</span>
                  {startingPoint === MY_LOCATION && !isLocating && <Check className="w-5 h-5 ml-auto" />}
                </button>
                <p className="text-center text-sm text-brand-muted my-2.5">or choose a place</p>
                <label className="sr-only" htmlFor="start-select">Starting place</label>
                <div className="relative">
                  <select
                    id="start-select"
                    value={startingPoint === MY_LOCATION ? '' : startingPoint}
                    onChange={(e) => setStartingPoint(e.target.value)}
                    className={`w-full h-14 pl-4 pr-10 appearance-none font-semibold text-base cursor-pointer focus:outline-none ${choice(startingPoint !== MY_LOCATION)}`}
                  >
                    <option value="" disabled>Choose a place…</option>
                    <optgroup label="Popular landmarks">
                      {startingPoints.map((pt) => <option key={pt} value={pt}>{pt}</option>)}
                    </optgroup>
                    <optgroup label="Neighbourhoods">
                      {AREA_STARTING_POINTS.map((pt) => <option key={pt.name} value={pt.name}>{pt.name}</option>)}
                    </optgroup>
                  </select>
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-crimson pointer-events-none" />
                </div>
              </QCard>

              {/* 2 · Travel */}
              <QCard n="২" title="How will you travel?" bn="কীভাবে ঘুরবেন?">
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map(({ title, label, icon: Icon }) => (
                    <button
                      key={title}
                      type="button"
                      aria-pressed={travelMode === title}
                      onClick={() => setTravelMode(title)}
                      className={`h-[6.5rem] flex flex-col items-center justify-center gap-2 ${choice(travelMode === title)}`}
                    >
                      <Icon className="w-7 h-7" strokeWidth={1.8} />
                      <span className="text-base font-semibold">{label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-brand-muted text-center">{mode.hint}</p>
              </QCard>

              {/* 3 · Time */}
              <QCard n="৩" title="How much time?" bn="হাতে কতক্ষণ সময়?">
                <div className="flex items-center justify-between gap-2 rounded-xl bg-brand-card border-2 border-brand-crimson/20 p-2">
                  <button
                    type="button"
                    onClick={() => changeTime(-30)}
                    disabled={minutesAvailable <= 60}
                    aria-label="Less time"
                    className="w-12 h-12 rounded-full bg-brand-vermilion-light text-brand-crimson flex items-center justify-center disabled:opacity-40 active:scale-95"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <output aria-live="polite" className="text-center">
                    <span className="block font-display text-3xl font-semibold text-brand-ink leading-none">{hrs(minutesAvailable)}</span>
                  </output>
                  <button
                    type="button"
                    onClick={() => changeTime(30)}
                    disabled={minutesAvailable >= 420}
                    aria-label="More time"
                    className="w-12 h-12 rounded-full bg-brand-crimson text-white flex items-center justify-center disabled:opacity-40 active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-3 text-sm text-brand-muted text-center">
                  Enough for about <strong className="text-brand-ink">{approxPandals} pandal{approxPandals > 1 ? 's' : ''}</strong>
                </p>
              </QCard>

              {/* 4 · Goal */}
              <QCard n="৪" title="What do you want to see?" bn="পছন্দ কী?">
                <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
                  {GOALS.map(({ title, bn, hint, icon: Icon }) => (
                    <button
                      key={title}
                      type="button"
                      aria-pressed={preference === title}
                      onClick={() => setPreference(title)}
                      className={`min-h-[3.25rem] px-3 py-2 flex items-center gap-2.5 text-left ${choice(preference === title)}`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-tight">{title}</span>
                        <span className="block text-xs text-brand-muted leading-tight mt-0.5">
                          <span className="font-bengali-serif">{bn}</span>
                          <span className="hidden sm:inline"> · {hint}</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </QCard>
            </div>

            {error && (
              <p role="alert" className="mt-4 flex items-center gap-2 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            {/* Round trip (phones: in the flow; desktop: shown in the bar below) */}
            <label className="lg:hidden mt-5 flex items-center gap-3 rounded-xl border border-brand-border bg-brand-ivory/60 px-4 py-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isCircular}
                onChange={(e) => setIsCircular(e.target.checked)}
                className="w-6 h-6 rounded-md accent-brand-crimson shrink-0"
              />
              <span className="text-base text-brand-ink">
                Come back to where I started <span className="text-brand-muted">(round trip)</span>
              </span>
            </label>

            {/* Build — only the button sticks to the bottom on phones */}
            <div className="sticky lg:static z-20 bottom-[calc(4.6rem+env(safe-area-inset-bottom,0px))] -mx-4 sm:mx-0 px-4 sm:px-0 pt-5 pb-1 bg-gradient-to-t from-brand-card from-60% to-transparent lg:bg-none">
              <div className="flex items-center gap-6">
                <label className="hidden lg:flex items-center gap-3 cursor-pointer select-none flex-1">
                  <input
                    type="checkbox"
                    checked={isCircular}
                    onChange={(e) => setIsCircular(e.target.checked)}
                    className="w-6 h-6 rounded-md accent-brand-crimson shrink-0"
                  />
                  <span className="text-base text-brand-ink">
                    Come back to where I started <span className="text-brand-muted">(round trip)</span>
                  </span>
                </label>
                <p className="hidden lg:block text-sm text-brand-muted truncate max-w-xs">
                  {startLabel} · {mode.label} · {hrs(minutesAvailable)} · {preference}
                </p>
                <button
                  type="submit"
                  disabled={isBuilding}
                  className="w-full lg:w-auto lg:min-w-[16rem] h-14 px-8 rounded-full bg-brand-crimson hover:bg-brand-vermilion-hover disabled:opacity-80 text-white font-semibold text-base inline-flex items-center justify-center gap-2 transition-colors active:scale-[0.99] shadow-vermilion-glow"
                >
                  {isBuilding ? <Loader2 className="w-5 h-5 animate-spin" /> : <RouteIcon className="w-5 h-5" />}
                  {isBuilding ? 'Building your route…' : 'Show my route'}
                </button>
              </div>
            </div>
          </form>

        {/* Generated route */}
        {generatedRoute && (
          <div ref={resultRef} className="scroll-mt-24 mt-8 pt-8 border-t border-brand-border space-y-6 animate-menu-in">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-vermilion text-white text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your {generatedRoute.goal} route</span>
                </span>
                <h3 className="font-display text-xl sm:text-2xl leading-tight font-semibold text-brand-ink mt-3">
                  From {generatedRoute.originName} • {generatedRoute.travelMode}
                </h3>
                <p className="text-sm text-brand-muted mt-1">
                  {generatedRoute.circular ? 'Returns to your starting point' : 'One-way route'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGeneratedRoute(null)}
                className="shrink-0 min-h-10 px-2 text-sm font-semibold text-brand-muted hover:text-brand-primary underline underline-offset-2"
              >
                Clear
              </button>
            </div>

            {generatedRoute.stops.length === 0 ? (
              <div className="rounded-2xl border border-brand-border bg-brand-ivory p-5 sm:p-6 space-y-4">
                <p className="text-base text-brand-ink">
                  {suggested?.length
                    ? 'You removed every stop from this route.'
                    : 'Not enough time to reach a pandal from here. Try adding more time or switching to a faster travel mode.'}
                </p>
                {suggested?.length > 0 && (
                  <button type="button" onClick={resetSuggested} className="h-11 px-5 rounded-full bg-brand-crimson text-white text-sm font-semibold inline-flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Bring back the suggested route
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Summary */}
                <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border">
                  {[
                    { label: 'Pandals', value: generatedRoute.stops.length },
                    { label: 'Total time', value: formatDuration(generatedRoute.totalMinutes) },
                    { label: roadKm ? 'Road distance' : 'Distance', value: formatKm(roadKm ?? generatedRoute.distanceKm) },
                    { label: 'On the road', value: formatDuration(generatedRoute.travelMinutes) },
                  ].map((s) => (
                    <div key={s.label} className="bg-brand-ivory px-4 py-3.5 sm:px-5">
                      <dt className="text-xs text-brand-muted">{s.label}</dt>
                      <dd className="font-display text-xl sm:text-2xl font-semibold text-brand-ink leading-tight mt-1">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                {overBy > 5 ? (
                  <p className="flex items-start gap-2 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>About <strong>{formatDuration(overBy)}</strong> longer than the {hrs(generatedRoute.budgetMin)} you have. Remove a stop to fit.</span>
                  </p>
                ) : -overBy >= 30 ? (
                  <p className="text-sm text-brand-muted bg-brand-vermilion-light/60 border border-brand-vermilion/15 rounded-xl px-4 py-3">
                    You'll have about <strong className="text-brand-ink">{formatDuration(-overBy)}</strong> spare for food, queues or a bonus stop.
                  </p>
                ) : null}

                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-8 items-start">
                  {/* Map */}
                  <div ref={mapBoxRef} className="scroll-mt-24 lg:sticky lg:top-24">
                    <RouteMap
                      origin={generatedRoute.origin}
                      originName={generatedRoute.originName}
                      stops={routePandals}
                      circular={generatedRoute.circular}
                      travelMode={generatedRoute.travelMode}
                      onRoadDistance={setRoadKm}
                      focusIndex={focusIdx}
                      onSelect={selectFromMap}
                      title="Your route map"
                      className="h-80 sm:h-[26rem] lg:h-[34rem]"
                    />
                  </div>

                  {/* Stop-by-stop plan */}
                  <section aria-label="Stop-by-stop plan" className="sm:rounded-2xl sm:border sm:border-brand-border sm:bg-brand-ivory sm:p-5">
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-brand-border">
                      <div>
                        <h4 className="font-display text-h3 font-semibold text-brand-ink">Stop-by-stop plan</h4>
                        <p className="text-sm text-brand-muted mt-0.5">Tap a stop to see it on the map</p>
                      </div>
                      {edited && (
                        <button type="button" onClick={resetSuggested} className="shrink-0 min-h-10 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-crimson hover:underline underline-offset-4">
                          <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                      )}
                    </div>

                    <div className="pt-4">
                      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink">
                        <Clock className="w-4 h-4 text-brand-vermilion" /> Leave at
                      </p>
                      <div className="mt-2.5 grid grid-cols-4 gap-2">
                      {START_TIMES.map((t) => (
                        <button
                          key={t.min}
                          type="button"
                          aria-pressed={startTime === t.min}
                          onClick={() => setStartTime(t.min)}
                          className={`h-10 rounded-full text-sm font-semibold border transition-colors ${
                            startTime === t.min ? 'bg-brand-ink text-white border-brand-ink' : 'bg-brand-card text-brand-ink border-brand-border hover:border-brand-ink/40'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                      </div>
                    </div>

                    {lastRemoved && (
                      <div role="status" className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-brand-ink text-white pl-4 pr-2 py-2 text-sm animate-menu-in">
                        <span className="min-w-0 truncate">Removed <strong className="font-semibold">{lastRemoved.pandal.name}</strong></span>
                        <button type="button" onClick={undoRemove} className="shrink-0 h-9 px-3 rounded-lg font-semibold text-brand-gold-light hover:bg-white/10 inline-flex items-center gap-1.5">
                          <Undo2 className="w-4 h-4" /> Undo
                        </button>
                      </div>
                    )}

                    <ol className="relative mt-5 before:absolute before:left-[19px] before:top-5 before:bottom-5 before:w-0.5 before:bg-brand-border">
                      {/* Start */}
                      <li className="flex items-center gap-3">
                        <span className={`relative shrink-0 w-10 h-10 rounded-full bg-brand-maroon-dark text-brand-gold-light text-sm font-bold flex items-center justify-center ${RING}`}>S</span>
                        <div className="flex-1 min-w-0 rounded-xl border border-brand-border bg-brand-card px-4 py-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="eyebrow text-brand-muted">Start</p>
                            <p className="font-semibold text-brand-ink truncate mt-1">{generatedRoute.originName}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-brand-paper border border-brand-border px-2.5 py-1 text-xs font-medium text-brand-ink">
                            Leave {clockLabel(startTime)}
                          </span>
                        </div>
                      </li>

                      {generatedRoute.stops.map((s, i) => {
                        const p = s.pandal;
                        const active = focusIdx === i;
                        return (
                          <React.Fragment key={p.id}>
                            <Leg km={s.legKm} min={s.legMin} mode={generatedRoute.travelMode} />
                            <li id={`route-stop-${i}`} className="flex items-start gap-3 scroll-mt-28">
                              <button
                                type="button"
                                onClick={() => focusStop(i)}
                                aria-label={`Show stop ${i + 1}, ${p.name}, on the map`}
                                className={`relative shrink-0 w-10 h-10 mt-3 rounded-full text-sm font-bold tabular-nums flex items-center justify-center transition-colors ${RING} ${
                                  active ? 'bg-brand-gold text-brand-maroon-dark' : 'bg-brand-crimson text-white'
                                }`}
                              >
                                {String(i + 1).padStart(2, '0')}
                              </button>
                              <div
                                onClick={() => focusStop(i)}
                                className={`flex-1 min-w-0 rounded-xl border bg-brand-card p-3.5 sm:p-4 cursor-pointer transition-all ${
                                  active ? 'border-brand-crimson shadow-songi-lg' : 'border-brand-border hover:border-brand-crimson/40 hover:shadow-songi'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="font-display text-lg font-semibold leading-snug text-brand-ink">
                                      <Link
                                        to={`/pandals/${p.slug}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="hover:text-brand-crimson hover:underline underline-offset-4 decoration-brand-crimson/40"
                                      >
                                        {p.name}
                                      </Link>
                                      {p.verified && <BadgeCheck className="inline-block w-4 h-4 ml-1.5 -mt-0.5 text-emerald-600" aria-label="Verified" />}
                                    </p>
                                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-brand-muted">
                                      <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-crimson" />{p.area_name}</span>
                                      <span className="inline-flex items-center gap-1" title="Pandal score">
                                        <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                                        <strong className="font-semibold text-brand-ink">{p.pujo_songi_score}</strong>
                                      </span>
                                    </p>
                                  </div>
                                  <div className="shrink-0 text-right">
                                    <p className="text-xs text-brand-muted">Arrive</p>
                                    <p className="text-base font-bold text-brand-crimson tabular-nums leading-tight">{clockLabel(startTime + s.arriveMin)}</p>
                                  </div>
                                </div>
                                {p.theme && <p className="mt-2 text-sm italic text-brand-ink/70 truncate">“{p.theme}”</p>}
                                <div className="mt-3 pt-3 border-t border-brand-border/70 flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-paper border border-brand-border px-2.5 py-1 text-xs font-medium text-brand-ink whitespace-nowrap">
                                    <Clock className="w-3.5 h-3.5 text-brand-crimson" /> {s.stayMin} min visit
                                  </span>
                                  <div className="ml-auto flex items-center" onClick={(e) => e.stopPropagation()}>
                                    <IconButton label={`Move ${p.name} earlier`} disabled={i === 0} onClick={() => moveStop(i, -1)}>
                                      <ChevronUp className="w-5 h-5" />
                                    </IconButton>
                                    <IconButton label={`Move ${p.name} later`} disabled={i === generatedRoute.stops.length - 1} onClick={() => moveStop(i, 1)}>
                                      <ChevronDown className="w-5 h-5" />
                                    </IconButton>
                                    <IconButton label={`Remove ${p.name} from route`} danger onClick={() => removeStop(i)}>
                                      <Trash2 className="w-[1.125rem] h-[1.125rem]" />
                                    </IconButton>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </React.Fragment>
                        );
                      })}

                      {/* Finish */}
                      {generatedRoute.returnLeg && <Leg km={generatedRoute.returnLeg.legKm} min={generatedRoute.returnLeg.legMin} mode={generatedRoute.travelMode} />}
                      <li className={`flex items-center gap-3 ${generatedRoute.returnLeg ? '' : 'pt-4'}`}>
                        <span className={`relative shrink-0 w-10 h-10 rounded-full bg-brand-ink text-white flex items-center justify-center ${RING}`}>
                          <Check className="w-5 h-5" />
                        </span>
                        <div className="flex-1 min-w-0 rounded-xl border border-brand-border bg-brand-card px-4 py-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="eyebrow text-brand-muted">{generatedRoute.circular ? 'Back to start' : 'Finish'}</p>
                            <p className="font-semibold text-brand-ink truncate mt-1">
                              {generatedRoute.circular ? generatedRoute.originName : routePandals[routePandals.length - 1].name}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-medium text-emerald-800">
                            Done {clockLabel(startTime + generatedRoute.totalMinutes)}
                          </span>
                        </div>
                      </li>
                    </ol>

                    {/* Actions */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <a
                        href={generatedRoute.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm:col-span-3 min-h-[3.25rem] rounded-xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-base font-semibold flex items-center justify-center gap-2 shadow-vermilion-glow transition-colors"
                      >
                        <Navigation className="w-5 h-5" />
                        <span>Start navigation in Google Maps</span>
                      </a>
                      <button
                        type="button"
                        onClick={saveAll}
                        className={`h-12 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                          allSaved ? 'bg-brand-vermilion-light border-brand-vermilion/30 text-brand-crimson' : 'bg-brand-card border-brand-border text-brand-ink hover:bg-brand-paper'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${allSaved ? 'fill-brand-crimson' : ''}`} />
                        <span>{allSaved ? 'Saved to my plan' : 'Save all stops'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={shareRoute}
                        className="h-12 rounded-xl border border-brand-border bg-brand-card text-brand-ink hover:bg-brand-paper text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share route</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => document.getElementById('quick-route-builder')?.scrollIntoView({ behavior: 'smooth' })}
                        className="h-12 rounded-xl border border-brand-border bg-brand-card text-brand-ink hover:bg-brand-paper text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        <RouteIcon className="w-4 h-4" />
                        <span>Change options</span>
                      </button>
                    </div>
                    <p className="mt-4 text-xs text-brand-muted text-center">
                      Times include ~12% festival traffic buffer{generatedRoute.travelMode !== 'Walking' ? ' and parking time' : ''}. Check police diversions on the day.
                    </p>
                  </section>
                </div>
              </>
            )}
          </div>
        )}
        </div>
        <div className="laal-paar-thin -scale-y-100" aria-hidden="true" />
      </section>
    </div>
  );
}
