import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, CheckCircle2 } from 'lucide-react';
import PandalCard from '../components/PandalCard';
import pandalsData from '../data/pandals.json';
import areasData from '../data/areas.json';
import PageHeader from '../components/PageHeader';
import { useSeo } from '../lib/seo';

export default function PandalsPage() {
  useSeo({
    title: 'Siliguri Puja Pandals 2026 – All Pandals List',
    description: `All ${pandalsData.length} Siliguri Durga Puja pandals for 2026 with themes, scores, parking and areas. Filter and save pandals to your Puja plan.`,
    path: '/siliguri-puja-pandals',
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
    <div className="space-y-8 pb-12">
      <PageHeader
        bn="প্যান্ডেল"
        kicker="Official 2026 directory"
        title="Siliguri Puja Pandals 2026"
        description={`Browse ${pandalsData.length} community pujas across Siliguri. Filter by neighbourhood, theme, parking and verified records.`}
        photo="siliguri-idol-golden"
      />

      {/* Filter and Search Bar */}
      <div className="bg-brand-card rounded-2xl border border-brand-border p-4 sm:p-5 shadow-songi space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by pandal name, locality, or artistic theme..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-brand-ivory border border-brand-border text-brand-primary placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
            />
          </div>

          {/* Area Dropdown */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-brand-ivory border border-brand-border text-brand-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
            >
              <option value="All">All 28 Areas</option>
              {areasData.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Chips & Sorting */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-border/40">
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Theme', 'Traditional', 'Verified'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 border ${
                parkingOnly
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-brand-ivory text-brand-primary border-brand-border/80 hover:bg-white'
              }`}
            >
              Parking Available
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-brand-muted">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-brand-ivory border border-brand-border text-brand-primary font-medium focus:outline-none focus:ring-1 focus:ring-brand-vermilion"
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
      <div className="flex items-center justify-between text-xs text-brand-muted">
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
            className="text-brand-vermilion hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Pandals Grid */}
      {displayedPandals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center space-y-3 bg-brand-card rounded-2xl border border-brand-border p-8">
          <p className="text-base font-bold text-brand-primary">No pandals found</p>
          <p className="text-xs text-brand-muted">
            Try adjusting your search query or reset the filters to see all pandals.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredPandals.length && (
        <div className="pt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="px-8 py-3 rounded-2xl bg-brand-card hover:bg-brand-ivory border border-brand-border font-bold text-xs uppercase tracking-wider text-brand-primary hover:border-brand-vermilion/50 transition-all shadow-songi"
          >
            Load More Pandals ({filteredPandals.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
