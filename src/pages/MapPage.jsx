import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ShieldCheck } from 'lucide-react';
import { InteractiveMap } from '../components/Maps';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import Faq from '../components/Faq';
import { STATS } from '../components/BlogBlocks';
import pandalsData from '../data/pandals.json';
import { useSeo } from '../lib/seo';
import { breadcrumbs, faqPage, webPage } from '../lib/schema';
import { zoneTable } from '../lib/blogQueries';

const CRUMBS = [['Home', '/'], ['Siliguri Puja map', '/siliguri-puja-map']];
const ZONES = zoneTable(pandalsData).map((z) => ({
  ...z,
  pandals: pandalsData.filter((p) => z.zones.includes(p.zone)).sort((a, b) => a.name.localeCompare(b.name)),
}));

const FAQS = [
  {
    q: 'Is there a Durga Puja pandal map for Siliguri 2026?',
    a: `Yes — this page shows all ${STATS.total} Siliguri pandals for 2026 on one interactive map, each pinned at its 2026 venue. Search by name, filter by area, theme, traditional pujas or parking, and tap a pin for directions.`,
  },
  {
    q: 'Does the pandal map work on my phone without an app?',
    a: 'Yes. It runs in any mobile browser. Allow location to see where you are, then open Google Maps from any pandal for turn-by-turn directions.',
  },
  {
    q: 'How do I plan a route through several pandals?',
    a: 'Save pandals with the bookmark button and open your [saved plan](/saved), or let the [smart route planner](/siliguri-puja-routes) pick and order pandals for your start point, travel mode and time.',
  },
  {
    q: 'Why is the pin slightly away from the main road?',
    a: 'Pins mark the pandal entrance used by visitors, not the centre of the locality, so you are not sent into a lane that is closed on Pujo nights.',
  },
];

export default function MapPage() {
  useSeo({
    title: 'Siliguri Durga Puja Pandal Map 2026 – Live Map & Directions',
    description: `Interactive Siliguri Durga Puja pandal map 2026: all ${STATS.total} pandals with GPS pins, search, area and parking filters and one-tap Google Maps directions.`,
    path: '/siliguri-puja-map',
    image: '/images/photos/lights-gate.webp',
    imageAlt: 'Festival lights at a Durga Puja pandal gate',
    jsonLd: [
      webPage({ name: 'Siliguri Durga Puja pandal map 2026', path: '/siliguri-puja-map', description: `All ${STATS.total} Siliguri Durga Puja pandals on one interactive map.` }),
      breadcrumbs(CRUMBS),
      faqPage(FAQS),
    ],
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      <Breadcrumbs items={[['Home', '/'], ['Siliguri Puja map']]} />
      <PageHeader
        bn="শিলিগুড়ি পুজো ম্যাপ"
        kicker="Interactive map"
        title="Siliguri Durga Puja Pandal Map 2026"
        description={`All ${STATS.total} pandals across ${STATS.areas} neighbourhoods on one map. Search by name, pick an area, and open turn-by-turn directions.`}
        photo="lights-gate"
        photoAlt="Festival lights at a Durga Puja pandal gate"
      />

      {/* Main Interactive Map */}
      <InteractiveMap height="h-[70vh] min-h-[550px]" />

      {/* Map Guidance & Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <span className="w-3.5 h-3.5 rounded-full bg-brand-maroon inline-block" aria-hidden="true" />
            <span>Pandal score on every pin</span>
          </h2>
          <p className="text-sm text-brand-muted">
            Each pin shows the Pujo Pandal score out of 10. Darker maroon pins (9.4 and above) mark the year’s biggest theme and heritage installations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Entrance-level pins</span>
          </h2>
          <p className="text-sm text-brand-muted">
            Pins mark where visitors actually enter for 2026, not the middle of the para, so directions don’t lead you into closed alleys.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi space-y-2">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
            <Navigation className="w-4 h-4 text-brand-vermilion" />
            <span>Your live location</span>
          </h2>
          <p className="text-sm text-brand-muted">
            Tap the location button on the map (or “Near Me” in the menu) to see the blue dot and the pandals around you. Your location stays on your phone.
          </p>
        </div>
      </div>

      {/* Every pandal on the map as a plain list, zone by zone */}
      <section aria-labelledby="map-list" className="space-y-content pt-4">
        <div>
          <p className="font-bengali-serif text-brand-crimson text-lg sm:text-xl leading-none">অঞ্চল অনুযায়ী</p>
          <h2 id="map-list" className="text-h2 font-bold text-brand-ink mt-2">Every pandal on the map, zone by zone</h2>
          <p className="text-base text-brand-muted mt-2 max-w-2xl">
            Siliguri’s pandals fall into five zones. Most visitors cover one or two zones an evening — read the{' '}
            <Link to="/blog/siliguri-durga-puja-pandal-map-2026-zone-wise" className="text-brand-crimson underline underline-offset-2">zone-wise guide</Link> for the best order.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ZONES.map((z) => (
            <div key={z.name} className="rounded-2xl border border-brand-border bg-brand-card p-5">
              <h3 className="font-display text-h3 font-semibold text-brand-ink">
                {z.name} <span className="text-sm font-sans font-medium text-brand-muted">· {z.count}</span>
              </h3>
              <p className="text-xs text-brand-muted mt-1">{z.parking} with parking · {z.areas.slice(0, 4).join(', ')}</p>
              <ul className="mt-3 grid grid-cols-1 gap-1.5 text-sm">
                {z.pandals.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/pandals/${p.slug}`} className="text-brand-ink/85 hover:text-brand-crimson">{p.name}</Link>
                    <span className="text-brand-muted"> · {p.area_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Faq faqs={FAQS} title="Pandal map: FAQs" />
    </div>
  );
}
