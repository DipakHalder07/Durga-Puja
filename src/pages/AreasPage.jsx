import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import { STATS } from '../components/BlogBlocks';
import { useSeo } from '../lib/seo';
import { breadcrumbs, itemList } from '../lib/schema';
import { ZONE_GROUPS } from '../lib/blogQueries';
import { AREA_STATS } from '../lib/geo';

const CRUMBS = [['Home', '/'], ['Areas', '/areas']];

// Neighbourhoods grouped into the five Puja zones, busiest first
const GROUPS = ZONE_GROUPS.map((g) => ({
  ...g,
  areas: AREA_STATS.filter((a) => a.pandals.some((p) => g.zones.includes(p.zone))).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
})).filter((g) => g.areas.length);

export default function AreasPage() {
  useSeo({
    title: 'Siliguri Durga Puja 2026 by Area – Pandals in Every Para',
    description: `Siliguri Durga Puja 2026 pandals in ${STATS.areas} neighbourhoods — Hakimpara, Babupara, Deshbandhupara, Pradhannagar, Champasari and more — with maps and parking.`,
    path: '/areas',
    image: '/images/photos/siliguri-pandal-inside.webp',
    imageAlt: 'Inside a Durga Puja pandal in Siliguri',
    jsonLd: [breadcrumbs(CRUMBS), itemList('Siliguri Durga Puja areas', AREA_STATS.map((a) => ({ name: `${a.name} pandals`, path: `/areas/${a.slug}` })))],
  });

  return (
    <div className="space-y-10 sm:space-y-12">
      <Breadcrumbs items={[['Home', '/'], ['Areas']]} />
      <PageHeader
        bn="পাড়ায় পাড়ায়"
        kicker="Neighbourhoods"
        title="Siliguri Durga Puja by area"
        description={`Pujo is a para affair. Here are all ${STATS.areas} Siliguri neighbourhoods with pandals in 2026, grouped into five zones — pick one or two zones per evening to keep travel short.`}
        photo="siliguri-pandal-inside"
        photoAlt="Inside a Durga Puja pandal in Siliguri"
      />

      {GROUPS.map((g, gi) => (
        <section key={g.name} aria-labelledby={`zone-${gi}`} className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <h2 id={`zone-${gi}`} className="text-h2 font-bold text-brand-ink">
              {g.name} <span className="text-lead font-sans font-medium text-brand-muted">· {g.areas.reduce((s, a) => s + a.count, 0)} pandals</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {g.areas.map((area) => (
              <Link
                key={area.slug}
                to={`/areas/${area.slug}`}
                className="group p-5 rounded-2xl bg-brand-card border border-brand-border shadow-songi hover:shadow-songi-lg hover:border-brand-vermilion/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-brand-vermilion">
                      {area.count} {area.count === 1 ? 'Pandal' : 'Pandals'}
                    </span>
                    <MapPin className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-vermilion transition-colors" />
                  </div>
                  <h3 className="font-display text-h3 font-semibold text-brand-ink group-hover:text-brand-crimson transition-colors">
                    {area.name}
                  </h3>
                  <p className="text-sm text-brand-muted line-clamp-2">
                    {area.pandals.slice(0, 3).map((p) => p.name).join(', ')}
                    {area.count > 3 ? ` and ${area.count - 3} more` : ''}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between text-sm font-semibold text-brand-primary group-hover:text-brand-vermilion">
                  <span>{area.name} pandals</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
