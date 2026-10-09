import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import PandalCard from '../components/PandalCard';
import pandalsData from '../data/pandals.json';
import areasData from '../data/areas.json';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import Faq from '../components/Faq';
import { STATS } from '../components/BlogBlocks';
import { useSeo } from '../lib/seo';
import { breadcrumbs, itemList, faqPage } from '../lib/schema';
import { AREA_STATS } from '../lib/geo';

const BY_SCORE = [...pandalsData].sort((a, b) => b.pujo_songi_score - a.pujo_songi_score || a.name.localeCompare(b.name));
const AREAS_AZ = [...AREA_STATS].sort((a, b) => a.name.localeCompare(b.name));
const CRUMBS = [['Home', '/'], ['Siliguri Puja pandals', '/siliguri-puja-pandals']];

const FAQS = [
  {
    q: 'How many pandals are listed for Siliguri Durga Puja 2026?',
    a: `${STATS.total} pandals in ${STATS.areas} neighbourhoods: ${STATS.theme} theme pujas, ${STATS.traditional} traditional, ${STATS.heritage} heritage, ${STATS.community} community and ${STATS.eco} eco-friendly pujas.`,
  },
  {
    q: 'Which Siliguri pandals have parking?',
    a: `${STATS.parking} pandals have parking nearby. Tap **Parking Available** above to see only those, or read the [bike, car and parking guide](/blog/durga-puja-pandal-map-2026-bike-car-parking).`,
  },
  {
    q: 'What is the pandal score?',
    a: 'The score (out of 10) is Pujo Pandal’s own editorial rating. It sorts this list and helps the route planner choose stops when time is short. Treat it as a guide — smaller paras often have the loveliest traditional idols.',
  },
  {
    q: 'My pandal is missing or the details are wrong. How do I fix it?',
    a: 'Send the committee name, 2026 venue and theme through the [contact page](/contact) and we will check and add it.',
  },
];

