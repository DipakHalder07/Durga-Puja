// Client-side Puja route engine.
// Picks pandals that suit the visitor's goal, fits them into their time budget and orders them
// so the trip doesn't zig-zag. Uses straight-line distance × a road factor per travel mode,
// plus viewing time and parking buffers. Road geometry for the map is fetched separately (OSRM).
import pandalsData from '../data/pandals.json';

// Landmark coordinates from OpenStreetMap (checked Oct 2026)
export const STARTING_POINTS = [
  { name: 'Sevoke More', lat: 26.71562, lng: 88.42276 },
  { name: 'Venus More', lat: 26.71117, lng: 88.42605 },
  { name: 'Airview More', lat: 26.71874, lng: 88.42038 },
  { name: 'Siliguri Junction', lat: 26.72378, lng: 88.41371 },
  { name: 'Hill Cart Road', lat: 26.71472, lng: 88.42339 },
  { name: 'Hakimpara', lat: 26.71216, lng: 88.43194 },
  { name: 'Bidhan Market', lat: 26.71727, lng: 88.42628 },
];

// Extra starting points: the centre of every neighbourhood's pandals
export const AREA_STARTING_POINTS = Object.values(
  pandalsData.reduce((acc, p) => {
    const a = (acc[p.area_slug] ||= { name: p.area_name, lat: 0, lng: 0, n: 0 });
    a.lat += p.latitude;
    a.lng += p.longitude;
    a.n += 1;
    return acc;
  }, {})
)
  .map(({ name, lat, lng, n }) => ({ name, lat: lat / n, lng: lng / n }))
  .filter((a) => !STARTING_POINTS.some((s) => s.name === a.name))
  .sort((a, b) => a.name.localeCompare(b.name));

export const TRAVEL_MODES = {
  'Walking': { key: 'walking', speedKmh: 4.2, roadFactor: 1.25, parkMin: 0, maxRadiusKm: 2.5, gmaps: 'walking' },
  'Bike / Scooty': { key: 'bike', speedKmh: 14, roadFactor: 1.35, parkMin: 5, maxRadiusKm: 8, gmaps: 'two-wheeler' },
  'Car / Auto': { key: 'car', speedKmh: 11, roadFactor: 1.4, parkMin: 10, maxRadiusKm: 10, gmaps: 'driving' },
};

const MAX_STOPS = 9; // Google Maps directions links handle up to 9 waypoints + destination
const TRAFFIC_BUFFER = 0.12; // festival congestion added on top of travel time

export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const pt = (p) => ({ lat: p.latitude, lng: p.longitude });
const roadKm = (a, b, mode) => distanceKm(a, b) * mode.roadFactor;
const travelMin = (km, mode) => (km / mode.speedKmh) * 60 * (1 + TRAFFIC_BUFFER);

const TRADITIONAL_CATEGORIES = ['Traditional', 'Heritage', 'Sabeki'];
const TRADITIONAL_THEME = /tradition|heritage|sabeki|rajbari|ekchala|daaker/i;

// How much a pandal is worth visiting for each goal (higher = better).
// Score is raised to the 4th power so a 9.6 pandal clearly beats an 8.8 one.
function goalValue(p, goal) {
  const score = Number(p.pujo_songi_score) || 8.5;
  const q = (score / 9) ** 4 * 100;
  switch (goal) {
    case 'Top Themes':
      return q * (p.category === 'Theme' ? 1.3 : 1) * (p.featured ? 1.2 : 1);
    case 'Traditional':
      return q * (TRADITIONAL_CATEGORIES.includes(p.category) ? 1.8 : TRADITIONAL_THEME.test(p.theme || '') ? 1.2 : 0.3);
    case 'Family Friendly':
      return q * (p.parking_available ? 1.6 : 0.6) * (p.estimated_visit_minutes <= 35 ? 1.15 : 1);
    case 'Maximum Pandals':
    default:
      return 100;
  }
}

function visitMin(p, goal) {
  const base = Number(p.estimated_visit_minutes) || 35;
  // "Maximum" visitors move quicker; "Top Themes" visitors linger at the big installations
  if (goal === 'Maximum Pandals') return Math.max(20, Math.round(base * 0.7));
  if (goal === 'Top Themes' && Number(p.pujo_songi_score) >= 9.4) return base + 5;
  return base;
}

