import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, ArrowRight, Footprints, Bike, Car, Clock, MapPin } from 'lucide-react';
import PandalCard from '../components/PandalCard';
import QuickRouteBuilder from '../components/QuickRouteBuilder';
import Photo from '../components/Photo';
import SmartImage from '../components/SmartImage';
import { SectionHeading } from '../components/PageHeader';
import {
  DhakSketch, KashSketch, DurgaEyesSketch, DhunuchiSketch, PandalSketch, LotusSketch, AlpanaSketch, LaalPaar,
} from '../components/BengalArt';
import { routeImage } from '../lib/images';
import { estimateCircuit, formatDuration, formatKm } from '../lib/routeEngine';
import pandalsData from '../data/pandals.json';
import eventsData from '../data/events.json';
import routesData from '../data/routes.json';
import { BLOG_POSTS } from '../data/blog';
import { PostCover, STATS } from '../components/BlogBlocks';
import Faq from '../components/Faq';
import { useSeo } from '../lib/seo';
import { organization, website, festival2026, faqPage } from '../lib/schema';
import { formatDate, eventStart } from '../lib/dates';
import { zoneTable } from '../lib/blogQueries';
import { AREA_STATS, LANDMARKS, distanceKm } from '../lib/geo';

const HERO_PHOTOS = ['siliguri-palace-night', 'siliguri-pandal-red', 'siliguri-idol-golden'];

const EVENT_BN = {
  mahalaya: 'মহালয়া',
  shashti: 'ষষ্ঠী',
  saptami: 'সপ্তমী',
  ashtami: 'অষ্টমী',
  navami: 'নবমী',
  dashami: 'দশমী',
};

const COLOURS_OF_PUJO = [
  { slug: 'dhak-drummers', bn: 'ঢাকের বাদ্যি', en: 'The beat of the dhak' },
  { slug: 'dhunuchi-smoke', bn: 'ধুনুচি নাচ', en: 'Dhunuchi dance at aarti' },
  { slug: 'kash-sky', bn: 'কাশফুল', en: 'Kash flowers of Sharat' },
  { slug: 'artisan-eye', bn: 'চক্ষুদান', en: 'Painting the Goddess’s eyes' },
  { slug: 'kumartuli-idol', bn: 'মৃন্ময়ী', en: 'From clay to Goddess' },
  { slug: 'idol-daaker-saaj', bn: 'ডাকের সাজ', en: 'Classic shola ornaments' },
  { slug: 'boron-hands', bn: 'দেবী বরণ', en: 'Boron on Dashami' },
  { slug: 'alpana-floor', bn: 'আলপনা', en: 'Alpana at the doorstep' },
  { slug: 'lights-gate', bn: 'আলোকসজ্জা', en: 'Festival lights' },
];

const SILIGURI_GALLERY = [
  { slug: 'siliguri-pandal-red', span: 'col-span-2 row-span-2', caption: 'A Siliguri pandal interior' },
  { slug: 'siliguri-idol-white', span: '', caption: 'Pratima, Siliguri' },
  { slug: 'siliguri-idol-red', span: '', caption: 'Pratima, Siliguri' },
  { slug: 'siliguri-pandal-inside', span: '', caption: 'Inside a theme pandal' },
  { slug: 'siliguri-mahananda', span: '', caption: 'Mahananda & Balason rivers' },
];

// Zone cards are built from the pandal data, so counts stay correct when pandals change
const ZONE_STYLE = {
  'Central Siliguri': { bn: 'মধ্য শিলিগুড়ি', anchor: 'central', Sketch: PandalSketch },
  'South & South-Central': { bn: 'দক্ষিণ', anchor: 'south', Sketch: LotusSketch },
  'East & Sevoke Road corridor': { bn: 'সেবক রোড', anchor: 'east', Sketch: DhakSketch },
  'North Siliguri': { bn: 'উত্তর', anchor: 'north', Sketch: KashSketch },
  'West, Junction & Rajganj': { bn: 'পশ্চিম', anchor: 'west', Sketch: DhunuchiSketch },
};
const ZONES = zoneTable(pandalsData).map((z) => ({ ...z, ...ZONE_STYLE[z.name] }));
const TOP_PANDALS = [...pandalsData].sort((a, b) => b.pujo_songi_score - a.pujo_songi_score || a.name.localeCompare(b.name)).slice(0, 5);
const TOP_AREAS = [...AREA_STATS].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 6);
const CENTRE = { lat: 26.71117, lng: 88.42605 }; // Venus More
const kmFromCentre = (key) => Math.round(distanceKm(CENTRE, LANDMARKS.find((l) => l.key === key)));

