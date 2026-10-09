import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Compass, Sparkles, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import { STATS } from '../components/BlogBlocks';
import { useSeo } from '../lib/seo';
import { breadcrumbs, organization } from '../lib/schema';

export default function AboutPage() {
  useSeo({
    title: 'About Pujo Pandal – Siliguri Durga Puja Guide',
    description: `Pujo Pandal is a free, locally made Siliguri Durga Puja 2026 guide: ${STATS.total} pandals on one map, smart pandal-hopping routes and the Puja schedule.`,
    path: '/about',
    image: '/images/photos/kumartuli-idol.webp',
    imageAlt: 'An artisan shaping a Durga idol',
    jsonLd: [breadcrumbs([['Home', '/'], ['About', '/about']]), organization()],
  });

  return (
    <div className="max-w-4xl mx-auto space-y-section">
      <Breadcrumbs items={[['Home', '/'], ['About']]} />
      <PageHeader
        bn="আমাদের কথা"
        kicker="Born in Siliguri"
        title="Made in Siliguri for every pandal hopper"
        description="Pujo Pandal (পুজো প্যান্ডেল) is built with love, local reverence and on-ground verification to make festival travel easier."
        photo="kumartuli-idol"
        photoAlt="An artisan shaping a Durga idol"
      />

      {/* Main Philosophy Card */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-10 shadow-songi space-y-6">
        <div className="space-y-4 text-base text-brand-primary/90">
          <p>
            Every autumn, Siliguri transforms into an open-air carnival of art, architecture, and spiritual homecoming. From the historical bastions of Deshbandhupara and Hakimpara to the soaring contemporary marvels along Sevoke Road and Matigara, millions take to the streets.
          </p>
          <p>
            However, pandal hoppers frequently face severe bottlenecks, confusing police one-way restrictions, and missing queue information. Traditional navigation applications struggle with temporary festive pedestrian cordons.
          </p>
          <p>
            <strong>Pujo Pandal</strong> was created to bridge this gap: a free festival companion for Siliguri with entrance-level pandal pins, realistic visit times, parking notes and smart circuits for walking, bikes and cars. It works in any phone browser — no app, no sign-up.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60">
          <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/70 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-base text-brand-ink">Verified Coordinates</h3>
            <p className="text-sm text-brand-muted">
              Every pin corresponds to actual pedestrian visitor entry gates verified on the ground.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/70 space-y-2">
            <Compass className="w-5 h-5 text-brand-vermilion" />
            <h3 className="font-semibold text-base text-brand-ink">Realistic Hopping Routes</h3>
            <p className="text-sm text-brand-muted">
              Circuits designed specifically for walking, two-wheelers, or family vehicle parking access.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/70 space-y-2">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <h3 className="font-semibold text-base text-brand-ink">Community Driven</h3>
            <p className="text-sm text-brand-muted">
              Directly coordinated with local puja clubs, administrative notifications, and resident insights.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-brand-card border border-brand-border shadow-songi flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="font-display text-h3 font-semibold text-brand-ink">
            Ready to explore Siliguri Durga Puja 2026?
          </h3>
          <p className="text-sm text-brand-muted">
            Start discovering {STATS.total} pandals across {STATS.areas} neighbourhoods or build a custom route right now.
          </p>
        </div>

        <Link
          to="/siliguri-puja-pandals"
          className="h-12 px-6 rounded-full bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-base font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <span>Explore Registry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
