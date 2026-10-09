import React, { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Sparkles, Clock, Ban, Check, Bookmark,
  ArrowLeft, ExternalLink, CheckCircle2, Navigation, Share2, TrainFront, Plane, Footprints, ArrowRight, Camera,
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import pandalsData from '../data/pandals.json';
import SmartImage from '../components/SmartImage';
import Breadcrumbs from '../components/Breadcrumbs';
import Faq from '../components/Faq';
import { PandalsMap } from '../components/Maps';
import { pandalImage } from '../lib/images';
import { useSeo } from '../lib/seo';
import { breadcrumbs, pandalJsonLd, faqPage } from '../lib/schema';
import { landmarkDistances, nearestPandals, areaStats, kmLabel, walkMinutes, joinNames } from '../lib/geo';
import NotFoundPage from './NotFoundPage';

const LANDMARK_ICON = { njp: TrainFront, junction: TrainFront, airport: Plane, venus: MapPin, sevoke: MapPin };

// Trim to a search-snippet length on a word boundary
const clip = (text, max = 158) => (text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max - 1))}…`);

// Venue notes without internal survey remarks
const venueNote = (p) =>
  (p.coordinate_notes || '')
    .replace(/^SPECIAL CASE:\s*/i, '')
    .split(/(?<=\.)\s+/)
    .filter((s) => s && !/coordinate|survey|geocod/i.test(s))
    .join(' ');

const article = (word) => (/^[AEIOU]/i.test(word) ? 'an' : 'a');

// "X Durga Puja Committee" already says Durga Puja; "Siliguri Town" already says Siliguri
const pujaName = (p) => (/durga ?puja|durgotsab|durga utsav|puja committee/i.test(p.name) ? p.name : `${p.name} Durga Puja`);
const placeName = (p) => (/siliguri/i.test(p.area_name) ? p.area_name : `${p.area_name}, Siliguri`);

function pandalFaqs(p, near, area) {
  const venue = p.venue_name_2026 || p.address_2026;
  const njp = landmarkDistances(p).find((l) => l.key === 'njp');
  return [
    {
      q: `Where is ${pujaName(p)} in Siliguri?`,
      a: `${p.name} is in [${p.area_name}](/areas/${p.area_slug}) (${p.zone}). The 2026 venue is ${venue}. GPS: ${p.latitude}, ${p.longitude} — use the Directions button for turn-by-turn navigation.`,
    },
    {
      q: `What is the theme of ${p.name} in 2026?`,
      a: `The 2026 theme is “${p.theme}”. It is ${article(p.category)} ${p.category.toLowerCase()} puja with a pandal score of ${p.pujo_songi_score}/10.`,
    },
    {
      q: `Is there parking near ${p.name}?`,
      a: p.parking_available
        ? `Yes. ${p.parking_notes}`
        : `No — it is walk-in only. ${p.parking_notes}`,
    },
    {
      q: `How long does a visit to ${p.name} take?`,
      a: `Plan about ${p.estimated_visit_minutes} minutes including the queue. Ashtami and Navami evenings are the busiest; afternoons and Shashti are quieter.`,
    },
    {
      q: `Which pandals are near ${p.name}?`,
      a: near.length
        ? `${joinNames(near.slice(0, 3).map((n) => `[${n.name}](/pandals/${n.slug}) (${kmLabel(n.km)})`))} are the closest. ${area && area.count > 1 ? `[${p.area_name}](/areas/${p.area_slug}) has ${area.count} pandals in all.` : ''}`
        : `It stands on its own, so plan a bike or car hop. See the [Siliguri Puja map](/siliguri-puja-map) for the nearest clusters.`,
    },
    {
      q: `How far is ${p.name} from NJP station?`,
      a: `About ${kmLabel(njp.km)} in a straight line from New Jalpaiguri (NJP) station; roads add roughly a quarter more. Taxis and autos run from the station.`,
    },
  ];
}

export default function PandalDetailPage() {
  const { slug } = useParams();
  const pandal = pandalsData.find((p) => p.slug === slug);
  if (!pandal) return <NotFoundPage />;
  return <PandalDetail pandal={pandal} />;
}

function PandalDetail({ pandal }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = usePlan();
  const locationPin = useMemo(() => [pandal], [pandal]);
  const near = useMemo(() => nearestPandals(pandal, { limit: 4, maxKm: 3 }), [pandal]);
  const area = areaStats(pandal.area_slug);
  const hubs = landmarkDistances(pandal);
  const faqs = pandalFaqs(pandal, near, area);
  const note = venueNote(pandal);
  const venue = pandal.venue_name_2026 || pandal.address_2026;
  const image = pandalImage(pandal);
  const crumbs = [['Home', '/'], ['Pandals', '/siliguri-puja-pandals'], [pandal.area_name, `/areas/${pandal.area_slug}`], [pandal.name, `/pandals/${pandal.slug}`]];

  useSeo({
    title: `${pujaName(pandal)} 2026 – ${placeName(pandal)}`,
    description: clip(
      `${pandal.name} (${placeName(pandal)}) Durga Puja 2026: theme “${pandal.theme}”. ~${pandal.estimated_visit_minutes} min visit, ${pandal.parking_available ? 'parking nearby' : 'walk-in only'}. Map, directions and nearby pandals.`
    ),
    path: `/pandals/${pandal.slug}`,
    image,
    imageAlt: `Durga Puja festival photo — ${pandal.name}, ${pandal.area_name}, Siliguri`,
    // Listing photos are representative, so the place/event markup uses the site image instead
    jsonLd: [breadcrumbs(crumbs), ...pandalJsonLd(pandal), faqPage(faqs)],
  });

  const saved = isSaved(pandal.id);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${pandal.latitude},${pandal.longitude}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${pandal.latitude},${pandal.longitude}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${pandal.name} — Siliguri Durga Puja 2026`,
        text: `Check out ${pandal.name} in ${pandal.area_name} on Pujo Pandal!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-4 text-sm text-brand-muted">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 min-h-10 hover:text-brand-primary transition-colors font-medium shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-brand-border" aria-hidden="true">|</span>
        <Breadcrumbs items={crumbs.map(([l, to], i) => (i === crumbs.length - 1 ? [l] : [l, to]))} className="min-w-0" />
      </div>

      {/* Pandal Header Hero Banner */}
      <div className="bg-brand-card rounded-3xl border border-brand-border shadow-songi overflow-hidden">
      <SmartImage
        src={image}
        alt="Representative Durga Puja festival photo (not necessarily this pandal)"
        sizes="(max-width: 1280px) 100vw, 1216px"
        className="w-full h-52 sm:h-72 md:h-80 object-cover"
        wrapperClassName="relative bg-brand-maroon"
        loading="eager"
        fetchpriority="high"
      >
        <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white/95 text-2xs font-medium backdrop-blur-sm border border-white/10 shadow-xs flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-brand-gold" />
          <span>Puja Festival Photo</span>
        </span>
      </SmartImage>
      <div className="p-5 sm:p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-ivory border border-brand-border text-xs font-bold text-brand-vermilion">
                <MapPin className="w-3.5 h-3.5" />
                <Link to={`/areas/${pandal.area_slug}`} className="hover:underline">
                  {pandal.area_name}
                </Link>
                <span>•</span>
                <span>{pandal.zone}</span>
              </span>

              {pandal.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified 2026</span>
                </span>
              )}

              <span className="px-2.5 py-1 rounded-full bg-brand-ivory text-xs font-medium text-brand-muted border border-brand-border/60">
                {pandal.category}
              </span>
            </div>

            <h1 className="text-h1 font-bold text-brand-ink">
              {pandal.name} <span className="block text-lead font-sans font-medium text-brand-muted mt-2">Durga Puja 2026 · {placeName(pandal)}</span>
            </h1>

            {pandal.theme && (
              <div className="text-lead font-semibold text-brand-maroon">
                Theme: <span className="text-brand-primary font-normal">{pandal.theme}</span>
              </div>
            )}
          </div>

          {/* Score & Rating Panel */}
          <div className="flex flex-wrap sm:flex-row md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-2 md:pt-0 w-full md:w-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-center bg-brand-maroon text-[#FFFBF5] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-brand-gold fill-brand-gold/40" />
                  <span className="text-xl font-bold">{pandal.pujo_songi_score}</span>
                </div>
                <span className="text-xs font-medium text-brand-gold-light/90 block mt-0.5">
                  Pandal score
                </span>
              </div>

              <div className="text-center bg-brand-ivory border border-brand-border px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-bold text-xl">
                  <Star className="w-3.5 sm:w-4 h-3.5 sm:h-4 fill-amber-500 text-amber-500" />
                  <span>{pandal.rating}</span>
                </div>
                <span className="text-xs text-brand-muted block mt-0.5">
                  {pandal.rating_count}+ ratings
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => toggleSave(pandal.id)}
                aria-pressed={saved}
                className={`h-11 px-4 rounded-xl border text-sm font-semibold transition-all active:scale-95 shadow-xs flex items-center gap-1.5 ${
                  saved
                    ? 'bg-brand-vermilion text-white border-brand-vermilion'
                    : 'bg-brand-card text-brand-primary border-brand-border hover:bg-brand-ivory'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                <span>{saved ? 'Saved' : 'Save'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share pandal"
                className="w-11 h-11 inline-flex items-center justify-center rounded-xl bg-brand-card text-brand-primary border border-brand-border hover:bg-brand-ivory transition-all active:scale-95 shadow-xs"
                title="Share pandal"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Extensive details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Theme & Architectural Concept */}
          <section className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-7 shadow-songi space-y-3">
            <h2 className="text-xl sm:text-2xl leading-tight font-bold text-brand-ink">
              About {pujaName(pandal)}
            </h2>
            <p className="text-base text-brand-ink/85">
              {pandal.description}
            </p>
            <p className="text-base text-brand-ink/85">
              For 2026, this {pandal.category === 'Theme' ? 'theme' : pandal.category.toLowerCase()} puja presents <strong>“{pandal.theme}”</strong> at {venue}, in the{' '}
              <Link to={`/areas/${pandal.area_slug}`} className="text-brand-crimson underline underline-offset-2">{pandal.area_name}</Link> neighbourhood
              of {pandal.zone}. Pandals are open from Maha Shashti (17 October) to Bijoya Dashami (21 October 2026).
            </p>
            {note && (
              <p className="text-sm text-brand-muted border-l-2 border-brand-gold pl-3">
                <strong className="text-brand-ink">Venue note:</strong> {note}
              </p>
            )}
          </section>

          {/* Visitor Transit & Crowd Guide */}
          <section className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-7 shadow-songi space-y-5">
            <h2 className="text-xl sm:text-2xl leading-tight font-bold text-brand-ink">
              Visiting: time, parking &amp; access
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 sm:p-5 rounded-xl bg-brand-ivory border border-brand-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-muted">
                  <Clock className="w-4 h-4 text-brand-vermilion" />
                  <span>Estimated visit time</span>
                </div>
                <p className="text-base font-semibold text-brand-maroon">
                  ~{pandal.estimated_visit_minutes} minutes
                </p>
                <p className="text-sm text-brand-muted">
                  Includes the queue and time with the pratima. Allow longer on Ashtami and Navami nights.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-brand-ivory border border-brand-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-muted">
                  {pandal.parking_available ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Ban className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Parking</span>
                </div>
                <p className="text-base font-semibold text-brand-ink">
                  {pandal.parking_available ? 'Parking available nearby' : 'No parking — walk in'}
                </p>
                <p className="text-sm text-brand-muted">
                  {pandal.parking_notes}
                </p>
              </div>
            </div>

            {pandal.access_notes && (
              <div className="p-4 rounded-xl bg-amber-50/60 border border-brand-gold/40 text-sm space-y-1">
                <span className="font-semibold text-brand-ink block">Walking access</span>
                <p className="text-brand-muted">{pandal.access_notes}</p>
              </div>
            )}
          </section>

          {/* Getting there */}
          <section className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-7 shadow-songi space-y-4">
            <h2 className="text-xl sm:text-2xl leading-tight font-bold text-brand-ink">
              How to reach {pandal.name}
            </h2>
            <p className="text-sm text-brand-muted">
              Straight-line distances from Siliguri’s main hubs. Roads add roughly a quarter more, and festival diversions can add time after 6 PM.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hubs.map((h) => {
                const Icon = LANDMARK_ICON[h.key] || MapPin;
                return (
                  <li key={h.key} className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-ivory border border-brand-border/70">
                    <Icon className="w-5 h-5 text-brand-crimson shrink-0" aria-hidden="true" />
                    <span className="flex-1 text-sm text-brand-ink">From {h.name}</span>
                    <strong className="text-sm text-brand-ink tabular-nums">{kmLabel(h.km)}</strong>
                  </li>
                );
              })}
            </ul>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-11 text-base font-semibold text-brand-crimson hover:underline underline-offset-4"
            >
              <Navigation className="w-4 h-4" /> Get directions from where you are
            </a>
          </section>

          <Faq faqs={faqs} title={`${pandal.name}: FAQs`} />
        </div>

        {/* Right Column: Directions & Map & Nearby */}
        <div className="space-y-6">
          {/* Location map */}
          <div className="bg-brand-card rounded-2xl border border-brand-border p-4 sm:p-5 shadow-songi space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-brand-ink flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-vermilion" />
                <span>Location</span>
              </h2>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                GPS pin
              </span>
            </div>

            <PandalsMap pandals={locationPin} numbered={false} className="h-56 sm:h-64" />

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 px-4 rounded-xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white font-semibold text-base text-center flex items-center justify-center gap-2 shadow-songi transition-all active:scale-95"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </a>

            <address className="not-italic text-xs text-brand-muted text-center space-y-0.5">
              <span className="block">{venue}, {placeName(pandal)}, West Bengal</span>
              <span className="block font-mono">GPS: {pandal.latitude}, {pandal.longitude}</span>
            </address>
          </div>

          {/* Nearby pandals */}
          {near.length > 0 && (
            <div className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-7 shadow-songi space-y-5">
              <h2 className="font-display text-h3 font-semibold text-brand-ink">
                Pandals near {pandal.name}
              </h2>

              <ul className="space-y-3">
                {near.map((np) => (
                  <li key={np.id}>
                    <Link
                      to={`/pandals/${np.slug}`}
                      className="block p-3.5 rounded-xl bg-brand-ivory hover:bg-white border border-brand-border hover:border-brand-vermilion/40 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-brand-ink truncate">{np.name}</span>
                        <span className="font-semibold text-brand-maroon shrink-0 tabular-nums">{kmLabel(np.km)}</span>
                      </div>
                      <p className="text-sm text-brand-muted mt-1 flex items-center gap-1.5">
                        {np.km <= 2 && <Footprints className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                        <span className="truncate">{np.area_name}{np.km <= 2 ? ` · ~${walkMinutes(np.km)} min walk` : ''}</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              {area && area.count > 1 && (
                <Link to={`/areas/${pandal.area_slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-crimson hover:underline underline-offset-4">
                  All {area.count} pandals in {pandal.area_name} <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

          {/* Committee */}
          <div className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi">
            <h2 className="font-display text-h3 font-semibold text-brand-ink">Puja details</h2>
            <dl className="mt-3 divide-y divide-brand-border/60 text-sm">
              {[
                ['Committee', pandal.committee_name || pandal.name],
                ['2026 venue', venue],
                ['Neighbourhood', `${pandal.area_name}, Siliguri`],
                ['Zone', pandal.zone],
                ['Style', pandal.category],
                ['Location check', pandal.coordinate_status === 'VERIFIED_2026' ? 'Verified for 2026' : pandal.coordinate_status],
              ].map(([k, v]) => (
                <div key={k} className="py-2.5 flex justify-between gap-4">
                  <dt className="text-brand-muted">{k}</dt>
                  <dd className="font-semibold text-brand-ink text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Mobile sticky actions: always one tap away while scrolling */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <div className="lg:hidden fixed inset-x-0 z-30 bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] px-3 pb-2">
        <div className="max-w-md mx-auto flex items-center gap-2 p-2 rounded-2xl bg-brand-card/95 backdrop-blur-md border border-brand-border shadow-songi-lg">
          <button
            type="button"
            onClick={() => toggleSave(pandal.id)}
            aria-pressed={saved}
            className={`flex-1 h-12 rounded-xl inline-flex items-center justify-center gap-2 text-base font-semibold transition-all active:scale-95 ${
              saved
                ? 'bg-brand-vermilion-light text-brand-crimson border border-brand-vermilion/30'
                : 'bg-brand-ivory text-brand-primary border border-brand-border'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-brand-crimson' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share pandal"
            className="h-12 w-12 shrink-0 rounded-xl inline-flex items-center justify-center bg-brand-ivory text-brand-primary border border-brand-border active:scale-95"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[1.6] h-12 rounded-xl inline-flex items-center justify-center gap-2 bg-brand-crimson text-white text-base font-semibold shadow-vermilion-glow active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
}
