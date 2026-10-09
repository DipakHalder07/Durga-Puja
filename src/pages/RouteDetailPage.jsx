import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Footprints, Bike, Car, Navigation, Bookmark, ChevronRight, Lightbulb, Route as RouteIcon } from 'lucide-react';
import routesData from '../data/routes.json';
import pandalsData from '../data/pandals.json';
import RouteMap from '../components/RouteMap';
import { estimateCircuit, formatDuration, formatKm, TRAVEL_MODES, distanceKm } from '../lib/routeEngine';
import SmartImage from '../components/SmartImage';
import { routeImage, pandalImage } from '../lib/images';
import { usePlan } from '../context/PlanContext';
import { useSeo } from '../lib/seo';
import { DhunuchiSketch, LaalPaar } from '../components/BengalArt';

export default function RouteDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const route = routesData.find((r) => r.slug === slug);

  if (!route) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-brand-primary">Route Not Found</h2>
        <Link
          to="/siliguri-puja-routes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-vermilion text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Routes</span>
        </Link>
      </div>
    );
  }

  return <RouteDetail route={route} navigate={navigate} />;
}

const pandalMap = Object.fromEntries(pandalsData.map((p) => [p.slug, p]));

const MODE_ICON = { Walking: Footprints, 'Bike / Scooty': Bike, 'Car / Auto': Car };

