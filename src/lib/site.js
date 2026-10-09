// Site-wide constants shared by the app, the server renderer and scripts/prerender.mjs.
// The domain lives in site.config.json.
import config from '../../site.config.json' with { type: 'json' };

export const SITE_URL = String(config.siteUrl || 'https://durgapujapandal.site').replace(/\/$/, '');

export const SITE_NAME = 'Pujo Pandal';
export const SITE_NAME_BN = 'পুজো প্যান্ডেল';
export const SITE_TAGLINE = 'Siliguri Durga Puja 2026 guide';
export const CONTACT_EMAIL = 'pujopandal@gmail.com';
export const DEFAULT_OG_IMAGE = '/images/og/og-image.jpg';
export const LOGO = '/icon-512.png';

// Bump when pandal / area / route data changes — used as <lastmod> in the sitemap
export const DATA_UPDATED = '2026-10-09';

// Siliguri city centre (Hill Cart Road / Venus More) for maps and structured data
export const SILIGURI = { name: 'Siliguri', lat: 26.7271, lng: 88.4289, region: 'West Bengal', regionCode: 'IN-WB', country: 'IN' };

// Durga Puja 2026 in West Bengal (Bishuddho Siddhanto panjika; matches events.json)
export const PUJA_2026 = { mahalaya: '2026-10-10', start: '2026-10-17', end: '2026-10-21' };

export const absUrl = (path = '/') => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`);
