import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Radio, Waves, Palette, Calendar, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import SmartImage from '../components/SmartImage';
import { MAHALAYA_IMAGE } from '../lib/images';

export default function MahalayaPage() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-10-10T04:00:00+05:30').getTime();
    const update = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-2 border-b border-brand-border/70 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-vermilion">
          <Clock className="w-3.5 h-3.5" />
          <span>Sacred Festival Dawn</span>
          <span>•</span>
          <span className="font-bengali">মহালয়া ১৪৩৩</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-brand-primary">
          Mahalaya 2026 in Siliguri
        </h1>
        <p className="text-sm sm:text-base text-brand-muted max-w-2xl leading-relaxed">
          The sacred dawn of Bengal's grandest festival. From the nostalgic 4:00 AM radio resonance of Birendra Krishna Bhadra to ancestral Tarpan rituals on the Mahananda Ghats.
        </p>
      </div>

      {/* Countdown Card */}
      <div className="relative isolate overflow-hidden w-full bg-gradient-to-tr from-brand-maroon via-brand-maroon-dark to-brand-primary text-white rounded-3xl p-8 shadow-songi text-center space-y-6">
        <SmartImage
          src={MAHALAYA_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 w-full h-full object-cover opacity-35"
        />
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold text-brand-gold tracking-widest">
            Saturday, October 10, 2026 • 04:00 AM IST
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Countdown to the Sacred Dawn
          </h2>
          <p className="text-sm text-white/80 font-bengali">
            বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ ও বোধন সঙ্গীত
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
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
              <span className="text-3xl font-black text-brand-gold font-mono">
                {String(unit.val).padStart(2, '0')}
              </span>
              <span className="text-[11px] uppercase font-bold text-white/70">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Three Core Traditions of Siliguri */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-brand-primary">
            Mahalaya Traditions in Siliguri
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            How Siliguri welcomes the homecoming of Uma on the banks of North Bengal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-brand-primary">
              4:00 AM Akashvani Broadcast
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Every Bengali household tunes in at dawn to All India Radio for Birendra Krishna Bhadra's immortal rendition of Mahisasuramardini, filling every neighborhood with conch shells and incense.
            </p>
          </div>

          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Waves className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-brand-primary">
              Mahananda River Tarpan
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Thousands congregate at Mahananda Ghat (Lalmohan Ghat &amp; Gurung Basti) at sunrise to offer sesame seeds and water (Tarpan) in remembrance of their departed ancestors.
            </p>
          </div>

          <div className="bg-brand-card rounded-2xl border border-brand-border p-6 shadow-songi space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-brand-primary">
              Chokkhudaan in Kumartoli
            </h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              At the artisan workshops along Kumartoli and Siliguri artists' colonies, master sculptors ritually draw the sacred eyes of the Goddess, giving life to clay idols.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation CTA */}
      <div className="p-8 rounded-3xl bg-brand-card border border-brand-border shadow-songi flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-brand-primary">
            Explore the Full Festival Calendar
          </h3>
          <p className="text-xs text-brand-muted">
            See the exact dates and auspicious hours for Shashti, Saptami, Ashtami, and Dashami.
          </p>
        </div>

        <Link
          to="/puja-schedule"
          className="px-6 py-3 rounded-2xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
        >
          <span>View 2026 Schedule</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
