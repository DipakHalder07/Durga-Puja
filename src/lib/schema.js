// schema.org JSON-LD builders. Every URL is absolute so the markup is valid wherever it is read.
import { SITE_URL, SITE_NAME, SITE_NAME_BN, CONTACT_EMAIL, LOGO, DEFAULT_OG_IMAGE, SILIGURI, PUJA_2026, absUrl } from './site.js';
import { plainText } from './blogQueries.js';

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Siliguri',
  addressRegion: SILIGURI.region,
  addressCountry: SILIGURI.country,
};

const SILIGURI_PLACE = {
  '@type': 'City',
  name: 'Siliguri',
  address: ADDRESS,
  geo: { '@type': 'GeoCoordinates', latitude: SILIGURI.lat, longitude: SILIGURI.lng },
};

export const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  alternateName: [SITE_NAME_BN, 'Durga Puja Pandal Siliguri'],
  url: `${SITE_URL}/`,
  logo: { '@type': 'ImageObject', url: absUrl(LOGO), width: 512, height: 512 },
  email: CONTACT_EMAIL,
  address: { ...ADDRESS, streetAddress: 'Collegepara', postalCode: '734005' },
  areaServed: SILIGURI_PLACE,
  knowsAbout: ['Durga Puja', 'Siliguri Durga Puja pandals', 'Pandal hopping', 'Mahalaya', 'North Bengal festivals'],
});

export const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_ID,
  name: SITE_NAME,
  alternateName: 'Siliguri Durga Puja 2026 guide',
  url: `${SITE_URL}/`,
  inLanguage: 'en-IN',
  publisher: { '@id': ORG_ID },
});

// items: [['Home', '/'], ['Pandals', '/siliguri-puja-pandals'], ['Name', '/pandals/x']]
export const breadcrumbs = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absUrl(path) })),
});

// faqs: [{ q, a }] — a may contain **bold** / [link](/x) markup
export const faqPage = (faqs) =>
  faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plainText(f.a) } })),
      }
    : null;

// items: [{ name, path }]
export const itemList = (name, items) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  numberOfItems: items.length,
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: absUrl(it.path) })),
});

const FREE_ENTRY = (path) => ({
  '@type': 'Offer',
  price: 0,
  priceCurrency: 'INR',
  availability: 'https://schema.org/InStock',
  url: absUrl(path),
  validFrom: '2026-09-01',
});

// The festival itself: Shashti to Bijoya Dashami across the city
export const festival2026 = (events = []) => ({
  '@context': 'https://schema.org',
  '@type': 'Festival',
  '@id': `${SITE_URL}/puja-schedule#durga-puja-2026`,
  name: 'Durga Puja 2026 in Siliguri',
  alternateName: 'শারদীয়া দুর্গাপূজা ১৪৩৩ — শিলিগুড়ি',
  description:
    'Siliguri’s Durga Puja 2026 runs from Maha Shashti on 17 October to Bijoya Dashami on 21 October, with community pandals open across the city’s neighbourhoods. Mahalaya falls on 10 October.',
  startDate: PUJA_2026.start,
  endDate: PUJA_2026.end,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  isAccessibleForFree: true,
  inLanguage: ['bn', 'en'],
  location: SILIGURI_PLACE,
  image: [absUrl(DEFAULT_OG_IMAGE)],
  url: absUrl('/puja-schedule'),
  offers: FREE_ENTRY('/puja-schedule'),
  organizer: { '@type': 'Organization', name: 'Siliguri Durga Puja committees', url: `${SITE_URL}/siliguri-puja-pandals` },
  subEvent: events
    .filter((e) => e.event_type !== 'mahalaya')
    .map((e) => ({
      '@type': 'Event',
      name: `${e.event_name} 2026 – Siliguri`,
      startDate: e.date,
      endDate: e.date,
      description: e.description,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: SILIGURI_PLACE,
    })),
});

export const mahalaya2026 = () => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: 'Mahalaya 2026 in Siliguri',
  description: 'Mahalaya marks the start of Devi Paksha: the 4 AM Mahishasuramardini broadcast, Chandi Path and tarpan on the Mahananda ghats in Siliguri.',
  startDate: `${PUJA_2026.mahalaya}T04:00:00+05:30`,
  endDate: `${PUJA_2026.mahalaya}T10:00:00+05:30`,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  isAccessibleForFree: true,
  location: SILIGURI_PLACE,
  image: [absUrl('/images/photos/kash-sunset.webp')],
  url: absUrl('/mahalaya'),
  offers: FREE_ENTRY('/mahalaya'),
  organizer: { '@id': ORG_ID },
});

// A pandal: the place (with GPS pin) plus its Durga Puja 2026 as an event held there
export function pandalJsonLd(p, image) {
  const path = `/pandals/${p.slug}`;
  const placeId = `${absUrl(path)}#place`;
  const address = { ...ADDRESS, streetAddress: p.venue_name_2026 || p.address_2026 || p.area_name };
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'TouristAttraction',
      '@id': placeId,
      name: /durga ?puja|durgotsab|durga utsav|puja committee/i.test(p.name) ? p.name : `${p.name} Durga Puja`,
      description: p.description,
      url: absUrl(path),
      image: image ? [absUrl(image)] : undefined,
      address,
      geo: { '@type': 'GeoCoordinates', latitude: p.latitude, longitude: p.longitude },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`,
      isAccessibleForFree: true,
      publicAccess: true,
      touristType: ['Pandal hoppers', 'Families', 'Pilgrims'],
      containedInPlace: SILIGURI_PLACE,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `${p.name} Durga Puja 2026`,
      description: `${p.category} Durga Puja in ${p.area_name}, Siliguri.${p.theme ? ` Theme: ${p.theme}.` : ''}`,
      startDate: PUJA_2026.start,
      endDate: PUJA_2026.end,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      isAccessibleForFree: true,
      location: { '@type': 'Place', '@id': placeId, name: p.venue_name_2026 || p.name, address, geo: { '@type': 'GeoCoordinates', latitude: p.latitude, longitude: p.longitude } },
      image: image ? [absUrl(image)] : [absUrl(DEFAULT_OG_IMAGE)],
      url: absUrl(path),
      offers: FREE_ENTRY(path),
      organizer: { '@type': 'Organization', name: p.committee_name || p.name },
      superEvent: { '@id': `${SITE_URL}/puja-schedule#durga-puja-2026` },
    },
  ];
}

// A curated pandal circuit
export const touristTrip = (route, stops, image) => ({
  '@context': 'https://schema.org',
  '@type': 'TouristTrip',
  name: route.title,
  description: route.description,
  url: absUrl(`/routes/${route.slug}`),
  image: image ? absUrl(image) : undefined,
  touristType: route.travel_mode,
  provider: { '@id': ORG_ID },
  itinerary: {
    '@type': 'ItemList',
    numberOfItems: stops.length,
    itemListElement: stops.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'TouristAttraction',
        name: `${p.name} Durga Puja`,
        url: absUrl(`/pandals/${p.slug}`),
        geo: { '@type': 'GeoCoordinates', latitude: p.latitude, longitude: p.longitude },
      },
    })),
  },
});

export const webPage = ({ name, path, description, type = 'WebPage' }) => ({
  '@context': 'https://schema.org',
  '@type': type,
  name,
  url: absUrl(path),
  description,
  inLanguage: 'en-IN',
  isPartOf: { '@id': SITE_ID },
  spatialCoverage: SILIGURI_PLACE,
});
