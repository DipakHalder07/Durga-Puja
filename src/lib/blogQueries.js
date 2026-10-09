// Pure helpers shared by the blog pages (browser) and scripts/prerender.mjs (Node).
// No imports, so both environments can use them.

export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Select pandals for a blog list. Query keys (all optional):
// zones, categories, areas, parking (bool), minScore, maxVisit, near {lat,lng,km}, sort ('score'|'distance'), limit
export function queryPandals(pandals, q = {}) {
  let list = pandals.filter(
    (p) =>
      (!q.zones || q.zones.includes(p.zone)) &&
      (!q.categories || q.categories.includes(p.category)) &&
      (!q.areas || q.areas.includes(p.area_slug)) &&
      (q.parking === undefined || Boolean(p.parking_available) === q.parking) &&
      (!q.minScore || Number(p.pujo_songi_score) >= q.minScore) &&
      (!q.maxVisit || Number(p.estimated_visit_minutes) <= q.maxVisit)
  );
  if (q.near) {
    list = list
      .map((p) => ({ ...p, distanceKm: distanceKm(q.near, { lat: p.latitude, lng: p.longitude }) }))
      .filter((p) => p.distanceKm <= q.near.km);
  }
  list.sort((a, b) =>
    q.sort === 'distance'
      ? a.distanceKm - b.distanceKm
      : Number(b.pujo_songi_score) - Number(a.pujo_songi_score) || a.name.localeCompare(b.name)
  );
  return list.slice(0, q.limit || 10);
}

export function blogStats(pandals) {
  const count = (fn) => pandals.filter(fn).length;
  return {
    total: pandals.length,
    areas: new Set(pandals.map((p) => p.area_slug)).size,
    parking: count((p) => p.parking_available),
    walkin: count((p) => !p.parking_available),
    theme: count((p) => p.category === 'Theme'),
    heritage: count((p) => p.category === 'Heritage'),
    traditional: count((p) => p.category === 'Traditional'),
    community: count((p) => p.category === 'Community'),
    eco: count((p) => p.category === 'Eco-Friendly'),
    verified: count((p) => p.verified),
  };
}

// Replace {{token}} placeholders with live numbers from the data
export const fillTokens = (text, stats) =>
  String(text).replace(/\{\{(\w+)\}\}/g, (m, k) => (k in stats ? String(stats[k]) : m));

// Zone groups used by the zone tables
export const ZONE_GROUPS = [
  { name: 'Central Siliguri', zones: ['Central Siliguri'] },
  { name: 'South & South-Central', zones: ['South Siliguri', 'South-Central Siliguri'] },
  { name: 'East & Sevoke Road corridor', zones: ['East Siliguri', 'East Corridor', 'Central-East Siliguri', 'North-East Siliguri'] },
  { name: 'North Siliguri', zones: ['North Siliguri'] },
  { name: 'West, Junction & Rajganj', zones: ['West Siliguri', 'West Siliguri / Junction', 'Suburban / Rajganj'] },
];

export function zoneTable(pandals) {
  return ZONE_GROUPS.map((g) => {
    const list = pandals.filter((p) => g.zones.includes(p.zone));
    const areas = [...new Set(list.map((p) => p.area_name))];
    return { ...g, count: list.length, areas, parking: list.filter((p) => p.parking_available).length };
  });
}

// Words → minutes, counting prose and FAQ answers
export function readingMinutes(post) {
  const text = [
    ...post.body.flatMap((b) => [b.text, b.title, ...(b.items || []), ...(b.rows || []).flat()]),
    ...(post.faqs || []).flatMap((f) => [f.q, f.a]),
  ]
    .filter(Boolean)
    .join(' ');
  const words = text.split(/\s+/).length;
  return Math.max(3, Math.round(words / 200) + 2); // +2 for the pandal lists and maps
}

// Strip the tiny inline markup used in blog text: **bold** and [label](/link)
export const plainText = (s) => String(s).replace(/\*\*(.+?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
