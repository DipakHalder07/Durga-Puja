import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ArrowRight, TrainFront, Plane, Car, Clock, Sparkles } from 'lucide-react';
import PandalCard from '../components/PandalCard';
import Breadcrumbs from '../components/Breadcrumbs';
import Faq from '../components/Faq';
import { PandalsMap } from '../components/Maps';
import areasData from '../data/areas.json';
import { useSeo } from '../lib/seo';
import { breadcrumbs, itemList, faqPage } from '../lib/schema';
import { areaStats, nearestAreas, landmarkDistances, kmLabel, joinNames } from '../lib/geo';
import { formatDuration } from '../lib/routeEngine';
import NotFoundPage from './NotFoundPage';

const LANDMARK_ICON = { njp: TrainFront, junction: TrainFront, airport: Plane };
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

function areaFaqs(a, top, nearby, hubs) {
  const njp = hubs.find((h) => h.key === 'njp');
  const junction = hubs.find((h) => h.key === 'junction');
  return [
    {
      q: `How many Durga Puja pandals are there in ${a.name} in 2026?`,
      a: `${a.name} has ${plural(a.count, 'pandal')} on the Siliguri Durga Puja 2026 map: ${joinNames(a.pandals.map((p) => `[${p.name}](/pandals/${p.slug})`))}.`,
    },
    {
      q: `Which is the best pandal in ${a.name}?`,
      a: `${top.name} has the highest pandal score in ${a.name} (${top.pujo_songi_score}/10)${top.theme ? `, with the 2026 theme “${top.theme}”` : ''}.`,
    },
    {
      q: `Is there parking near the ${a.name} pandals?`,
      a: a.parking === 0
        ? `None of the ${a.name} pandals has dedicated parking — they are walk-in only, so park on a main road and walk in, or come by toto or auto.`
        : a.parking === a.count
          ? `Yes — ${a.count === 1 ? 'the pandal has' : `all ${a.count} pandals have`} parking nearby. Arrive before 6 PM on Saptami to Navami, when spaces fill up.`
          : `${a.parking} of the ${a.count} pandals have parking nearby; the rest are walk-in only. Park once and walk between them.`,
    },
    {
      q: `How far is ${a.name} from NJP and Siliguri Junction?`,
      a: `The ${a.name} pandals are about ${kmLabel(njp.km)} from New Jalpaiguri (NJP) station and ${kmLabel(junction.km)} from Siliguri Junction in a straight line. Roads add roughly a quarter more.`,
    },
    {
      q: `Which areas are near ${a.name} for pandal hopping?`,
      a: `${joinNames(nearby.slice(0, 3).map((n) => `[${n.name}](/areas/${n.slug}) (${kmLabel(n.km)}, ${plural(n.count, 'pandal')})`))} are the closest neighbourhoods — combine them in one evening with the [route planner](/siliguri-puja-routes).`,
    },
  ];
}

export default function AreaDetailPage() {
  const { slug } = useParams();
  const area = areasData.find((a) => a.slug === slug);
  const stats = areaStats(slug);
  if (!area || !stats) return <NotFoundPage />;
  return <AreaDetail stats={stats} />;
}

