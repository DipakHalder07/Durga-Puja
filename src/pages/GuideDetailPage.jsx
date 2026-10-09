import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, Share2, Compass, Route } from 'lucide-react';
import guidesData from '../data/guides.json';

export default function GuideDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const guide = guidesData.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-brand-primary">Guide Not Found</h2>
        <Link
          to="/guides"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-vermilion text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Guides</span>
        </Link>
      </div>
    );
  }

  const paragraphs = guide.content.split('\n\n').filter((p) => p.trim());

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <article className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between text-xs text-brand-muted">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Guides</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-xs text-brand-primary hover:text-brand-vermilion font-medium"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Guide Header Banner */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-8 md:p-10 shadow-songi space-y-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-brand-vermilion text-white font-bold text-[11px] uppercase tracking-wider">
            {guide.category}
          </span>
          <span className="text-brand-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{guide.read_time}</span>
          </span>
          <span className="text-brand-border">•</span>
          <span className="text-brand-muted">Updated for Durga Puja 2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-brand-primary tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-base sm:text-lg text-brand-muted leading-relaxed font-medium">
          {guide.description}
        </p>
      </div>

      {/* Article Body */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-10 shadow-songi space-y-6">
        <div className="prose prose-brand max-w-none space-y-5 text-sm sm:text-base leading-relaxed text-brand-primary/90">
          {paragraphs.map((p, idx) => (
            <p key={idx} className="leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Quick Links inside guide */}
        <div className="mt-8 pt-8 border-t border-brand-border/70 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/siliguri-puja-pandals"
            className="p-4 rounded-2xl bg-brand-ivory border border-brand-border hover:border-brand-vermilion/50 transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-brand-vermilion border border-brand-border shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-primary block">Explore Pandals</span>
              <span className="text-[11px] text-brand-muted">Search all 83 verified installations</span>
            </div>
          </Link>

          <Link
            to="/siliguri-puja-routes"
            className="p-4 rounded-2xl bg-brand-ivory border border-brand-border hover:border-brand-vermilion/50 transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center text-brand-vermilion border border-brand-border shrink-0">
              <Route className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-brand-primary block">Smart Route Planner</span>
              <span className="text-[11px] text-brand-muted">Calculate walking and scooter circuits</span>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}
