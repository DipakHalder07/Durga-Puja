import React, { useState, useEffect } from 'react';

// Local images have WebP copies next to them (name.webp and name-sm.webp at 800px)
const OPTIMISED = /^\/images\/.+\.(jpe?g|png|webp)$/i;
const webpOf = (src) => {
  const base = src.replace(/(-sm)?\.(jpe?g|png|webp)$/i, '');
  return { src: `${base}.webp`, srcSet: `${base}-sm.webp 800w, ${base}.webp 1600w` };
};

// Lazy-loaded <img> that serves the light WebP copy when there is one, falls back to the
// original file if not, and removes itself if that is missing too, so the gradient design
// underneath shows instead of a broken image.
// Pass wrapperClassName + children to add overlays that disappear together with the image.
export default function SmartImage({
  src,
  alt = '',
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  wrapperClassName,
  children,
  ...rest
}) {
  const [stage, setStage] = useState(0); // 0 WebP copy · 1 original file · 2 hidden

  useEffect(() => {
    setStage(0);
  }, [src]);

  if (!src || stage === 2) return null;

  const optimised = OPTIMISED.test(src);
  const webp = optimised && stage === 0 ? webpOf(src) : null;

  const img = (
    <img
      key={webp ? 'webp' : 'original'}
      src={webp ? webp.src : src}
      srcSet={webp?.srcSet}
      sizes={webp ? sizes : undefined}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setStage((s) => (optimised && s === 0 ? 1 : 2))}
      className={className}
      {...rest}
    />
  );

  if (!wrapperClassName && !children) return img;

  return (
    <div className={wrapperClassName}>
      {img}
      {children}
    </div>
  );
}
