import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck } from 'lucide-react';
import eventsData from '../data/events.json';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import Faq from '../components/Faq';
import { useSeo } from '../lib/seo';
import { breadcrumbs, festival2026, faqPage } from '../lib/schema';
import { formatDate, weekdayOf } from '../lib/dates';

const EVENT_BN = { mahalaya: 'মহালয়া', shashti: 'মহাষষ্ঠী', saptami: 'মহাসপ্তমী', ashtami: 'মহাষ্টমী', navami: 'মহানবমী', dashami: 'বিজয়া দশমী' };
const CRUMBS = [['Home', '/'], ['Puja schedule 2026', '/puja-schedule']];
const day = (type) => eventsData.find((e) => e.event_type === type);
const label = (type) => formatDate(day(type).date, { weekday: 'long' });

const FAQS = [
  {
    q: 'What are the Durga Puja 2026 dates in Siliguri?',
    a: `Maha Shashti is on ${label('shashti')}, Maha Saptami on ${label('saptami')}, Maha Ashtami on ${label('ashtami')}, Maha Navami on ${label('navami')} and Bijoya Dashami on ${label('dashami')}.`,
  },
  {
    q: 'When is Mahalaya 2026?',
    a: `Mahalaya is on ${label('mahalaya')}. The Mahishasuramardini broadcast starts at 4 AM, and tarpan is offered at the Mahananda ghats at dawn. See the [Mahalaya 2026 guide](/mahalaya).`,
  },
  {
    q: 'Which is the busiest night of Durga Puja in Siliguri?',
    a: 'Ashtami and Navami evenings draw the biggest crowds, especially around Hill Cart Road, Sevoke Road and Venus More from 7 PM to midnight. Shashti evening and weekday afternoons are the calmest times to see the big pandals.',
  },
  {
    q: 'When is Sindoor Khela and immersion in Siliguri in 2026?',
    a: `Sindoor Khela and Devi Boron take place on Bijoya Dashami, ${label('dashami')}, followed by immersion processions to the Mahananda river ghats. Exact times vary by committee.`,
  },
  {
    q: 'Are the ritual timings final?',
    a: 'The dates follow the Bishuddho Siddhanto panjika for 1433 Bangabda. Exact muhurtas for Sandhi Puja, pushpanjali and immersion are announced locally and can differ slightly between pujas — check with the committee on the day.',
  },
];

export default function SchedulePage() {
  useSeo({
    title: 'Durga Puja 2026 Dates in Siliguri – Schedule & Calendar',
    description: 'Durga Puja 2026 dates in Siliguri: Mahalaya 10 Oct, Shashti 17, Saptami 18, Ashtami 19, Navami 20 and Bijoya Dashami 21 October — with each day’s rituals.',
    path: '/puja-schedule',
    image: '/images/photos/dhak-drummers.webp',
    imageAlt: 'Dhakis playing the dhak during Durga Puja',
    jsonLd: [breadcrumbs(CRUMBS), festival2026(eventsData), faqPage(FAQS)],
  });

  return (
    <div className="space-y-section">
      <div className="space-y-4">
        <Breadcrumbs items={[['Home', '/'], ['Puja schedule 2026']]} />
        <PageHeader
          bn="পুজোর নির্ঘণ্ট"
          kicker="Bengali almanac 1433"
          title="Durga Puja 2026 Schedule for Siliguri"
          description="Every date from Mahalaya to Bijoya Dashami, with the rituals of each day — from the Bishuddho Siddhanto panjika."
          photo="dhak-drummers"
          photoAlt="Dhakis playing the dhak during Durga Puja"
        />
      </div>

      {/* At a glance */}
      <section aria-labelledby="glance" className="space-y-5">
        <h2 id="glance" className="text-h2 font-bold text-brand-ink">Durga Puja 2026 dates at a glance</h2>
        <div className="overflow-x-auto rounded-2xl border border-brand-border bg-brand-card">
          <table className="w-full text-sm sm:text-base">
            <thead className="bg-brand-paper text-left">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Day</th>
                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                <th scope="col" className="px-4 py-3 font-semibold hidden sm:table-cell">Weekday</th>
                <th scope="col" className="px-4 py-3 font-semibold hidden md:table-cell">Key rituals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {eventsData.map((ev) => (
                <tr key={ev.id}>
                  <th scope="row" className="px-4 py-3 text-left font-semibold text-brand-ink">
                    {ev.event_name}
                    <span className="block font-bengali-serif font-normal text-brand-crimson text-sm">{EVENT_BN[ev.event_type]}</span>
                  </th>
                  <td className="px-4 py-3 whitespace-nowrap"><time dateTime={ev.date}>{formatDate(ev.date, { month: 'short' })}</time></td>
                  <td className="px-4 py-3 hidden sm:table-cell">{weekdayOf(ev.date)}</td>
                  <td className="px-4 py-3 text-brand-muted hidden md:table-cell">{ev.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Day by day */}
      <section aria-labelledby="day-by-day" className="space-y-6">
        <h2 id="day-by-day" className="text-h2 font-bold text-brand-ink">Day by day in Siliguri</h2>
        {eventsData.map((ev, idx) => (
          <article
            key={ev.id}
            id={ev.event_type}
            className="scroll-mt-28 bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi space-y-4 hover:border-brand-vermilion/50 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-maroon text-[#FFFBF5] font-bold text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl leading-tight font-bold text-brand-ink font-display">
                    {ev.event_name} 2026 <span className="font-bengali-serif font-normal text-brand-crimson text-lg">{EVENT_BN[ev.event_type]}</span>
                  </h3>
                  <time dateTime={ev.date} className="text-sm font-semibold text-brand-vermilion">
                    {formatDate(ev.date, { weekday: 'long' })}
                  </time>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-brand-muted self-start sm:self-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Date checked with panjika</span>
              </div>
            </div>

            <p className="text-base text-brand-primary/90 leading-relaxed">
              {ev.description}
            </p>

            {ev.notes && (
              <div className="p-3.5 rounded-xl bg-brand-ivory border border-brand-border/60 text-sm text-brand-muted flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-vermilion shrink-0" />
                <span>{ev.notes}</span>
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="rounded-2xl bg-brand-crimson text-white p-6 sm:p-8 space-y-3">
        <h2 className="font-display text-h3 font-semibold">Plan the five days</h2>
        <p className="text-white/85 max-w-2xl">
          Use Shashti and weekday afternoons for the big theme pandals, save Ashtami morning for pushpanjali at your para, and walk the central clusters on Navami night.
          The <Link to="/blog/durga-puja-2026-dates-pandal-map-day-wise-plan" className="underline underline-offset-2 text-brand-gold-light">day-wise pandal plan</Link> suggests which pandals to see each day.
        </p>
      </section>

      <Faq faqs={FAQS} title="Durga Puja 2026 dates: FAQs" />

      {/* Source Citation */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border text-sm text-brand-muted space-y-2">
        <h2 className="font-semibold text-sm text-brand-ink">Source</h2>
        <p className="leading-relaxed">
          Dates follow the Bishuddho Siddhanto Panjika for 1433 Bangabda (2026) as used in West Bengal. Exact muhurtas for local ceremonies at the Mahananda ghats are announced by puja committees and may vary slightly.
        </p>
      </div>
    </div>
  );
}
