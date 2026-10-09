import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Footprints, Bike, Car, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import routesData from '../data/routes.json';
import pandalsData from '../data/pandals.json';
import RouteMap from '../components/RouteMap';
import { estimateCircuit, formatDuration, formatKm } from '../lib/routeEngine';

export default function RouteDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const route = routesData.find((r) => r.slug === slug);

  if (!route) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-2xl font-black text-brand-primary">Route Not Found</h2>
        <Link
          to="/siliguri-puja-routes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-vermilion text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Routes</span>
        </Link>
      </div>
    );
  }

  return <RouteDetail route={route} navigate={navigate} />;
}

const pandalMap = Object.fromEntries(pandalsData.map((p) => [p.slug, p]));

function RouteDetail({ route, navigate }) {
  const stops = useMemo(() => route.stopping_points.map((sSlug) => pandalMap[sSlug]).filter(Boolean), [route]);
  const est = estimateCircuit(stops, route.travel_mode);
  const origin = useMemo(() => (stops[0] ? { lat: stops[0].latitude, lng: stops[0].longitude } : null), [stops]);
  const googleMapsDirectionsUrl = est?.googleMapsUrl;
  const routeRest = useMemo(() => stops.slice(1), [stops]);

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
          <span>Back to Routes</span>
        </button>
        <span className="text-brand-primary font-bold">Curated Route Itinerary</span>
      </div>

      {/* Header Banner */}
      <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-8 md:p-10 shadow-songi space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-vermilion text-white text-xs font-bold">
              {est ? formatDuration(est.totalMinutes) : route.duration_str} Total
            </span>
            <span className="px-3 py-1 rounded-full bg-brand-ivory text-brand-primary border border-brand-border text-xs font-semibold">
              {est ? formatKm(est.distanceKm) : route.distance_km}
            </span>
            <span className="px-3 py-1 rounded-full bg-brand-ivory text-brand-primary border border-brand-border text-xs font-semibold">
              {route.travel_mode}
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
              {stops.length} Pandals
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-brand-primary">
            {route.title}
          </h1>

          <p className="text-sm sm:text-base text-brand-muted max-w-3xl leading-relaxed">
            {route.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={googleMapsDirectionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-songi transition-all"
          >
            <MapPin className="w-4 h-4" />
            <span>Start Navigation in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Route map */}
      {origin && stops.length > 1 && (
        <RouteMap origin={origin} originName={stops[0].name} stops={routeRest} startLabel="1" numberOffset={1} travelMode={route.travel_mode} />
      )}

      {/* Route Stops */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-brand-primary">
          Circuit Stops &amp; Directions
        </h2>

        <div className="space-y-4">
          {stops.map((pandal, idx) => (
            <div
              key={pandal.id}
              className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-maroon text-[#FFFBF5] font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-brand-vermilion uppercase">
                      {pandal.area_name}
                    </span>
                    <span className="text-brand-border">•</span>
                    <span className="text-[11px] text-brand-muted">~{pandal.estimated_visit_minutes} min visit</span>
                  </div>
                  <h3 className="text-base font-extrabold text-brand-primary">
                    <Link to={`/pandals/${pandal.slug}`} className="hover:text-brand-vermilion transition-colors">
                      {pandal.name}
                    </Link>
                  </h3>
                  {pandal.theme && (
                    <p className="text-xs text-brand-muted line-clamp-1">
                      Theme: {pandal.theme}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-xs font-bold text-brand-maroon bg-brand-ivory px-3 py-1.5 rounded-xl border border-brand-border">
                  Score: {pandal.pujo_songi_score}
                </span>
                <Link
                  to={`/pandals/${pandal.slug}`}
                  className="px-4 py-2 rounded-xl bg-brand-ivory hover:bg-white text-brand-primary border border-brand-border text-xs font-bold transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Hopping Tips */}
      {route.tips && (
        <div className="bg-amber-50/70 border border-brand-gold/50 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-maroon uppercase tracking-wide">
            <Sparkles className="w-4 h-4 text-brand-vermilion" />
            <span>Local Resident Hopping Tips</span>
          </div>
          <ul className="space-y-2 text-xs text-brand-primary/90 list-disc list-inside">
            {route.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
