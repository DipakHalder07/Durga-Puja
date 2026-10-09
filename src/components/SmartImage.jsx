import React, { useState, useEffect } from 'react';

// Lazy-loaded <img> that removes itself if the file is missing,
// so the gradient design underneath shows instead of a broken image.
// Pass wrapperClassName + children to add overlays that disappear together with the image.
export default function SmartImage({ src, alt = '', className = '', wrapperClassName, children, ...rest }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) return null;

  const img = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
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