function AreaDetail({ stats: a }) {
  const top = a.pandals[0];
  const nearby = useMemo(() => nearestAreas(a, 4), [a]);
  const hubs = landmarkDistances(a);
  const faqs = areaFaqs(a, top, nearby, hubs);
  const crumbs = [['Home', '/'], ['Areas', '/areas'], [a.name, `/areas/${a.slug}`]];
  const names = a.pandals.map((p) => p.name);

  useSeo({
    title: `${a.name} Durga Puja Pandals 2026${/siliguri/i.test(a.name) ? '' : ', Siliguri'} – List & Map`,
    description: `${plural(a.count, 'Durga Puja pandal')} in ${a.name}, Siliguri for 2026${a.count > 1 ? `, led by ${top.name}` : `: ${top.name}`}. Themes, map, ${a.parking ? `parking at ${a.parking}` : 'walk-in access'} and nearby areas.`,
    path: `/areas/${a.slug}`,
    image: top.image_url || undefined,
    imageAlt: `Durga Puja in ${a.name}, Siliguri`,
    jsonLd: [
      breadcrumbs(crumbs),
      itemList(`Durga Puja pandals in ${a.name}, Siliguri (2026)`, a.pandals.map((p) => ({ name: p.name, path: `/pandals/${p.slug}` }))),
      faqPage(faqs),
    ],
  });

  return (
    <div className="space-y-10 sm:space-y-12">
      <Breadcrumbs items={[['Home', '/'], ['Areas', '/areas'], [a.name]]} />

      {/* Header */}
      <header className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-8 md:p-10 shadow-songi space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ivory text-brand-vermilion text-xs font-semibold border border-brand-border">
            <MapPin className="w-3.5 h-3.5" /> {a.zone}
          </span>
          <span className="px-3 py-1 rounded-full bg-brand-ivory text-brand-muted text-xs font-medium border border-brand-border">
            {plural(a.count, 'pandal')} · 2026
          </span>
        </div>

        <h1 className="text-h1 font-bold text-brand-ink">{a.name} Durga Puja Pandals 2026</h1>

        <div className="space-y-3 text-base sm:text-lg text-brand-ink/85 max-w-3xl leading-relaxed">
          <p>
            {a.name} is in {a.zone}
            {a.count === 1
              ? `, with one Durga Puja on the 2026 map: ${top.name}, ${top.category === 'Eco-Friendly' ? 'an eco-friendly' : `a ${top.category.toLowerCase()}`} puja${top.theme ? ` with the theme “${top.theme}”` : ''}.`
              : `, with ${a.count} Durga Puja pandals on the 2026 map: ${joinNames(names)}.`}
            {a.count > 1 && ` The highest-rated is ${top.name} (score ${top.pujo_songi_score}/10)${top.theme ? `, themed “${top.theme}”` : ''}.`}
          </p>
          <p>
            {a.parking === 0
              ? `There is no dedicated parking at ${a.count === 1 ? 'this pandal' : 'these pandals'}, so come on foot, by toto or by auto.`
              : a.parking === a.count
                ? `${a.count === 1 ? 'It has' : 'All of them have'} parking nearby, which makes ${a.name} an easy stop by car or bike.`
                : `${a.parking} of the ${a.count} have parking nearby; the others are walk-in only.`}
            {' '}Seeing {a.count === 1 ? 'it' : `all ${a.count}`} takes about {formatDuration(a.visitMinutes)} of viewing time plus travel
            {nearby[0] ? `, and ${nearby[0].name} is only ${kmLabel(nearby[0].km)} away if you want to keep going.` : '.'}
          </p>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-brand-border bg-brand-border">
          {[
            [Sparkles, 'Pandals', a.count],
            [Car, 'With parking', a.parking],
            [Clock, 'Viewing time', formatDuration(a.visitMinutes)],
            [TrainFront, 'From NJP', kmLabel(hubs.find((h) => h.key === 'njp').km)],
          ].map(([Icon, k, v]) => (
            <div key={k} className="bg-brand-card px-4 py-4">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-brand-muted"><Icon className="w-3.5 h-3.5 text-brand-crimson" />{k}</dt>
              <dd className="font-display text-2xl font-semibold text-brand-ink mt-1">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Map + list */}
      <section aria-labelledby="area-pandals" className="space-y-6">
        <h2 id="area-pandals" className="text-h2 font-bold text-brand-ink">
          Pandals in {a.name} ({a.count})
        </h2>
        <PandalsMap pandals={a.pandals} numbered={a.count > 1} className="h-64 sm:h-80" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {a.pandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      </section>

      {/* Getting there + nearby areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-7 shadow-songi space-y-4">
          <h2 className="text-xl sm:text-2xl leading-tight font-bold text-brand-ink">Getting to {a.name}</h2>
          <p className="text-sm text-brand-muted">Straight-line distances to the middle of the {a.name} pandals. Roads add roughly a quarter more.</p>
          <ul className="space-y-2.5">
            {hubs.map((h) => {
              const Icon = LANDMARK_ICON[h.key] || MapPin;
              return (
                <li key={h.key} className="flex items-center gap-3 p-3 rounded-xl bg-brand-ivory border border-brand-border/70">
                  <Icon className="w-5 h-5 text-brand-crimson shrink-0" aria-hidden="true" />
                  <span className="flex-1 text-sm text-brand-ink">{h.name}</span>
                  <strong className="text-sm text-brand-ink tabular-nums">{kmLabel(h.km)}</strong>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-7 shadow-songi space-y-4">
          <h2 className="text-xl sm:text-2xl leading-tight font-bold text-brand-ink">Neighbourhoods near {a.name}</h2>
          <ul className="space-y-2.5">
            {nearby.map((n) => (
              <li key={n.slug}>
                <Link to={`/areas/${n.slug}`} className="group flex items-center gap-3 p-3 rounded-xl bg-brand-ivory border border-brand-border/70 hover:border-brand-crimson/40">
                  <MapPin className="w-5 h-5 text-brand-crimson shrink-0" aria-hidden="true" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-brand-ink group-hover:text-brand-crimson">{n.name}</span>
                    <span className="block text-xs text-brand-muted">{plural(n.count, 'pandal')} · {n.zone}</span>
                  </span>
                  <span className="text-sm text-brand-ink tabular-nums">{kmLabel(n.km)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/siliguri-puja-routes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-crimson hover:underline underline-offset-4">
            Plan a route through {a.name} <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>

      <Faq faqs={faqs} title={`${a.name} Durga Puja: FAQs`} />
    </div>
  );
}
