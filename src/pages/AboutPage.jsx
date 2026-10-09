import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, MapPin, Compass, Sparkles, ArrowRight } from 'lucide-react';
import legalData from '../data/legal.json';

export default function AboutPage() {
  const paragraphs = legalData.about?.paragraphs || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-vermilion">
          <Heart className="w-3.5 h-3.5 text-brand-vermilion fill-brand-vermilion/30" />
          <span>Born in Siliguri • For North Bengal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-brand-primary leading-tight">
          Crafted in Siliguri to make every pandal hopper's journey memorable.
        </h1>
        <p className="text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
          PUJO PANDAL (পুজো প্যান্ডেল) was built with love, local reverence, and authentic field verification to solve real festival congestion.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-10 shadow-songi space-y-6">
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-brand-primary/90">
          <p>
            Every autumn, Siliguri transforms into an open-air carnival of art, architecture, and spiritual homecoming. From the historical bastions of Deshbandhupara and Hakimpara to the soaring contemporary marvels along Sevoke Road and Matigara, millions take to the streets.
          </p>
          <p>
            However, pandal hoppers frequently face severe bottlenecks, confusing police one-way restrictions, and missing queue information. Traditional navigation applications struggle with temporary festive pedestrian cordons.
          </p>
          <p>
            <strong>PUJO PANDAL</strong> was created to bridge this gap: a digital festival companion with 100% verified entrance coordinates, genuine crowd estimations, and smart travel-mode circuits built without simulated or artificial data.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-brand-border/60">
          <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/70 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-brand-primary">Verified Coordinates</h3>
            <p className="text-xs text-brand-muted">
              Every pin corresponds to actual pedestrian visitor entry gates verified on the ground.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/70 space-y-2">
            <Compass className="w-5 h-5 text-brand-vermilion" />
            <h3 className="font-bold text-sm text-brand-primary">Realistic Hopping Routes</h3>
            <p className="text-xs text-brand-muted">
              Circuits designed specifically for walking, two-wheelers, or family vehicle parking access.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-brand-ivory border border-brand-border/70 space-y-2">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <h3 className="font-bold text-sm text-brand-primary">Community Driven</h3>
            <p className="text-xs text-brand-muted">
              Directly coordinated with local puja clubs, administrative notifications, and resident insights.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-brand-card border border-brand-border shadow-songi flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-lg font-black text-brand-primary">
            Ready to explore Siliguri Durga Puja 2026?
          </h3>
          <p className="text-xs text-brand-muted">
            Start discovering 83 verified pandals or build a custom route right now.
          </p>
        </div>

        <Link
          to="/siliguri-puja-pandals"
          className="px-6 py-3 rounded-2xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
        >
          <span>Explore Registry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