// Total minutes for a given ordered list of stops
function evaluate(origin, stops, mode, goal, circular) {
  let prev = origin;
  let km = 0;
  let move = 0;
  let view = 0;
  for (const s of stops) {
    const d = roadKm(prev, pt(s), mode);
    km += d;
    move += travelMin(d, mode) + mode.parkMin;
    view += visitMin(s, goal);
    prev = pt(s);
  }
  if (circular && stops.length) {
    const d = roadKm(prev, origin, mode);
    km += d;
    move += travelMin(d, mode);
  }
  return { km, move, view, total: move + view };
}

// Best position to insert a stop (cheapest insertion)
function bestInsertion(origin, route, cand, mode, goal, circular) {
  let best = null;
  for (let i = 0; i <= route.length; i++) {
    const trial = [...route.slice(0, i), cand, ...route.slice(i)];
    const ev = evaluate(origin, trial, mode, goal, circular);
    if (!best || ev.total < best.ev.total) best = { route: trial, ev };
  }
  return best;
}

// 2-opt: untangle crossings in the visiting order
function twoOpt(origin, route, mode, goal, circular) {
  let best = route;
  let bestTotal = evaluate(origin, best, mode, goal, circular).total;
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 0; i < best.length - 1; i++) {
      for (let k = i + 1; k < best.length; k++) {
        const trial = [...best.slice(0, i), ...best.slice(i, k + 1).reverse(), ...best.slice(k + 1)];
        const t = evaluate(origin, trial, mode, goal, circular).total;
        if (t + 0.01 < bestTotal) {
          best = trial;
          bestTotal = t;
          improved = true;
        }
      }
    }
  }
  return best;
}

export function buildRoute({ origin, originName, travelMode, minutes, goal, circular, fromMyLocation = false }) {
  const mode = TRAVEL_MODES[travelMode] || TRAVEL_MODES['Bike / Scooty'];

  // 1. Candidates: within a practical radius for this travel mode (widen if too few)
  let radius = mode.maxRadiusKm;
  let pool = [];
  while (radius <= mode.maxRadiusKm * 3) {
    pool = pandalsData.filter((p) => distanceKm(origin, pt(p)) <= radius);
    if (pool.length >= 4) break;
    radius *= 1.5;
  }

  // 2. Greedy: repeatedly add the stop with the best value per extra minute that still fits
  let route = [];
  let current = evaluate(origin, route, mode, goal, circular);
  const remaining = new Set(pool);
  while (route.length < MAX_STOPS) {
    let pick = null;
    for (const cand of remaining) {
      const ins = bestInsertion(origin, route, cand, mode, goal, circular);
      if (ins.ev.total > minutes) continue;
      const extra = Math.max(1, ins.ev.total - current.total);
      // Maximum Pandals: purely the cheapest next stop. Other goals: quality matters more than distance.
      const ratio = goalValue(cand, goal) / (goal === 'Maximum Pandals' ? extra : extra ** 0.6);
      if (!pick || ratio > pick.ratio) pick = { cand, ins, ratio };
    }
    if (!pick) break;
    route = pick.ins.route;
    current = pick.ins.ev;
    remaining.delete(pick.cand);
  }

  route = twoOpt(origin, route, mode, goal, circular);
  return timeRoute({
    origin, originName, travelMode, goal, circular, budgetMin: minutes, pandals: route, fromMyLocation, searchRadiusKm: radius,
  });
}

