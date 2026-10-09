// Distances between pandals, neighbourhoods and Siliguri's travel hubs.
// All figures are straight-line ("as the crow flies"); roads add roughly 25–40 %.
import pandalsData from '../data/pandals.json';
import { distanceKm } from './blogQueries.js';

export { distanceKm };

// Coordinates from OpenStreetMap
export const LANDMARKS = [
  { key: 'njp', name: 'New Jalpaiguri (NJP) railway station', short: 'NJP station', lat: 26.68286, lng: 88.44248 },
  { key: 'junction', name: 'Siliguri Junction railway station', short: 'Siliguri Junction', lat: 26.72378, lng: 88.41371 },
  { key: 'airport', name: 'Bagdogra Airport (IXB)', short: 'Bagdogra Airport', lat: 26.6811, lng: 88.3286 },
  { key: 'venus', name: 'Venus More', short: 'Venus More', lat: 26.71117, lng: 88.42605 },
  { key: 'sevoke', name: 'Sevoke More', short: 'Sevoke More', lat: 26.71562, lng: 88.42276 },
];

const pt = (p) => ({ lat: Number(p.latitude ?? p.lat), lng: Number(p.longitude ?? p.lng) });

export const kmLabel = (km) => (km < 1 ? `${Math.round(km * 1000 / 50) * 50} m` : `${km.toFixed(1)} km`);

// Walking time with a 25 % road factor at 4.2 km/h
export const walkMinutes = (km) => Math.max(1, Math.round(((km * 1.25) / 4.2) * 60));

export const landmarkDistances = (place) =>
  LANDMARKS.map((l) => ({ ...l, km: distanceKm(pt(place), l) }));

export function nearestPandals(pandal, { limit = 4, maxKm = 3 } = {}) {
  return pandalsData
    .filter((p) => p.id !== pandal.id)
    .map((p) => ({ ...p, km: distanceKm(pt(pandal), pt(p)) }))
    .filter((p) => p.km <= maxKm)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

// Centre point, pandal list and summary numbers for every neighbourhood
export const AREA_STATS = Object.values(
  pandalsData.reduce((acc, p) => {
    const a = (acc[p.area_slug] ||= { slug: p.area_slug, name: p.area_name, zone: p.zone, pandals: [] });
    a.pandals.push(p);
    return acc;
  }, {})
).map((a) => {
  const n = a.pandals.length;
  const sorted = [...a.pandals].sort((x, y) => Number(y.pujo_songi_score) - Number(x.pujo_songi_score) || x.name.localeCompare(y.name));
  return {
    ...a,
    pandals: sorted,
    count: n,
    lat: a.pandals.reduce((s, p) => s + p.latitude, 0) / n,
    lng: a.pandals.reduce((s, p) => s + p.longitude, 0) / n,
    parking: a.pandals.filter((p) => p.parking_available).length,
    visitMinutes: a.pandals.reduce((s, p) => s + (Number(p.estimated_visit_minutes) || 30), 0),
    categories: [...new Set(a.pandals.map((p) => p.category))],
  };
});

export const areaStats = (slug) => AREA_STATS.find((a) => a.slug === slug);

export function nearestAreas(area, limit = 4) {
  return AREA_STATS.filter((a) => a.slug !== area.slug)
    .map((a) => ({ ...a, km: distanceKm(area, a) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

// "A, B and C"
export const joinNames = (names) =>
  names.length <= 1 ? names.join('') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