const HOME_FAQS = [
  {
    q: 'When is Durga Puja 2026 in Siliguri?',
    a: `Mahalaya is on **Saturday, 10 October 2026**. The main Pujo days run from **Maha Shashti on Saturday, 17 October** to **Bijoya Dashami on Wednesday, 21 October 2026**, with Saptami on 18 October, Ashtami on 19 October and Navami on 20 October. See the [day-by-day Puja schedule](/puja-schedule).`,
  },
  {
    q: 'How many Durga Puja pandals are there in Siliguri in 2026?',
    a: `Pujo Pandal lists **${STATS.total} Durga Puja pandals across ${STATS.areas} Siliguri neighbourhoods** for 2026, each pinned at its 2026 venue on the [Siliguri Puja map](/siliguri-puja-map). Central Siliguri has the most, with ${ZONES[0].count} pandals.`,
  },
  {
    q: 'Which are the best Durga Puja pandals in Siliguri this year?',
    a: `The highest-rated pandals on our 2026 list are ${TOP_PANDALS.map((p) => `[${p.name}](/pandals/${p.slug}) (${p.area_name})`).join(', ')}. Browse [all Siliguri pandals](/siliguri-puja-pandals) to filter by theme, traditional pujas and parking.`,
  },
  {
    q: 'Which areas of Siliguri have the most pandals?',
    a: `${TOP_AREAS.map((a) => `[${a.name}](/areas/${a.slug}) (${a.count})`).join(', ')} have the most pandals. Each area page lists its pandals with a map, parking notes and nearby neighbourhoods.`,
  },
  {
    q: 'What is the best way to go pandal hopping in Siliguri?',
    a: 'Walk the dense central clusters — Babupara, Hakimpara, Ashrampara and Deshbandhupara are close together — and use a bike or car only to jump between zones. Start before 6 PM: Hill Cart Road, Sevoke Road and Venus More are busiest from 7 PM to midnight on Saptami to Navami. The [smart route planner](/siliguri-puja-routes) orders pandals for your start point, travel mode and time.',
  },
  {
    q: 'How far are the Siliguri pandals from NJP station and Bagdogra Airport?',
    a: `Central Siliguri (Venus More) is about ${kmFromCentre('njp')} km in a straight line from New Jalpaiguri (NJP) station and about ${kmFromCentre('airport')} km from Bagdogra Airport; roads add a little more. Our guide to [pandals near NJP and Siliguri Junction](/blog/durga-puja-pandal-map-2026-near-njp-siliguri-junction) lists the closest pujas if you only have a few hours between trains or flights.`,
  },
  {
    q: 'Is it free to visit the pandals, and do I need an app?',
    a: 'Siliguri’s community Durga Puja pandals are free to visit. Pujo Pandal is free too and works in any phone browser — no app or sign-up. Save pandals to [your plan](/saved) and open the whole route in Google Maps.',
  },
];

const MODE_ICON = { Walking: Footprints, 'Bike / Scooty': Bike, 'Car / Auto': Car };
const pandalBySlug = Object.fromEntries(pandalsData.map((p) => [p.slug, p]));

