import React from 'react';
import { Calendar, Clock, BookOpen, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import eventsData from '../data/events.json';
import PageHeader from '../components/PageHeader';
import { useSeo } from '../lib/seo';

export default function SchedulePage() {
  useSeo({
    title: 'Durga Puja 2026 Schedule – Siliguri Dates & Timings',
    description: 'Durga Puja 2026 dates and ritual timings for Siliguri: Mahalaya 10 Oct, Shashti 17 Oct to Vijaya Dashami 21 Oct, pushpanjali, Sandhi Puja and visarjan.',
    path: '/puja-schedule',
  });
  return (
    <div className="space-y-section">
      <PageHeader
        bn="পুজোর নির্ঘণ্ট"
        kicker="Bengali almanac 1433"
        title="Puja Schedule 2026"
        description="Tithi, ritual hours, pushpanjali and visarjan timings for Siliguri, from the Bishuddho Siddhanto Panjika."
        photo="dhak-drummers"
      />

      {/* Events List */}
      <div className="space-y-6">
        {eventsData.map((ev, idx) => {
          const dateObj = new Date(ev.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

          return (
            <div
              key={ev.id}
              className="bg-brand-card rounded-2xl border border-brand-border p-5 sm:p-6 shadow-songi space-y-4 hover:border-brand-vermilion/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-maroon text-[#FFFBF5] font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl leading-tight font-bold text-brand-ink">
                      {ev.event_name}
                    </h2>
                    <span className="text-sm font-semibold text-brand-vermilion">
                      {dayName}, {dateFormatted}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-brand-muted self-start sm:self-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Panjika Verified</span>
                </div>
              </div>

              <p className="text-sm text-brand-primary/90 leading-relaxed">
                {ev.description}
              </p>

              {ev.notes && (
                <div className="p-3.5 rounded-xl bg-brand-ivory border border-brand-border/60 text-sm text-brand-muted flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-vermilion shrink-0" />
                  <span>{ev.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Source Citation */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border text-sm text-brand-muted space-y-2">
        <h3 className="font-semibold text-sm text-brand-ink">
          Almanac &amp; Theological Source Citation
        </h3>
        <p className="leading-relaxed">
          Dates and ritual timings are coordinated with the Bishuddho Siddhanto Panjika (Bengal Almanac 2026 / 1433 Bangabda). Muhurta details are reconciled with the Siliguri Purohit Sabha guidelines for local ghat ceremonies along the Mahananda River.
        </p>
      </div>
    </div>
  );
}
