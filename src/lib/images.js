// Central place for every image path on the site.
// Each .jpg has light WebP copies next to it (name.webp and name-sm.webp) that <SmartImage> serves;
// the .jpg itself is the fallback and the Open Graph share image.

// Pandal cover: its own photo if set, otherwise one named after the pandal
export const pandalImage = (pandal) =>
  pandal?.image_url || (pandal?.slug ? `/images/pandals/${pandal.slug}.jpg` : '/images/photos/siliguri-pandal-red.webp');

export const routeImage = (slug) => `/images/routes/${slug}.jpg`;
