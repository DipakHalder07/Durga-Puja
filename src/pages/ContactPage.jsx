import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import { useSeo } from '../lib/seo';
import { breadcrumbs } from '../lib/schema';
import { CONTACT_EMAIL, SITE_URL } from '../lib/site';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Committee Registration',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useSeo({
    title: 'Contact Pujo Pandal – Siliguri Puja Desk',
    description: 'Contact Pujo Pandal with Siliguri Durga Puja 2026 pandal updates, committee registrations, corrections, traffic diversions or feedback. Email pujopandal@gmail.com.',
    path: '/contact',
    image: '/images/photos/dhaki.webp',
    imageAlt: 'A dhaki playing the dhak',
    jsonLd: [
      breadcrumbs([['Home', '/'], ['Contact', '/contact']]),
      { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact Pujo Pandal', url: `${SITE_URL}/contact`, about: { '@id': `${SITE_URL}/#organization` } },
    ],
  });

  // No server: the message opens in the visitor's email app, addressed to the team
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = `[Pujo Pandal] ${formData.category}`;
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-section">
      <Breadcrumbs items={[['Home', '/'], ['Contact']]} />
      <PageHeader
        bn="যোগাযোগ"
        kicker="Siliguri desk"
        title="Get in touch"
        description="Puja committee updates, traffic diversions or visitor feedback — we read every message."
        photo="dhaki"
        photoAlt="A dhaki playing the dhak"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Info Card */}
        <div className="bg-brand-card rounded-3xl border border-brand-border p-6 sm:p-8 shadow-songi space-y-6">
          <h2 className="font-display text-h3 font-semibold text-brand-ink">
            Official Desk
          </h2>

          <div className="space-y-4 text-sm text-brand-muted">
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
                <span>We check new committee submissions and corrections as quickly as we can during the Puja season.</span>
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
              <h3 className="font-display text-h3 font-semibold text-brand-ink">Your email app should now be open</h3>
              <p className="text-sm text-brand-muted max-w-sm mx-auto">
                Press send there to reach us. If nothing opened, write to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-vermilion font-medium hover:underline">{CONTACT_EMAIL}</a> directly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="min-h-11 text-sm font-semibold text-brand-vermilion hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-sm font-semibold text-brand-ink">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    autoComplete="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl bg-brand-ivory border border-brand-border text-base text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-sm font-semibold text-brand-ink">
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    autoComplete="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 rounded-xl bg-brand-ivory border border-brand-border text-base text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-category" className="text-sm font-semibold text-brand-ink">
                  Subject / Category
                </label>
                <select
                  id="contact-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-ivory border border-brand-border text-base text-brand-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                >
                  <option value="Committee Registration">Puja Committee Registration</option>
                  <option value="Theme / Details Update">Theme or Detail Correction</option>
                  <option value="Traffic Diversion Note">Traffic or Route Diversion Report</option>
                  <option value="General Feedback">Visitor Feedback / Suggestion</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-sm font-semibold text-brand-ink">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Provide pandal details, address, theme description, or your message..."
                  className="w-full px-4 py-3 rounded-xl bg-brand-ivory border border-brand-border text-base text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 px-6 rounded-full bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-base font-semibold flex items-center justify-center gap-2 shadow-songi transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send via email</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
