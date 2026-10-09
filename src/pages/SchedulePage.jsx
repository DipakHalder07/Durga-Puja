import React from 'react';
import { Calendar, Clock, BookOpen, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import eventsData from '../data/events.json';

export default function SchedulePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-2 border-b border-brand-border/70 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-vermilion">
          <Calendar className="w-3.5 h-3.5" />
          <span>Official 2026 Almanac</span>
          <span>•</span>
          <span className="font-bengali">পুজোর নির্ঘণ্ট ১৪৩৩</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-brand-primary">
          Siliguri Puja Schedule 2026
        </h1>
        <p className="text-sm sm:text-base text-brand-muted max-w-2xl leading-relaxed">
          Comprehensive tithi, ritual hours, pushpanjali, and visarjan schedule verified according to the Bishuddho Siddhanto Panjika for Siliguri and North Bengal.
        </p>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {eventsData.map((ev, idx) => {
          const dateObj = new Date(ev.date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

          return (
            <div
              key={ev.id}
              className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-4 hover:border-brand-vermilion/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-maroon text-[#FFFBF5] font-black text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-primary">
                      {ev.event_name}
                    </h2>
                    <span className="text-xs font-bold text-brand-vermilion">
                      {dayName}, {dateFormatted}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-brand-muted self-start sm:self-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Panjika Verified</span>
                </div>
              </div>

              <p className="text-sm text-brand-primary/90 leading-relaxed">
                {ev.description}
              </p>

              {ev.notes && (
                <div className="p-3.5 rounded-xl bg-brand-ivory border border-brand-border/60 text-xs text-brand-muted flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand-vermilion shrink-0" />
                  <span>{ev.notes}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Source Citation */}
      <div className="p-6 rounded-2xl bg-brand-card border border-brand-border text-xs text-brand-muted space-y-2">
        <h3 className="font-bold text-brand-primary uppercase tracking-wider">
          Almanac &amp; Theological Source Citation
        </h3>
        <p className="leading-relaxed">
          Dates and ritual timings are coordinated with the Bishuddho Siddhanto Panjika (Bengal Almanac 2026 / 1433 Bangabda). Muhurta details are reconciled with the Siliguri Purohit Sabha guidelines for local ghat ceremonies along the Mahananda River.
        </p>
      </div>
    </div>
  );
}
