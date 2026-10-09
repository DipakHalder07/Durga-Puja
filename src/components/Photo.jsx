import React from 'react';
import photos from '../data/photos.json';

export const PHOTOS = Object.fromEntries(photos.map((p) => [p.slug, p]));

// Real, openly-licensed photo with responsive sizes and an attribution line.
// credit: 'corner' (small overlay link), 'none' (credited on the Photo Credits page only)
export default function Photo({
  slug,
  alt,
  className = '',
  imgClassName = 'w-full h-full object-cover',
  sizes = '(max-width: 640px) 100vw, 50vw',
  eager = false,
  credit = 'corner',
  style,
}) {
  const p = PHOTOS[slug];
  if (!p) return null;
  // Keep the caller's absolute/fixed positioning; otherwise act as a positioned box for the credit
  const position = /(^|\s)(absolute|fixed)(\s|$)/.test(className) ? '' : 'relative';
  return (
    <div className={`${position} overflow-hidden bg-brand-maroon ${className}`} style={style}>
      <img
        src={p.src}
        srcSet={`${p.srcSmall} 800w, ${p.src} ${p.width}w`}
        sizes={sizes}
        width={p.width}
        height={p.height}
        alt={alt ?? p.title}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : undefined}
        decoding="async"
        className={imgClassName}
      />
      {credit === 'corner' && (
        <a
          href={p.source}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-1.5 right-1.5 max-w-[85%] truncate px-1.5 py-0.5 rounded bg-black/45 text-2xs text-white/85 hover:text-white backdrop-blur-sm"
          title={`${p.title} — ${p.author}, ${p.license}`}
        >
          © {p.author} · {p.license}
        </a>
      )}
    </div>
  );
}
