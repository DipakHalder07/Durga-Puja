import React from 'react';
import { ExternalLink, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import photos from '../data/photos.json';
import pandalPhotos from '../data/pandalPhotos.json';
import Breadcrumbs from '../components/Breadcrumbs';
import { useSeo } from '../lib/seo';
import { breadcrumbs } from '../lib/schema';

const LICENSE_URL = {
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
};

export default function PhotoCreditsPage() {
  useSeo({
    title: 'Photo Credits – Pujo Pandal',
    description: 'Credits and Creative Commons licences for the Durga Puja photographs used on Pujo Pandal, the Siliguri Durga Puja 2026 guide.',
    path: '/photo-credits',
    jsonLd: breadcrumbs([['Home', '/'], ['Photo credits', '/photo-credits']]),
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      <Breadcrumbs items={[['Home', '/'], ['Photo credits']]} />
      <PageHeader
        bn="ছবির ঋণ"
        kicker="Photo credits"
        title="With thanks to the photographers"
        description="The photographs on this site come from Wikimedia Commons under Creative Commons licences, resized for fast loading. Photographers and licences are credited below. Pandal listing photos are representative Durga Puja images and may show pujas elsewhere in West Bengal rather than that specific pandal."
      />

      {/* Pandal Listing Photos Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-brand-vermilion" />
          <h2 className="text-xl font-bold text-brand-ink">Pandal listing photos ({pandalPhotos.length})</h2>
        </div>
        <p className="text-sm text-brand-muted">
          Representative festival photos shown on each pandal listing, with the original photo title, photographer and licence.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pandalPhotos.map((p) => (
            <li key={p.pandal_slug} className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden flex flex-col">
              <div className="relative h-40 bg-brand-ivory overflow-hidden">
                <img
                  src={`/images/pandals/${p.pandal_slug}.webp`}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-sm space-y-1 flex-1 flex flex-col justify-between">
                <div>
                  <Link to={`/pandals/${p.pandal_slug}`} className="font-semibold text-brand-ink hover:text-brand-crimson transition-colors leading-snug line-clamp-1">
                    {p.pandal_name}
                  </Link>
                  <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">{p.title}</p>
                  <p className="text-xs text-brand-muted mt-1">Photo by <span className="font-medium text-brand-primary">{p.artist || 'Photographer'}</span></p>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 pt-2 text-xs border-t border-brand-border/60">
                  <span className="font-semibold text-brand-crimson">
                    {p.license}
                  </span>
                  {p.source && p.source.startsWith('http') && (
                    <a href={p.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-muted hover:text-brand-crimson">
                      Commons Source <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Feature & Editorial Photos */}
      <section className="space-y-4 pt-4 border-t border-brand-border">
        <h2 className="text-xl font-bold text-brand-ink">Festival & Editorial Collection</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((p) => (
            <li key={p.slug} className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden flex flex-col">
              <Photo slug={p.slug} credit="none" sizes="(max-width: 640px) 100vw, 33vw" className="h-40" />
              <div className="p-4 text-sm space-y-1">
                <p className="font-semibold text-brand-ink leading-snug">{p.title}</p>
                <p className="text-brand-muted">By {p.author || 'Unknown'}</p>
                <p className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs">
                  <a
                    href={LICENSE_URL[p.license] || p.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-crimson hover:underline"
                  >
                    {p.license}
                  </a>
                  <a href={p.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-muted hover:text-brand-crimson">
                    Original on Wikimedia Commons <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
