import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import PandalCard from '../components/PandalCard';
import areasData from '../data/areas.json';
import pandalsData from '../data/pandals.json';

export default function AreaDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const area = areasData.find((a) => a.slug === slug);
  const areaPandals = pandalsData.filter((p) => p.area_slug === slug);

  if (!area) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-brand-primary">Area Not Found</h2>
        <Link
          to="/areas"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-vermilion text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Areas</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div className="flex items-center justify-between text-xs text-brand-muted">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 hover:text-brand-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Areas</span>
        </button>
        <span className="text-brand-primary font-bold">Siliguri Neighborhood Guide</span>
      </div>

      {/* Header Banner */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-8 md:p-10 shadow-songi space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ivory text-brand-vermilion text-xs font-bold border border-brand-border">
          <MapPin className="w-3.5 h-3.5" />
          <span>{areaPandals.length} Pandals Registered</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-brand-primary">
          {area.name} Durga Puja Pandals
        </h1>

        <p className="text-sm sm:text-base text-brand-muted max-w-2xl leading-relaxed">
          {area.description ||
            `Explore all community Durga Puja installations, themes, and route timings in ${area.name}, Siliguri.`}
        </p>
      </div>

      {/* Pandals Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-brand-primary">
          Pandals in {area.name} ({areaPandals.length})
        </h2>

        {areaPandals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {areaPandals.map((pandal) => (
              <PandalCard key={pandal.id} pandal={pandal} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-brand-card rounded-2xl border border-brand-border">
            <p className="text-sm font-bold text-brand-primary">No pandals registered in this area yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
