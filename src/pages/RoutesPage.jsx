import React from 'react';
import { Link } from 'react-router-dom';
import {
  Route, Footprints, Bike, Car, ArrowRight, Sparkles, MapPin, Home as HomeIcon, ChevronRight,
  Filter, Timer, Siren, Trophy, Layers, Bookmark, BookOpen,
} from 'lucide-react';
import QuickRouteBuilder from '../components/QuickRouteBuilder';
import routesData from '../data/routes.json';
import pandalsData from '../data/pandals.json';
import SmartImage from '../components/SmartImage';
import { routeImage } from '../lib/images';
import { estimateCircuit, formatDuration, formatKm } from '../lib/routeEngine';
import { usePlan } from '../context/PlanContext';
import PageHeader from '../components/PageHeader';

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

function SectionTitle({ eyebrow, title, sub }) {
  return (
    <div className="space-y-1">
      {eyebrow && <span className="text-[11px] font-bold uppercase tracking-wider text-brand-vermilion">{eyebrow}</span>}
      <h2 className="text-xl sm:text-2xl font-black text-brand-primary tracking-tight">{title}</h2>
      {sub && <p className="text-sm text-brand-muted leading-relaxed max-w-2xl">{sub}</p>}
    </div>
  );
}

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
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wide">
            Curated circuit
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-card/95 text-brand-primary text-[11px] font-bold">
            <ModeIcon className="w-3 h-3 text-brand-vermilion" />
            {MODE_SHORT[route.travel_mode] || route.travel_mode}
          </span>
        </div>
        <button
          type="button"
          onClick={saveCircuit}
          aria-pressed={allSaved}
          aria-label={allSaved ? 'Remove circuit pandals from saved plan' : 'Save all circuit pandals'}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center border shadow-xs transition-all active:scale-90 ${
            allSaved ? 'bg-brand-crimson text-white border-brand-crimson' : 'bg-brand-card/95 text-brand-primary border-brand-border'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${allSaved ? 'fill-white' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-lg font-black text-brand-primary leading-snug">{route.title}</h3>
          {route.title_bengali && <p className="text-sm font-semibold text-brand-vermilion font-bengali mt-0.5">{route.title_bengali}</p>}
          <p className="text-xs text-brand-muted leading-relaxed mt-2 line-clamp-3">{route.description}</p>
        </div>

        <dl className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Stops', value: `${stops.length} Pandals` },
            { label: 'Duration', value: est ? formatDuration(est.totalMinutes) : route.duration_str },
            { label: 'Distance', value: est ? formatKm(est.distanceKm) : route.distance_km },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-brand-ivory border border-brand-border/70 py-2 px-1">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">{s.label}</dt>
              <dd className="text-sm font-black text-brand-primary mt-0.5">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="space-y-1.5 text-xs">
          <p className="flex gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0 mt-px" />
            <span><strong className="text-brand-primary">Highlight:</strong> <span className="text-brand-muted">{route.highlight}</span></span>
          </p>
          <p className="flex gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-vermilion shrink-0 mt-px" />
            <span><strong className="text-brand-primary">Focus:</strong> <span className="text-brand-muted">{route.focus}</span></span>
          </p>
        </div>

        <ol className="space-y-1 text-xs border-t border-brand-border/60 pt-3">
          {stops.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-brand-vermilion-light text-brand-crimson text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
              <Link to={`/pandals/${p.slug}`} className="font-semibold text-brand-primary hover:text-brand-vermilion truncate">{p.name}</Link>
            </li>
          ))}
        </ol>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-brand-border/60">
          {est && <span className="text-[11px] text-brand-muted">+{est.bufferMinutes} min traffic buffer</span>}
          <Link
            to={`/routes/${route.slug}`}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-brand-crimson text-white text-xs font-bold hover:bg-brand-vermilion-hover transition-colors"
          >
            View Circuit
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function RoutesPage() {
  return (
    <div className="space-y-12 sm:space-y-16 pb-8">
      <div className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-brand-muted">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-brand-primary">
            <HomeIcon className="w-3.5 h-3.5" /> Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-primary font-semibold">Siliguri Puja Routes 2026</span>
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
      <section className="space-y-5">
        <SectionTitle
          title="How Smart Routes Work"
          sub="Every route is calculated from verified Siliguri pandal coordinates — not a fixed list."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="bg-brand-card rounded-2xl border border-brand-border p-5 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-brand-vermilion-light text-brand-crimson font-black flex items-center justify-center">{i + 1}</span>
                <h3 className="text-base font-extrabold text-brand-primary">{step.title}</h3>
              </div>
              <p className="text-sm text-brand-muted leading-relaxed mt-3">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Travel modes & goals */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <SectionTitle title="Travel Modes & Neighbourhoods" />
          {TRAVEL_TIPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-brand-card rounded-2xl border border-brand-border p-4 shadow-2xs">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-brand-crimson">
                <Icon className="w-4 h-4" /> {title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-1.5">{text}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <SectionTitle title="Choosing Your Goal" />
          {GOALS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-brand-card rounded-2xl border border-brand-border p-4 shadow-2xs">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-brand-primary">
                <Icon className="w-4 h-4 text-brand-gold" /> {title}
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed mt-1.5">{text}</p>
            </div>
          ))}
          <div className="rounded-2xl bg-gradient-to-br from-brand-maroon to-brand-crimson text-white p-5 shadow-songi">
            <p className="text-sm font-bold">Tip: start before 6 PM</p>
            <p className="text-xs text-white/80 leading-relaxed mt-1">
              Roads around Venus More, Sevoke Road and Hill Cart Road get busiest from 7 PM to midnight on Saptami–Navami.
            </p>
          </div>
        </div>
      </section>

      {/* Curated circuits */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <SectionTitle
            title="Curated Siliguri Puja Circuits"
            sub="Tested routes across major Siliguri Puja sectors, ready for pandal hopping."
          />
          <Link to="/guides/siliguri-pandal-hopping-guide" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-vermilion hover:underline shrink-0">
            <BookOpen className="w-4 h-4" /> Read Pandal Hopping Guide
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {routesData.map((route) => (
            <CircuitCard key={route.id} route={route} />
          ))}
        </div>
      </section>
    </div>
  );
}
