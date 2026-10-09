import React from 'react';
import { Link } from 'react-router-dom';
import {
  Route, Footprints, Bike, Car, ArrowRight, Sparkles, MapPin, Home as HomeIcon, ChevronRight,
  Filter, Timer, Siren, Trophy, Layers, Bookmark,
} from 'lucide-react';
import QuickRouteBuilder from '../components/QuickRouteBuilder';
import routesData from '../data/routes.json';
import pandalsData from '../data/pandals.json';
import SmartImage from '../components/SmartImage';
import { routeImage } from '../lib/images';
import { estimateCircuit, formatDuration, formatKm } from '../lib/routeEngine';
import { usePlan } from '../context/PlanContext';
import PageHeader, { SectionHeading } from '../components/PageHeader';
import { DhakSketch } from '../components/BengalArt';
import { useSeo } from '../lib/seo';
import { breadcrumbs, itemList } from '../lib/schema';

const pandalMap = Object.fromEntries(pandalsData.map((p) => [p.slug, p]));

const MODE_ICON = { Walking: Footprints, 'Bike / Scooty': Bike, 'Car / Auto': Car };
const MODE_SHORT = { Walking: 'Walking', 'Bike / Scooty': 'Bike', 'Car / Auto': 'Car' };

const HOW_IT_WORKS = [
  {
    icon: Filter,
    title: 'Candidate Selection',
    text: 'From your starting point, travel mode and goal, the planner picks verified pandals within a practical distance — about 2.5 km on foot, 8 km by bike and 10 km by car.',
  },
  {
    icon: Timer,
    title: 'Transit & Viewing Time',
    text: 'Each leg is timed for your travel mode with a festival-traffic buffer and parking time, plus 20–45 minutes of viewing per pandal, so the plan fits your time.',
  },
  {
    icon: Siren,
    title: 'Smart Ordering',
    text: 'Stops are ordered to avoid back-and-forth trips, and you can open the whole route in Google Maps for live traffic, police diversions and one-way roads.',
  },
];

const TRAVEL_TIPS = [
  {
    icon: Footprints,
    title: 'Walking Routes (Recommended)',
    text: 'Ideal for tight neighbourhood clusters like Babupara, Deshbandhupara and Central Colony. Walking bypasses vehicle barricades and gives you the most flexibility.',
  },
  {
    icon: Bike,
    title: 'Two-Wheeler / Bike',
    text: 'The fastest way to jump between distant hubs like Hakimpara and Champasari. Park at peripheral bays before entering narrow pandal lanes.',
  },
  {
    icon: Car,
    title: 'Car / 4-Wheeler',
    text: 'Best for early daylight hops (3 PM – 5 PM) or outer circuits (Fulbari / Bagdogra). Avoid central junctions during peak evening hours.',
  },
];

const GOALS = [
  {
    icon: Trophy,
    title: '“Top Themes” goal',
    text: 'Prioritises the highest-rated theme, heritage and award-winning pandals, and gives you more viewing time at the big installations.',
  },
  {
    icon: Layers,
    title: '“Maximum Pandals” goal',
    text: 'Keeps stops tightly clustered and visits shorter, so you can see as many pandals as possible in your time.',
  },
];

