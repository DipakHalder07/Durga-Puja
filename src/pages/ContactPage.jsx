import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Committee Registration',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-card border border-brand-border text-xs font-semibold text-brand-vermilion">
          <Mail className="w-3.5 h-3.5 text-brand-vermilion" />
          <span>Siliguri Desk • Local Community Team</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-brand-primary leading-tight">
          Get in Touch with <span className="text-brand-vermilion">PUJO PANDAL</span>
        </h1>
        <p className="text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
          Whether you are a Puja committee organizer submitting pandal updates, reporting traffic diversions, or sharing visitor feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-8 shadow-songi space-y-6">
          <h2 className="text-lg font-black text-brand-primary uppercase tracking-wide">
            Official Desk
          </h2>

          <div className="space-y-4 text-xs text-brand-muted">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-vermilion shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-primary block mb-0.5">Physical Hub:</strong>
                <span>Collegepara, Siliguri, West Bengal — 734005</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-brand-vermilion shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-primary block mb-0.5">Email Support:</strong>
                <a href="mailto:pujopandal@gmail.com" className="text-brand-vermilion hover:underline font-medium">
                  pujopandal@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-primary block mb-0.5">Verification SLA:</strong>
                <span>New committee submissions reviewed within 24 hours of notification.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-8 shadow-songi">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-brand-primary">Thank you for your message!</h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Our Siliguri editorial desk has received your note and will review it promptly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold text-brand-vermilion hover:underline pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wide">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-primary uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-primary uppercase tracking-wide">
                  Subject / Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-border text-xs text-brand-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                >
                  <option value="Committee Registration">Puja Committee Registration</option>
                  <option value="Theme / Details Update">Theme or Detail Correction</option>
                  <option value="Traffic Diversion Note">Traffic or Route Diversion Report</option>
                  <option value="General Feedback">Visitor Feedback / Suggestion</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-primary uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide pandal details, address, theme description, or your message..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-ivory border border-brand-border text-xs text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-songi transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
