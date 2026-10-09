import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, Waves, Palette, ArrowRight } from 'lucide-react';
import Photo from '../components/Photo';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import Faq from '../components/Faq';
import { useSeo } from '../lib/seo';
import { breadcrumbs, mahalaya2026, faqPage } from '../lib/schema';

const MAHALAYA_AT = new Date('2026-10-10T04:00:00+05:30').getTime();
const CRUMBS = [['Home', '/'], ['Mahalaya 2026', '/mahalaya']];

const FAQS = [
  {
    q: 'When is Mahalaya in 2026?',
    a: 'Mahalaya 2026 is on **Saturday, 10 October 2026**. It marks the end of Pitri Paksha and the start of Devi Paksha; Maha Shashti follows a week later on Saturday, 17 October.',
  },
  {
    q: 'What time is the Mahishasuramardini broadcast on Mahalaya?',
    a: 'All India Radio (Akashvani) broadcasts Mahishasuramardini, with Birendra Krishna Bhadra’s Chandi Path, at 4 AM on Mahalaya morning. Many Siliguri homes still tune in on the radio.',
  },
  {
    q: 'Where is tarpan done in Siliguri on Mahalaya?',
    a: 'People offer tarpan to their ancestors at dawn on the ghats of the Mahananda river. Go early — the ghats are busiest just after sunrise.',
  },
  {
    q: 'Are the pandals open on Mahalaya?',
    a: 'Most pandals are still being finished on Mahalaya; a few open early with an inauguration. The main pandal hopping days are Shashti to Navami (17–20 October 2026). See the [Puja schedule](/puja-schedule).',
  },
];

export default function MahalayaPage() {
  useSeo({
    title: 'Mahalaya 2026 in Siliguri – Date, Time & Tarpan',
    description: 'Mahalaya 2026 is on Saturday, 10 October. The 4 AM Mahishasuramardini broadcast, Chandi Path, tarpan on the Mahananda ghats and how Siliguri welcomes Durga Puja.',
    path: '/mahalaya',
    image: '/images/photos/kash-sunset.webp',
    imageAlt: 'Kash flowers at sunset — the season of Mahalaya',
    jsonLd: [breadcrumbs(CRUMBS), mahalaya2026(), faqPage(FAQS)],
  });

  // null until mounted, so the prerendered page and the first client render match
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const diff = now == null ? null : MAHALAYA_AT - now;
  const passed = diff != null && diff <= 0;
  const timeLeft = {
    days: diff > 0 ? Math.floor(diff / 86400000) : 0,
    hours: diff > 0 ? Math.floor((diff / 3600000) % 24) : 0,
    minutes: diff > 0 ? Math.floor((diff / 60000) % 60) : 0,
    seconds: diff > 0 ? Math.floor((diff / 1000) % 60) : 0,
  };

  return (
    <div className="space-y-section">
      <Breadcrumbs items={[['Home', '/'], ['Mahalaya 2026']]} />
      <PageHeader
        bn="মহালয়া"
        kicker="The dawn before Pujo"
        title="Mahalaya 2026 in Siliguri"
        description="From the 4 AM radio voice of Birendra Krishna Bhadra to tarpan on the Mahananda ghats — the morning Pujo truly begins."
        photo="kash-sunset"
        photoAlt="Kash flowers at sunset"
      />

      {/* Countdown Card */}
      <div className="relative isolate overflow-hidden w-full bg-gradient-to-tr from-brand-maroon via-brand-maroon-dark to-brand-primary text-white rounded-3xl p-8 shadow-songi text-center space-y-6">
        <Photo
          slug="siliguri-mahananda"
          alt=""
          credit="none"
          sizes="100vw"
          className="absolute inset-0 -z-10 opacity-40"
        />
        <div className="space-y-1">
          <span className="eyebrow text-brand-gold">
            Saturday, October 10, 2026 • 04:00 AM IST
          </span>
          <h2 className="text-h2 font-bold">
            {passed ? 'Mahalaya has dawned — Pujo is here' : 'Countdown to the Sacred Dawn'}
          </h2>
          <p className="text-sm text-white/80 font-bengali">
            বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ ও বোধন সঙ্গীত
          </p>
        </div>

        <div className={`flex flex-wrap items-center justify-center gap-3 ${passed ? 'hidden' : ''}`} role="timer" aria-label="Time until Mahalaya">
          {[
            { val: timeLeft.days, label: 'Days' },
            { val: timeLeft.hours, label: 'Hours' },
            { val: timeLeft.minutes, label: 'Minutes' },
            { val: timeLeft.seconds, label: 'Seconds' },
          ].map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 min-w-[75px] border border-white/15"
            >
              <span className="text-3xl font-bold text-brand-gold font-mono">
                {now == null ? '--' : String(unit.val).padStart(2, '0')}
              </span>
              <span className="text-xs font-medium text-white/75 mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Three Core Traditions of Siliguri */}
      <div className="space-y-6">
        <div>
          <h2 className="text-h2 font-bold text-brand-ink">
            Mahalaya Traditions in Siliguri
          </h2>
          <p className="text-sm text-brand-muted mt-0.5">
            How Siliguri welcomes the homecoming of Uma on the banks of North Bengal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-display text-h3 font-semibold text-brand-ink">
              4:00 AM Akashvani Broadcast
            </h3>
            <p className="text-sm text-brand-muted">
              Every Bengali household tunes in at dawn to All India Radio for Birendra Krishna Bhadra's immortal rendition of Mahisasuramardini, filling every neighborhood with conch shells and incense.
            </p>
          </div>

          <div className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="font-display text-h3 font-semibold text-brand-ink">
              Mahananda River Tarpan
            </h3>
            <p className="text-sm text-brand-muted">
              Thousands congregate at Mahananda Ghat (Lalmohan Ghat &amp; Gurung Basti) at sunrise to offer sesame seeds and water (Tarpan) in remembrance of their departed ancestors.
            </p>
          </div>

          <div className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="font-display text-h3 font-semibold text-brand-ink">
              Chokkhudaan in Kumartoli
            </h3>
            <p className="text-sm text-brand-muted">
              At the artisan workshops along Kumartoli and Siliguri artists' colonies, master sculptors ritually draw the sacred eyes of the Goddess, giving life to clay idols.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="p-8 rounded-3xl bg-brand-card border border-brand-border shadow-songi flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-h3 font-semibold text-brand-ink">
            Explore the Full Festival Calendar
          </h3>
          <p className="text-sm text-brand-muted">
            See the exact dates and auspicious hours for Shashti, Saptami, Ashtami, and Dashami.
          </p>
        </div>

        <Link
          to="/puja-schedule"
          className="h-12 px-6 rounded-full bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-base font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <span>View 2026 Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Faq faqs={FAQS} title="Mahalaya 2026: FAQs" />
    </div>
  );
}