function CircuitCard({ route }) {
  const { savedPandalIds, toggleSave } = usePlan();
  const stops = route.stopping_points.map((slug) => pandalMap[slug]).filter(Boolean);
  const est = estimateCircuit(stops, route.travel_mode);
  const ModeIcon = MODE_ICON[route.travel_mode] || Route;
  const allSaved = stops.length > 0 && stops.every((p) => savedPandalIds.includes(p.id));

  const saveCircuit = () =>
    stops.forEach((p) => {
      if (allSaved || !savedPandalIds.includes(p.id)) toggleSave(p.id);
    });

  return (
    <article className="bg-brand-card rounded-2xl border border-brand-border shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/40 transition-all overflow-hidden flex flex-col">
      <div className="relative bg-brand-maroon">
        <SmartImage src={routeImage(route.slug)} alt={route.title} className="w-full h-40 object-cover" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
            Curated
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-card/95 text-brand-primary text-xs font-semibold">
            <ModeIcon className="w-3.5 h-3.5 text-brand-vermilion" />
            {MODE_SHORT[route.travel_mode] || route.travel_mode}
          </span>
        </div>
        <button
          type="button"
          onClick={saveCircuit}
          aria-pressed={allSaved}
          aria-label={allSaved ? 'Remove circuit pandals from saved plan' : 'Save all circuit pandals'}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center border shadow-xs transition-all active:scale-90 ${allSaved ? 'bg-brand-crimson text-white border-brand-crimson' : 'bg-brand-card/95 text-brand-primary border-brand-border'
            }`}
        >
          <Bookmark className={`w-4 h-4 ${allSaved ? 'fill-white' : ''}`} />
        </button>
      </div>

      <div className="p-5 sm:p-6 flex flex-col gap-5 flex-1">
        <div>
          {route.title_bengali && <p className="font-bengali-serif text-brand-crimson">{route.title_bengali}</p>}
          <h3 className="font-display text-h3 font-semibold text-brand-ink mt-1">{route.title}</h3>
          <p className="text-sm text-brand-muted mt-2 line-clamp-3">{route.description}</p>
        </div>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Stops', value: `${stops.length} pandals` },
            { label: 'Duration', value: est ? formatDuration(est.totalMinutes) : route.duration_str },
            { label: 'Distance', value: est ? formatKm(est.distanceKm) : route.distance_km },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-brand-ivory border border-brand-border/70 py-2.5 px-1">
              <dt className="text-xs text-brand-muted">{s.label}</dt>
              <dd className="text-base font-semibold text-brand-ink mt-0.5">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-2 text-sm">
          <p className="flex gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
            <span><strong className="text-brand-primary">Highlight:</strong> <span className="text-brand-muted">{route.highlight}</span></span>
          </p>
          <p className="flex gap-1.5">
            <MapPin className="w-4 h-4 text-brand-vermilion shrink-0 mt-0.5" />
            <span><strong className="text-brand-primary">Focus:</strong> <span className="text-brand-muted">{route.focus}</span></span>
          </p>
        </div>

        <ol className="space-y-2 text-sm border-t border-brand-border/60 pt-4">
          {stops.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-vermilion-light text-brand-crimson text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <Link to={`/pandals/${p.slug}`} className="font-semibold text-brand-primary hover:text-brand-vermilion truncate">{p.name}</Link>
            </li>
          ))}
        </ol>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-brand-border/60">
          {est && <span className="text-xs text-brand-muted">+{est.bufferMinutes} min traffic buffer</span>}
          <Link
            to={`/routes/${route.slug}`}
            className="inline-flex items-center gap-1.5 h-11 px-5 rounded-full bg-brand-crimson text-white text-sm font-semibold hover:bg-brand-vermilion-hover transition-colors"
          >
            View circuit
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function RoutesPage() {
  useSeo({
    title: 'Siliguri Puja Routes 2026 – Pandal Hopping Route Planner',
    description: 'Plan Durga Puja 2026 pandal hopping in Siliguri: pick a start point, walk, bike or car and your time, and get an ordered route with map and Google Maps navigation.',
    path: '/siliguri-puja-routes',
    image: '/images/photos/lights-temple.webp',
    imageAlt: 'Lit-up Durga Puja pandal at night',
    jsonLd: [
      breadcrumbs([['Home', '/'], ['Siliguri Puja routes', '/siliguri-puja-routes']]),
      itemList('Curated Siliguri Durga Puja routes 2026', routesData.map((r) => ({ name: r.title, path: `/routes/${r.slug}` }))),
    ],
  });
  return (
    <div className="space-y-section">
      <div className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-brand-muted">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand-primary">
            <HomeIcon className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-primary font-medium truncate">Siliguri Puja Routes 2026</span>
        </nav>
        <PageHeader
          bn="স্মার্ট রুট"
          kicker="Route planner"
          title="Siliguri Puja Routes 2026"
          description="See more pandals and spend less time stuck in traffic. The planner uses real pandal coordinates, travel times for your mode and viewing time to design your circuit."
          photo="lights-temple"
        />
      </div>

      <QuickRouteBuilder />

      {/* How it works */}
      <section className="space-y-content">
        <SectionHeading
          bn="কীভাবে কাজ করে"
          title="How smart routes work"
          sub="Every route is calculated from verified Siliguri pandal coordinates — not a fixed list."
        />
        <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <span className="hidden md:block absolute top-10 left-[16%] right-[16%] border-t-2 border-dashed border-brand-crimson/25" aria-hidden="true" />
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl border border-brand-border bg-brand-card p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <span className="relative z-10 w-14 h-14 shrink-0 rounded-full bg-brand-crimson text-white font-bengali-serif text-3xl flex items-center justify-center ring-4 ring-brand-ivory">
                  {['১', '২', '৩'][i]}
                </span>
                <h3 className="font-display text-h3 font-semibold text-brand-ink">{step.title}</h3>
              </div>
              <p className="text-base text-brand-muted mt-4">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Travel modes & goals */}
      <section className="space-y-content">
        <SectionHeading
          bn="যাতায়াত"
          title="Pick the right way to travel"
          sub="Each mode suits a different part of the city — and a different goal."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {TRAVEL_TIPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className={`rounded-2xl border p-5 sm:p-6 ${i === 0 ? 'bg-brand-vermilion-light border-brand-crimson/25' : 'bg-brand-card border-brand-border'}`}>
              <span className={`w-11 h-11 rounded-full flex items-center justify-center ${i === 0 ? 'bg-brand-crimson text-white' : 'bg-brand-paper text-brand-crimson'}`}>
                <Icon className="w-5 h-5" />
              </span>
              <h3 className="font-display text-h3 font-semibold text-brand-ink mt-4">{title}</h3>
              <p className="text-base text-brand-muted mt-2">{text}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.1fr] gap-4 sm:gap-6">
          {GOALS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-brand-border bg-brand-card p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-display text-h3 font-semibold text-brand-ink">
                <Icon className="w-5 h-5 text-brand-gold" /> {title}
              </h3>
              <p className="text-base text-brand-muted mt-2">{text}</p>
            </div>
          ))}
          <div className="relative overflow-hidden rounded-2xl bg-brand-crimson text-white p-5 sm:p-6">
            <DhakSketch className="absolute -right-3 -bottom-3 w-24 h-24 text-white/15" />
            <p className="font-bengali-serif text-brand-gold-light">টিপস</p>
            <p className="font-display text-h3 font-semibold mt-1">Start before 6 PM</p>
            <p className="text-base text-white/85 mt-2 pr-10">
              Venus More, Sevoke Road and Hill Cart Road are busiest from 7 PM to midnight on Saptami–Navami.
            </p>
          </div>
        </div>
      </section>

      {/* Curated circuits */}
      <section className="space-y-content">
        <SectionHeading
          bn="চেনা পথ"
          title="Curated Siliguri Puja circuits"
          sub="Tested routes across the main Puja sectors, ready for pandal hopping."
          to="/blog/durga-puja-pandal-map-2026-walking-routes"
          linkLabel="Walking routes guide"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {routesData.map((route) => (
            <CircuitCard key={route.id} route={route} />
          ))}
        </div>
      </section>
    </div>
  );
}