// Next festival moment (Mahalaya at 4 AM, puja days from 6 AM), so the countdown never freezes.
// `now` is null on the server and the first client render, so the prerendered HTML hydrates cleanly.
function useNextEvent() {
  const events = useMemo(() => eventsData.map((e) => ({ ...e, at: eventStart(e) })).sort((a, b) => a.at - b.at), []);
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const DAY = 86400000;
  const today = now != null ? events.find((e) => now >= e.at && now < e.at + DAY - 6 * 3600000) : null;
  const next = now != null ? events.find((e) => e.at > now) : events.find((e) => e.event_type === 'shashti');
  const diff = next && now != null ? next.at - now : 0;
  return {
    events,
    now,
    today,
    next,
    left: {
      days: Math.floor(diff / DAY),
      hours: Math.floor((diff / 3600000) % 24),
      minutes: Math.floor((diff / 60000) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    },
  };
}

export default function Home() {
  const { events, now, today, next, left } = useNextEvent();

  useSeo({
    title: 'Siliguri Durga Puja 2026 – Pandal Map, Routes & Dates',
    description: `Siliguri Durga Puja 2026 guide: ${pandalsData.length} pandals across ${STATS.areas} areas on one map, smart pandal-hopping routes, Puja dates (17–21 Oct) and parking tips.`,
    path: '/',
    imageAlt: 'Pujo Pandal — Siliguri Durga Puja 2026 guide',
    jsonLd: [organization(), website(), festival2026(eventsData), faqPage(HOME_FAQS)],
  });

  const featuredPandals = pandalsData
    .filter((p) => p.featured || Number(p.pujo_songi_score || 0) >= 9.5)
    .slice(0, 4);

  return (
    <div className="space-y-section">
      {/* ───────────────── HERO ───────────────── */}
      <section className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-6 sm:-mt-10">
        <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-5 pb-10 sm:pt-12 sm:pb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-14 items-center">
            {/* Photo in a temple-arch frame */}
            <div className="relative order-1 lg:order-2 mx-auto w-full max-w-[22rem] sm:max-w-md lg:max-w-none">
              <div className="relative isolate">
                <div className="relative aspect-[4/3.7] sm:aspect-[4/4.6] rounded-t-full rounded-b-[2rem] overflow-hidden ring-[6px] ring-brand-card shadow-songi-lg bg-brand-maroon">
                  {HERO_PHOTOS.map((slug, i) => (
                    <div
                      key={slug}
                      className="absolute inset-0"
                      style={{
                        animation: 'hero-fade 18s ease-in-out infinite both',
                        animationDelay: `${[0, -12, -6][i]}s`,
                      }}
                    >
                      <Photo
                        slug={slug}
                        eager={i === 0}
                        alt={['Illuminated Durga Puja pandal in Siliguri at night', 'Durga Puja pandal interior in Siliguri', 'Durga idol at a Siliguri Durga Puja pandal'][i]}
                        sizes="(max-width: 640px) 90vw, 560px"
                        credit="none"
                        className="w-full h-full"
                      />
                    </div>
                  ))}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-black/45 backdrop-blur-sm text-xs font-medium text-white/90">
                    Real photos · Durga Puja in Siliguri
                  </span>
                </div>
                {/* offset arch outline */}
                <div className="absolute inset-0 -z-10 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-t-full rounded-b-[2rem] border-2 border-brand-crimson/70" aria-hidden="true" />
                {/* sketch accents */}
                <div className="absolute -left-4 sm:-left-10 bottom-6 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-brand-ivory border border-brand-border shadow-songi flex items-center justify-center text-brand-crimson">
                  <DhakSketch className="w-14 h-14 sm:w-20 sm:h-20" />
                </div>
                <KashSketch className="absolute -right-3 sm:-right-8 -top-2 w-14 h-24 sm:w-20 sm:h-32 text-brand-gold" />
                <Photo
                  slug="kash-sunset"
                  alt="Kash flowers at sunset"
                  credit="none"
                  sizes="120px"
                  className="hidden sm:block absolute -right-6 bottom-10 w-24 h-24 rounded-full ring-4 ring-brand-card shadow-songi"
                />
              </div>
            </div>

            {/* Text */}
            <div className="order-2 lg:order-1 text-center lg:text-left space-y-5 sm:space-y-6">
              <p className="font-bengali-serif text-base text-brand-crimson">শারদীয়া ১৪৩৩ · শিলিগুড়ি</p>

              <h1 className="text-display font-bold text-brand-ink">
                <span className="block font-sans text-eyebrow uppercase text-brand-muted mb-4">Siliguri Durga Puja 2026</span>
                See more pandals.
                <span className="block italic font-medium text-brand-crimson">Spend less time on the road.</span>
              </h1>

              <p className="font-bengali-serif text-xl sm:text-2xl leading-snug text-brand-ink/80">
                পুজো ঘোরার সঙ্গী — শিলিগুড়ি
              </p>

              <p className="text-lead text-brand-muted max-w-xl mx-auto lg:mx-0">
                Every Siliguri Durga Puja pandal for 2026 on one map — with smart routes built around your time, your starting point and the way you travel.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
                <a
                  href="#quick-route-builder"
                  className="min-h-[3.25rem] px-7 rounded-full bg-brand-crimson hover:bg-brand-vermilion-hover text-white font-semibold text-base shadow-vermilion-glow transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-brand-gold-light" />
                  Build my Puja route
                </a>
                <Link
                  to="/siliguri-puja-pandals"
                  className="min-h-[3.25rem] px-7 rounded-full border-2 border-brand-ink/80 text-brand-ink hover:bg-brand-ink hover:text-white font-semibold text-base transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" />
                  Explore pandals
                </Link>
              </div>

              <dl className="grid grid-cols-3 max-w-md mx-auto lg:mx-0 pt-3 divide-x divide-brand-border">
                {[
                  { n: pandalsData.length, label: 'Pandals' },
                  { n: STATS.areas, label: 'Neighbourhoods' },
                  { n: 5, label: 'Days of Pujo' },
                ].map((s) => (
                  <div key={s.label} className="px-2 text-center">
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-3xl sm:text-4xl font-semibold leading-none text-brand-ink">{s.n}</dd>
                    <dd className="text-xs font-medium text-brand-muted mt-2">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
        <LaalPaar />
      </section>

      {/* ───────────────── NEXT EVENT ───────────────── */}
      <section aria-label="Festival countdown" className="relative overflow-hidden rounded-[2rem] bg-brand-crimson text-white shadow-songi-lg">
        <AlpanaSketch className="absolute -right-24 -top-24 w-80 h-80 text-white/15" strokeWidth={1.2} />
        <AlpanaSketch className="absolute -left-28 -bottom-28 w-72 h-72 text-white/10" strokeWidth={1.2} />
        <div className="relative grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 sm:gap-8 items-center px-5 py-7 sm:p-10">
          <div className="space-y-3 text-center md:text-left">
            {today ? (
              <>
                <p className="eyebrow text-brand-gold-light">Today in Siliguri</p>
                <h2 className="text-h2 font-bold">
                  <span className="font-bengali-serif font-normal mr-2">{EVENT_BN[today.event_type]}</span>
                  {today.event_name}
                </h2>
                <p className="text-base text-white/80 max-w-lg mx-auto md:mx-0">{today.description}</p>
              </>
            ) : next ? (
              <>
                <p className="eyebrow text-brand-gold-light">
                  {now == null ? 'Durga Puja 2026 begins' : 'Coming up'} · {formatDate(next.date, { weekday: 'long', year: false })}
                </p>
                <h2 className="text-h2 font-bold">
                  <span className="font-bengali-serif font-normal mr-2">{EVENT_BN[next.event_type]}</span>
                  {next.event_name}
                </h2>
                <p className="text-base text-white/80 max-w-lg mx-auto md:mx-0">{next.description}</p>
              </>
            ) : (
              <>
                <h2 className="text-h2 font-bold font-bengali-serif">আসছে বছর আবার হবে</h2>
                <p className="text-base text-white/80">Pujo is over for this year. See you next Sharat!</p>
              </>
            )}
          </div>
          {next && !today && (
            <div className="flex justify-center gap-2 sm:gap-3" role="timer" aria-label="Time left">
              {[
                { v: left.days, l: 'Days' },
                { v: left.hours, l: 'Hrs' },
                { v: left.minutes, l: 'Min' },
                { v: left.seconds, l: 'Sec' },
              ].map((u) => (
                <div key={u.l} className="w-[4.5rem] sm:w-20 rounded-2xl bg-white/10 border border-white/20 py-3 text-center">
                  <div className="font-display text-3xl sm:text-4xl leading-none font-semibold tabular-nums text-brand-gold-light">{now == null ? '--' : String(u.v).padStart(2, '0')}</div>
                  <div className="text-xs font-medium text-white/75 mt-2">{u.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Five days strip */}
        <ol className="relative grid grid-cols-6 border-t border-white/15 text-center">
          {events.map((e) => {
            const isToday = today?.id === e.id;
            const isPast = !isToday && now != null && e.at < now;
            return (
              <li key={e.id} className={`py-3.5 px-1 ${isToday ? 'bg-brand-gold text-brand-maroon-dark' : isPast ? 'text-white/45' : 'text-white'}`}>
                <div className="font-bengali-serif text-sm sm:text-lg leading-none">{EVENT_BN[e.event_type]}</div>
                <time dateTime={e.date} className="block text-xs mt-1.5 opacity-80">{formatDate(e.date, { month: 'short', year: false })}</time>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ───────────────── COLOURS OF PUJO ───────────────── */}
      <section aria-label="Colours of Pujo" className="space-y-content">
        <SectionHeading
          bn="পুজোর রং"
          title="The colours of Pujo"
          sub="The sights and sounds that make Bengal’s biggest festival — from Kumartuli clay to the last dhunuchi dance."
        />
        <div className="rail -mx-4 px-4 flex gap-3 overflow-x-auto pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible">
          {COLOURS_OF_PUJO.map((item, i) => (
            <figure
              key={item.slug}
              className={`group shrink-0 w-[68vw] xs:w-[56vw] sm:w-auto ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''} ${i >= 7 ? 'lg:hidden' : ''}`}
            >
              <Photo
                slug={item.slug}
                alt={item.en}
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 20vw"
                className={`w-full rounded-2xl ${i === 0 ? 'aspect-[3/4] lg:aspect-auto lg:h-[calc(100%-3.25rem)]' : 'aspect-[3/4]'} ${i % 2 ? 'sm:rounded-t-[5rem]' : ''}`}
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="pt-3 px-0.5">
                <span className="block font-bengali-serif text-lg leading-none text-brand-ink">{item.bn}</span>
                <span className="block text-sm text-brand-muted mt-1.5">{item.en}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ───────────────── ROUTE BUILDER ───────────────── */}
      <section aria-label="Plan your route" className="space-y-content">
        <SectionHeading
          bn="রুট বানান"
          title="Plan your Pujo in a minute"
          sub="Pick where you start, how you travel and how long you have — we’ll order the pandals for you."
        />
        <QuickRouteBuilder showHeader={false} />
      </section>

      {/* ───────────────── FEATURED ───────────────── */}
      <section aria-label="Featured Pandals" className="space-y-content">
        <SectionHeading
          bn="সেরা প্যান্ডেল"
          title="Featured pandals"
          sub="Top-rated installations this year, from verified committee records."
          to="/siliguri-puja-pandals"
          linkLabel={`All ${pandalsData.length} pandals`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredPandals.map((pandal) => (
            <PandalCard key={pandal.id} pandal={pandal} />
          ))}
        </div>
      </section>

      {/* ───────────────── SILIGURI GALLERY ───────────────── */}
      <section aria-label="Pujo in Siliguri" className="space-y-content">
        <SectionHeading
          bn="শিলিগুড়ির পুজো"
          title="Pujo in Siliguri"
          sub="Real moments from pandals across the city, shared by local photographers."
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-[9.5rem] sm:auto-rows-[12rem] gap-3">
          {SILIGURI_GALLERY.map((g) => (
            <figure key={g.slug} className={`relative group ${g.span}`}>
              <Photo
                slug={g.slug}
                alt={g.caption}
                sizes="(max-width: 640px) 50vw, 25vw"
                className="w-full h-full rounded-2xl"
                imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-card/90 text-xs font-semibold text-brand-ink">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-sm text-brand-muted">
          Photos are openly licensed on Wikimedia Commons. <Link to="/photo-credits" className="underline underline-offset-2 hover:text-brand-crimson">See all photo credits</Link>.
        </p>
      </section>

      {/* ───────────────── ZONES ───────────────── */}
      <section aria-label="Explore by zone" className="space-y-content">
        <SectionHeading
          bn="পাড়ায় পাড়ায়"
          title="Explore zone by zone"
          sub="Siliguri’s pandals fall into five zones. Cover one or two per evening to keep travel short."
          to="/areas"
          linkLabel="All areas"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {ZONES.map(({ name, bn, areas, count, anchor, Sketch }) => (
            <Link
              key={name}
              to={`/blog/siliguri-durga-puja-pandal-map-2026-zone-wise#${anchor}`}
              className="group relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-crimson/40 hover:shadow-songi-lg transition-all"
            >
              <Sketch className="absolute -right-3 -bottom-3 w-24 h-24 text-brand-crimson/15 group-hover:text-brand-crimson/25 transition-colors" />
              <div className="relative">
                <div className="flex items-baseline justify-between">
                  <span className="font-bengali-serif text-brand-crimson">{bn}</span>
                  <span className="font-display text-3xl font-semibold text-brand-ink">{count}</span>
                </div>
                <h3 className="font-display text-h3 font-semibold text-brand-ink mt-3">{name}</h3>
                <p className="text-sm text-brand-muted mt-1.5">{areas.slice(0, 4).join(', ')}</p>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-crimson mt-5">
                  {count} pandals <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── ROUTES ───────────────── */}
      <section aria-label="Popular routes" className="space-y-content">
        <SectionHeading
          bn="চেনা পথ"
          title="Tried-and-tested routes"
          sub="Local circuits planned around road widths and evening diversions."
          to="/siliguri-puja-routes"
          linkLabel="All smart routes"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {routesData.map((route) => {
            const stops = route.stopping_points.map((s) => pandalBySlug[s]).filter(Boolean);
            const est = estimateCircuit(stops, route.travel_mode);
            const ModeIcon = MODE_ICON[route.travel_mode] || MapPin;
            return (
              <Link
                key={route.id}
                to={`/routes/${route.slug}`}
                className="group bg-brand-card rounded-2xl border border-brand-border overflow-hidden hover:shadow-songi-lg hover:border-brand-crimson/40 transition-all flex flex-col"
              >
                <div className="relative bg-brand-maroon">
                  <SmartImage src={routeImage(route.slug)} alt={route.title} className="w-full h-44 object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-card/95 text-xs font-semibold text-brand-ink">
                    <ModeIcon className="w-3.5 h-3.5 text-brand-crimson" /> {route.travel_mode}
                  </span>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  {route.title_bengali && <p className="font-bengali-serif text-brand-crimson text-sm">{route.title_bengali}</p>}
                  <h3 className="font-display text-h3 font-semibold text-brand-ink mt-1">{route.title}</h3>
                  <div className="mt-auto pt-5 flex items-center gap-4 text-sm text-brand-muted">
                    <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{est ? formatDuration(est.totalMinutes) : route.duration_str}</span>
                    <span>{est ? formatKm(est.distanceKm) : route.distance_km}</span>
                    <span>{stops.length} pandals</span>
                    <ArrowRight className="w-4 h-4 ml-auto text-brand-crimson group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ───────────────── BLOG ───────────────── */}
      <section aria-label="From the blog" className="space-y-content">
        <SectionHeading
          bn="পুজোর খবর"
          title="Durga Puja pandal map 2026 guides"
          sub="Zones, walking clusters, parking, dates and the best pujas — written by locals."
          to="/blog"
          linkLabel={`All ${BLOG_POSTS.length} articles`}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group bg-brand-card rounded-2xl border border-brand-border overflow-hidden hover:shadow-songi-lg hover:border-brand-crimson/40 transition-all flex flex-col"
            >
              <PostCover post={post} sizes="(max-width: 768px) 100vw, 33vw" className="h-44" />
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <span className="eyebrow text-brand-crimson">{post.category}</span>
                <h3 className="font-display text-h3 font-semibold text-brand-ink mt-2 group-hover:text-brand-crimson transition-colors">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────────── LOCAL GUIDE ───────────────── */}
      <section aria-labelledby="siliguri-guide" className="space-y-content">
        <div>
          <p className="font-bengali-serif text-brand-crimson text-lg sm:text-xl leading-none">শিলিগুড়ির দুর্গাপুজো</p>
          <h2 id="siliguri-guide" className="text-h2 font-bold text-brand-ink mt-2">Siliguri Durga Puja 2026: the local guide</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-8 lg:gap-12">
          <div className="space-y-5 text-base sm:text-lg leading-relaxed text-brand-ink/85 max-w-3xl">
            <p>
              Durga Puja is Siliguri’s biggest festival. For five days in October the city — the gateway to Darjeeling, Sikkim
              and the Dooars — turns its paras into open-air galleries, with community pujas that range from traditional
              ekchala idols to giant theme pandals and late-night light shows. Pujo Pandal maps <strong>{STATS.total} of them across {STATS.areas} neighbourhoods</strong>,
              from <Link to="/areas/hakimpara" className="text-brand-crimson underline underline-offset-2">Hakimpara</Link> and{' '}
              <Link to="/areas/babupara" className="text-brand-crimson underline underline-offset-2">Babupara</Link> in the centre to{' '}
              <Link to="/areas/champasari" className="text-brand-crimson underline underline-offset-2">Champasari</Link> in the north,{' '}
              <Link to="/areas/matigara" className="text-brand-crimson underline underline-offset-2">Matigara</Link> in the west and the{' '}
              <Link to="/areas/sevoke-road" className="text-brand-crimson underline underline-offset-2">Sevoke Road</Link> corridor in the east.
            </p>
            <p>
              <strong>Mahalaya falls on Saturday, 10 October 2026</strong>, when Siliguri wakes at 4 AM to the Mahishasuramardini broadcast.
              Pandals open from <strong>Maha Shashti on Saturday, 17 October</strong>; Saptami, Ashtami and Navami (18–20 October) are the
              busiest nights, and <strong>Bijoya Dashami on Wednesday, 21 October</strong> brings Sindoor Khela and immersion processions
              to the Mahananda. The <Link to="/puja-schedule" className="text-brand-crimson underline underline-offset-2">Puja schedule</Link> has every day’s rituals.
            </p>
            <p>
              Central Siliguri holds {ZONES[0].count} of the {STATS.total} pandals, packed into clusters you can walk in an evening.
              {' '}{STATS.parking} pandals have parking close by; the rest are walk-in only, so park at the edge of a cluster and walk in.
              Walk the centre, take a bike or car between zones, and let the{' '}
              <Link to="/siliguri-puja-routes" className="text-brand-crimson underline underline-offset-2">route planner</Link> put the stops in order.
            </p>
            <p>
              Coming from outside the city? New Jalpaiguri (NJP) station is about {kmFromCentre('njp')} km from Venus More in a straight line and
              Bagdogra Airport about {kmFromCentre('airport')} km — taxis and autos run from both. Check the{' '}
              <Link to="/blog/durga-puja-pandal-map-2026-near-njp-siliguri-junction" className="text-brand-crimson underline underline-offset-2">pandals near NJP and Siliguri Junction</Link>{' '}
              if you only have a few hours.
            </p>
          </div>
          <aside className="space-y-5">
            <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
              <h3 className="font-display text-h3 font-semibold text-brand-ink">Busiest neighbourhoods</h3>
              <ul className="mt-3 divide-y divide-brand-border/70 text-sm">
                {TOP_AREAS.map((a) => (
                  <li key={a.slug}>
                    <Link to={`/areas/${a.slug}`} className="flex items-center justify-between py-2.5 hover:text-brand-crimson">
                      <span className="font-medium text-brand-ink">{a.name} pandals</span>
                      <span className="text-brand-muted">{a.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-border bg-brand-card p-5">
              <h3 className="font-display text-h3 font-semibold text-brand-ink">Top-rated in 2026</h3>
              <ol className="mt-3 space-y-2.5 text-sm">
                {TOP_PANDALS.map((p, i) => (
                  <li key={p.slug} className="flex gap-2.5">
                    <span className="w-5 shrink-0 font-semibold text-brand-crimson tabular-nums">{i + 1}.</span>
                    <Link to={`/pandals/${p.slug}`} className="hover:text-brand-crimson">
                      <span className="font-medium text-brand-ink">{p.name}</span>
                      <span className="block text-brand-muted">{p.area_name}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <Faq faqs={HOME_FAQS} title="Siliguri Durga Puja 2026: questions answered" />

      {/* ───────────────── CLOSING ───────────────── */}
      <section aria-label="Ashche bochhor abar hobe" className="relative overflow-hidden rounded-[2rem] text-white -mx-1 sm:mx-0">
        <Photo slug="dhunuchi-bw" alt="Dhunuchi dance" credit="corner" sizes="100vw" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-maroon-dark/95 via-brand-maroon-dark/75 to-brand-maroon-dark/30" />
        <div className="relative px-6 py-10 sm:p-14 max-w-xl space-y-5">
          <DurgaEyesSketch className="w-36 h-14 text-brand-gold-light" />
          <p className="font-bengali-serif text-h1">আসছে বছর আবার হবে</p>
          <p className="text-white/85 text-base">
            “Next year, it will happen again.” Save your favourite pandals and carry your plan in your pocket all five days.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/saved" className="min-h-[3rem] px-6 rounded-full bg-brand-gold text-brand-maroon-dark font-semibold inline-flex items-center gap-2 hover:bg-brand-gold-light transition-colors">
              <LotusSketch className="w-6 h-5" strokeWidth={2} /> My saved plan
            </Link>
            <Link to="/puja-schedule" className="min-h-[3rem] px-6 rounded-full border border-white/50 font-semibold inline-flex items-center hover:bg-white/10 transition-colors">
              Puja schedule
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