export default function PandalsPage() {
  useSeo({
    title: 'Siliguri Durga Puja Pandals 2026 – Full List with Themes',
    description: `All ${pandalsData.length} Siliguri Durga Puja pandals for 2026 by area: themes, pandal scores, visit times and parking. Filter, search and save pandals to your Puja plan.`,
    path: '/siliguri-puja-pandals',
    image: '/images/photos/siliguri-idol-golden.webp',
    imageAlt: 'Durga idol at a Siliguri pandal',
    jsonLd: [
      breadcrumbs(CRUMBS),
      itemList('Siliguri Durga Puja pandals 2026', BY_SCORE.map((p) => ({ name: p.name, path: `/pandals/${p.slug}` }))),
      faqPage(FAQS),
    ],
  });
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [parkingOnly, setParkingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('score');
  const [visibleCount, setVisibleCount] = useState(24);

  const filteredPandals = useMemo(() => {
    return pandalsData
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.area_name.toLowerCase().includes(search.toLowerCase()) ||
          (p.theme && p.theme.toLowerCase().includes(search.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(search.toLowerCase()));

        const matchesArea = selectedArea === 'All' || p.area_name === selectedArea;

        const matchesCategory =
          selectedCategory === 'All' ||
          (selectedCategory === 'Theme' && p.category === 'Theme') ||
          (selectedCategory === 'Traditional' && (p.category === 'Traditional' || p.category === 'Sabeki')) ||
          (selectedCategory === 'Verified' && p.verified);

        const matchesParking = !parkingOnly || p.parking_available;

        return matchesSearch && matchesArea && matchesCategory && matchesParking;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return Number(b.pujo_songi_score || 0) - Number(a.pujo_songi_score || 0);
        if (sortBy === 'rating') return Number(b.rating || 0) - Number(a.rating || 0);
        if (sortBy === 'time') return Number(a.estimated_visit_minutes || 0) - Number(b.estimated_visit_minutes || 0);
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [search, selectedArea, selectedCategory, parkingOnly, sortBy]);

  const displayedPandals = filteredPandals.slice(0, visibleCount);

  return (
    <div className="space-y-8 sm:space-y-10">
      <Breadcrumbs items={CRUMBS} />
      <PageHeader
        bn="প্যান্ডেল"
        kicker="2026 directory"
        title="Siliguri Durga Puja Pandals 2026"
        description={`Browse all ${pandalsData.length} community pujas across ${STATS.areas} Siliguri neighbourhoods. Filter by area, theme and parking, then save the ones you want to see.`}
        photo="siliguri-idol-golden"
        photoAlt="Durga idol at a Siliguri pandal"
      />

      {/* Filter and Search Bar */}
      <div className="bg-brand-card rounded-2xl border border-brand-border p-4 sm:p-6 shadow-songi space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="search"
              aria-label="Search pandals"
              placeholder="Search pandal, area or theme…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 text-base rounded-xl bg-brand-ivory border border-brand-border text-brand-primary placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
            />
          </div>

          {/* Area Dropdown */}
          <div>
            <select
              aria-label="Filter by area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full h-12 px-4 text-base rounded-xl bg-brand-ivory border border-brand-border text-brand-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
            >
              <option value="All">All {areasData.length} areas</option>
              {areasData.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Chips & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-brand-border/60">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Theme', 'Traditional', 'Verified'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-10 px-4 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-brand-vermilion text-white shadow-xs'
                    : 'bg-brand-ivory text-brand-primary border border-brand-border/80 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setParkingOnly(!parkingOnly)}
              className={`h-10 px-4 rounded-full text-sm font-semibold transition-all active:scale-95 border ${
                parkingOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-brand-ivory text-brand-primary border-brand-border/80 hover:bg-white'
              }`}
            >
              Parking Available
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sort" className="text-brand-muted">Sort by</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 text-base sm:text-sm rounded-xl bg-brand-ivory border border-brand-border text-brand-primary font-medium focus:outline-none focus:ring-1 focus:ring-brand-vermilion"
            >
              <option value="score">Highest Pandal Score</option>
              <option value="rating">Highest Rating</option>
              <option value="time">Shortest Visit Time</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-brand-muted -mb-2 sm:-mb-4">
        <span>
          Showing <strong className="text-brand-primary">{displayedPandals.length}</strong> of{' '}
          <strong className="text-brand-primary">{filteredPandals.length}</strong> pandals
        </span>
        {(search || selectedArea !== 'All' || selectedCategory !== 'All' || parkingOnly) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setSelectedArea('All');
              setSelectedCategory('All');
              setParkingOnly(false);
            }}
            className="min-h-10 text-brand-vermilion hover:underline font-semibold"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Pandals Grid */}
      {displayedPandals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {displayedPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-2 bg-brand-card rounded-2xl border border-brand-border px-6">
          <p className="font-display text-h3 font-semibold text-brand-ink">No pandals found</p>
          <p className="text-base text-brand-muted">
            Try adjusting your search query or reset the filters to see all pandals.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredPandals.length && (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="h-12 px-8 rounded-full bg-brand-card hover:bg-brand-ivory border border-brand-border font-semibold text-base text-brand-primary hover:border-brand-vermilion/50 transition-all shadow-songi"
          >
            Show more pandals ({filteredPandals.length - visibleCount} left)
          </button>
        </div>
      )}

      {/* Every pandal as a plain link, grouped by area — quick to scan and easy for search engines to follow */}
      <section aria-labelledby="pandals-by-area" className="space-y-content pt-6">
        <div>
          <p className="font-bengali-serif text-brand-crimson text-lg sm:text-xl leading-none">পাড়া অনুযায়ী</p>
          <h2 id="pandals-by-area" className="text-h2 font-bold text-brand-ink mt-2">All Siliguri pandals by area (A–Z)</h2>
          <p className="text-base text-brand-muted mt-2 max-w-2xl">
            The full 2026 list in one place. Open an area for its map, parking notes and nearby neighbourhoods.
          </p>
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8">
          {AREAS_AZ.map((a) => (
            <div key={a.slug} className="break-inside-avoid mb-6 rounded-2xl border border-brand-border bg-brand-card p-4 sm:p-5">
              <h3 className="font-display text-h3 font-semibold text-brand-ink">
                <Link to={`/areas/${a.slug}`} className="hover:text-brand-crimson">{a.name}</Link>
                <span className="ml-2 text-sm font-sans font-medium text-brand-muted">{a.count}</span>
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {a.pandals.map((p) => (
                  <li key={p.slug}>
                    <Link to={`/pandals/${p.slug}`} className="text-brand-ink/85 hover:text-brand-crimson">
                      {p.name}
                    </Link>
                    <span className="text-brand-muted"> · {p.category}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <Faq faqs={FAQS} title="Siliguri pandal list: FAQs" />
    </div>
  );
}