// Timeline and totals for a fixed, ordered list of pandals.
// Also used when the visitor removes or reorders stops, so times and links stay correct.
export function timeRoute({ origin, originName, travelMode, goal, circular, budgetMin, pandals, fromMyLocation = false, searchRadiusKm }) {
  const mode = TRAVEL_MODES[travelMode] || TRAVEL_MODES['Bike / Scooty'];
  const totals = evaluate(origin, pandals, mode, goal, circular);

  let prev = origin;
  let clock = 0;
  const stops = pandals.map((p) => {
    const legKm = roadKm(prev, pt(p), mode);
    const legMin = travelMin(legKm, mode) + mode.parkMin;
    clock += legMin;
    const arrive = clock;
    const stay = visitMin(p, goal);
    clock += stay;
    prev = pt(p);
    return { pandal: p, legKm, legMin: Math.round(legMin), arriveMin: Math.round(arrive), stayMin: stay };
  });
  const backKm = circular && pandals.length ? roadKm(prev, origin, mode) : 0;

  return {
    origin,
    originName,
    travelMode,
    goal,
    circular,
    budgetMin,
    fromMyLocation,
    stops,
    returnLeg: backKm ? { legKm: backKm, legMin: Math.round(travelMin(backKm, mode)) } : null,
    distanceKm: totals.km,
    travelMinutes: Math.round(totals.move),
    viewingMinutes: Math.round(totals.view),
    totalMinutes: Math.round(totals.total),
    searchRadiusKm,
    googleMapsUrl: googleMapsUrl(origin, pandals, mode, circular, fromMyLocation),
  };
}

// Google Maps directions link in the right travel mode (walking / two-wheeler / driving).
// From the visitor's own location we leave out the origin so Google uses their live GPS
// and opens straight into turn-by-turn navigation.
export function googleMapsUrl(origin, pandals, mode, circular, fromMyLocation = false) {
  if (!pandals.length) return null;
  const ll = (p) => `${p.latitude},${p.longitude}`;
  const destination = circular ? `${origin.lat},${origin.lng}` : ll(pandals[pandals.length - 1]);
  const waypoints = (circular ? pandals : pandals.slice(0, -1)).map(ll).join('|');
  const params = new URLSearchParams({ api: '1' });
  if (!fromMyLocation) params.set('origin', `${origin.lat},${origin.lng}`);
  params.set('destination', destination);
  if (waypoints) params.set('waypoints', waypoints);
  params.set('travelmode', mode.gmaps);
  if (fromMyLocation) params.set('dir_action', 'navigate');
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

// Estimate for a fixed, curated list of stops (used by the curated circuit cards)
export function estimateCircuit(pandals, travelMode, goal = 'Top Themes') {
  const mode = TRAVEL_MODES[travelMode] || TRAVEL_MODES['Bike / Scooty'];
  if (!pandals.length) return null;
  const origin = pt(pandals[0]);
  const ev = evaluate(origin, pandals.slice(1), mode, goal, false);
  const firstVisit = visitMin(pandals[0], goal);
  return {
    distanceKm: ev.km,
    totalMinutes: Math.round(ev.total + firstVisit),
    // Congestion + parking time included in the total
    bufferMinutes: Math.round(travelMin(ev.km, mode) * (TRAFFIC_BUFFER / (1 + TRAFFIC_BUFFER)) + mode.parkMin * (pandals.length - 1)),
    googleMapsUrl: googleMapsUrl(origin, pandals.slice(1), mode, false),
  };
}

export const formatDuration = (min) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? `${h}h${m ? ` ${m}m` : ''}` : `${m}m`;
};

export const formatKm = (km) => `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;

// Real road geometry from the free OpenStreetMap routing servers (walking uses footpaths,
// bike and car use roads). Falls back to straight lines on the map if unavailable.
const ROUTING_PROFILES = { walking: 'routed-foot', bike: 'routed-car', car: 'routed-car' };

export async function fetchRoadGeometry(points, signal, travelMode = 'Bike / Scooty') {
  if (points.length < 2) return null;
  const profile = ROUTING_PROFILES[(TRAVEL_MODES[travelMode] || TRAVEL_MODES['Bike / Scooty']).key];
  const coords = points.map((p) => `${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(';');
  const res = await fetch(
    `https://routing.openstreetmap.de/${profile}/route/v1/driving/${coords}?overview=full&geometries=geojson`,
    { signal }
  );
  if (!res.ok) throw new Error(`Routing ${res.status}`);
  const data = await res.json();
  const route = data.routes?.[0];
  if (!route) throw new Error('No route');
  return {
    latlngs: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distanceKm: route.distance / 1000,
  };
}
