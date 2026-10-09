import React from 'react';
import { ExternalLink } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Photo from '../components/Photo';
import photos from '../data/photos.json';

const LICENSE_URL = {
  'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/',
  'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/',
  'CC BY 3.0': 'https://creativecommons.org/licenses/by/3.0/',
};

export default function PhotoCreditsPage() {
  return (
    <div className="space-y-8 sm:space-y-10">
      <PageHeader
        bn="ছবির ঋণ"
        kicker="Photo credits"
        title="With thanks to the photographers"
        description="The real photographs on this site come from Wikimedia Commons under Creative Commons licences. They have been resized for the web; the originals and licence terms are linked below. Pandal artwork marked “Illustrative image” is digital illustration, not a photo of that pandal."
      />

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
    </div>
  );
}