function RouteDetail({ route, navigate }) {
  const { savedPandalIds, toggleSave } = usePlan();
  const stops = useMemo(() => route.stopping_points.map((sSlug) => pandalMap[sSlug]).filter(Boolean), [route]);
  const est = estimateCircuit(stops, route.travel_mode);
  const origin = useMemo(() => (stops[0] ? { lat: stops[0].latitude, lng: stops[0].longitude } : null), [stops]);
  const routeRest = useMemo(() => stops.slice(1), [stops]);
  const mode = TRAVEL_MODES[route.travel_mode] || TRAVEL_MODES['Bike / Scooty'];
  const ModeIcon = MODE_ICON[route.travel_mode] || RouteIcon;
  const allSaved = stops.length > 0 && stops.every((p) => savedPandalIds.includes(p.id));
  const others = routesData.filter((r) => r.slug !== route.slug);

  useSeo({
    title: `${route.title} – Siliguri Puja Route 2026`,
    description: route.description.slice(0, 160),
    path: `/routes/${route.slug}`,
    image: routeImage(route.slug),
  });

  const legKm = (a, b) =>
    distanceKm({ lat: a.latitude, lng: a.longitude }, { lat: b.latitude, lng: b.longitude }) * mode.roadFactor;

  return (
    <div className="space-y-10 sm:space-y-12 pb-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-muted">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-brand-crimson">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="mx-1 text-brand-border">|</span>
        <Link to="/siliguri-puja-routes" className="hover:text-brand-crimson">Smart routes</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-brand-ink truncate">{route.short_title || route.title}</span>
      </nav>

      {/* Banner */}
      <header className="relative overflow-hidden rounded-[2rem] bg-brand-maroon text-white shadow-songi-lg">
        <SmartImage src={routeImage(route.slug)} alt={route.title} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-maroon-dark via-brand-maroon-dark/70 to-brand-maroon-dark/10" />
        <div className="relative px-5 sm:px-10 pt-40 sm:pt-56 pb-7 sm:pb-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-semibold">
            <ModeIcon className="w-3.5 h-3.5" /> {route.travel_mode} · Curated circuit
          </span>
          {route.title_bengali && <p className="mt-3 font-bengali-serif text-lg sm:text-xl text-brand-gold-light">{route.title_bengali}</p>}
          <h1 className="mt-1 text-[2rem] leading-[1.1] sm:text-5xl font-bold">{route.title}</h1>
          <p className="mt-3 text-white/85 text-[15px] sm:text-base leading-relaxed">{route.description}</p>
        </div>
        <LaalPaar style={{ backgroundColor: '#FAF5EB' }} className="-scale-y-100 relative" />
      </header>

      {/* Stats + actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-stretch">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border">
          {[
            ['Pandals', stops.length],
            ['Total time', est ? formatDuration(est.totalMinutes) : route.duration_str],
            ['Distance', est ? formatKm(est.distanceKm) : route.distance_km],
            ['Traffic buffer', est ? `+${est.bufferMinutes} min` : '—'],
          ].map(([k, v]) => (
            <div key={k} className="bg-brand-card px-4 py-3.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">{k}</dt>
              <dd className="font-display text-2xl font-semibold text-brand-ink mt-0.5">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:w-60">
          {est?.googleMapsUrl && (
            <a
              href={est.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 lg:h-full rounded-2xl bg-brand-crimson hover:bg-brand-vermilion-hover text-white font-semibold inline-flex items-center justify-center gap-2 shadow-vermilion-glow transition-colors"
            >
              <Navigation className="w-4 h-4" /> Start navigation
            </a>
          )}
          <button
            type="button"
            onClick={() => stops.forEach((p) => (allSaved || !savedPandalIds.includes(p.id)) && toggleSave(p.id))}
            className={`h-12 lg:h-full rounded-2xl border font-semibold inline-flex items-center justify-center gap-2 transition-colors ${
              allSaved ? 'bg-brand-vermilion-light border-brand-crimson/30 text-brand-crimson' : 'bg-brand-card border-brand-border text-brand-ink hover:border-brand-crimson/40'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${allSaved ? 'fill-brand-crimson' : ''}`} /> {allSaved ? 'Saved' : 'Save all'}
          </button>
        </div>
      </div>

      {/* Map + timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-start">
        {origin && stops.length > 1 && (
          <div className="lg:sticky lg:top-28">
            <RouteMap origin={origin} originName={stops[0].name} stops={routeRest} startLabel="1" numberOffset={1} travelMode={route.travel_mode} className="h-80 sm:h-[28rem]" />
          </div>
        )}

        <section aria-label="Circuit stops">
          <p className="font-bengali-serif text-brand-crimson">যাত্রাপথ</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-ink mt-1">Stops in order</h2>
          <ol className="mt-5">
            {stops.map((p, i) => (
              <li key={p.id} className="relative pl-12 pb-2">
                <span className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-brand-border" aria-hidden="true" />
                <span className="absolute left-0 top-3 w-8 h-8 rounded-full bg-brand-crimson text-white text-sm font-bold flex items-center justify-center ring-4 ring-brand-ivory">
                  {i + 1}
                </span>
                {i > 0 && (
                  <p className="text-xs text-brand-muted pb-1.5 pl-0.5 flex items-center gap-1">
                    <ModeIcon className="w-3.5 h-3.5" /> {formatKm(legKm(stops[i - 1], p))} from previous stop
                  </p>
                )}
                <Link to={`/pandals/${p.slug}`} className="group flex gap-3 rounded-2xl border border-brand-border bg-brand-card p-3 hover:border-brand-crimson/40 hover:shadow-songi transition-all">
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-brand-maroon">
                    <SmartImage src={pandalImage(p)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold text-brand-ink leading-snug group-hover:text-brand-crimson">{p.name}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{p.area_name} · {p.category} · ★ {p.pujo_songi_score}</p>
                    {p.theme && <p className="text-sm text-brand-ink/75 mt-1 line-clamp-1 italic">“{p.theme}”</p>}
                    <p className="text-xs text-brand-muted mt-1 inline-flex items-center gap-1"><Clock className="w-3 h-3" /> ~{p.estimated_visit_minutes} min visit</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Tips */}
      {route.tips?.length > 0 && (
        <section className="relative overflow-hidden rounded-2xl border border-brand-gold/40 bg-[#FDF6E7] p-6 sm:p-8">
          <DhunuchiSketch className="absolute right-2 bottom-0 w-20 h-28 text-brand-gold/40" />
          <p className="flex items-center gap-2 font-display text-xl font-semibold text-brand-ink">
            <Lightbulb className="w-5 h-5 text-brand-gold" /> Local tips for this circuit
          </p>
          <ul className="mt-4 space-y-2.5 max-w-2xl">
            {route.tips.map((tip, i) => (
              <li key={i} className="relative pl-6 text-[15px] text-brand-ink/85">
                <span className="absolute left-0 top-[0.55em] w-2 h-2 rotate-45 bg-brand-crimson/80" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Other circuits */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-ink">More circuits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {others.map((r) => (
            <Link key={r.slug} to={`/routes/${r.slug}`} className="group flex gap-3 rounded-2xl border border-brand-border bg-brand-card p-3 hover:border-brand-crimson/40 transition-colors">
              <div className="w-24 h-20 shrink-0 rounded-xl overflow-hidden bg-brand-maroon">
                <SmartImage src={routeImage(r.slug)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-brand-ink leading-snug group-hover:text-brand-crimson">{r.title}</p>
                <p className="text-xs text-brand-muted mt-1">{r.travel_mode} · {r.stopping_points.length} pandals</p>
              </div>
            </Link>
          ))}
        </div>
        <Link to="/siliguri-puja-routes#quick-route-builder" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-crimson">
          <MapPin className="w-4 h-4" /> Or build your own route
        </Link>
      </section>
    </div>
  );
}
