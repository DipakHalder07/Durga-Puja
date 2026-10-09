import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Plus, Minus, Maximize2, Layers } from 'lucide-react';
import { fetchRoadGeometry, formatKm } from '../lib/routeEngine';

const TILES = {
  map: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
  satellite: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const stopIcon = (label, active = false) =>
  L.divIcon({
    className: 'rs-marker',
    html: `<div class="rs-pin${active ? ' is-active' : ''}">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });

// Start marker: gold "S" with the place name in a pill beside it
const startIcon = (name) =>
  L.divIcon({
    className: 'rs-marker',
    html: `<div class="rs-start"><span class="rs-start-dot">S</span><span class="rs-start-name">${esc(name.length > 22 ? `${name.slice(0, 21)}…` : name)}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -18],
  });

// Narrow enough for phones; kept clear of the control column on the right
const POPUP = { maxWidth: 230, autoPanPaddingTopLeft: [16, 16], autoPanPaddingBottomRight: [64, 16] };

const popup = (title, sub, slug) =>
  `<div class="rs-pop"><strong>${esc(title)}</strong>${sub ? `<span>${esc(sub)}</span>` : ''}${
    slug ? `<a href="/pandals/${esc(slug)}" data-spa>View pandal details →</a>` : ''
  }</div>`;

function MapButton({ label, onClick, active = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      className={`w-10 h-10 flex items-center justify-center transition-colors ${
        active ? 'bg-brand-crimson text-white' : 'bg-brand-card text-brand-ink hover:bg-brand-paper'
      }`}
    >
      {children}
    </button>
  );
}

// Route map card: start pin, numbered stops, road path (straight-line fallback), custom controls.
// startLabel/numberOffset let the first pandal act as the start (curated circuits).
// focusIndex/onSelect link the map with an itinerary list (index into `stops`).
export default function RouteMap({
  origin,
  originName = 'Start',
  stops,
  circular = false,
  startLabel = 'S',
  numberOffset = 0,
  travelMode,
  onRoadDistance,
  focusIndex = null,
  onSelect,
  title = 'Route map',
  className = 'h-80 sm:h-[26rem]',
}) {
  const navigate = useNavigate();
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const layerRef = useRef(null);
  const boundsRef = useRef(null);
  const markersRef = useRef([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [path, setPath] = useState({ status: 'loading', km: null }); // loading | road | approx
  const [satellite, setSatellite] = useState(false);
  const [view, setView] = useState(null);

  // Map + tiles, once
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, { zoomControl: false, scrollWheelZoom: false, tap: true });
    // Wheel zoom only after the visitor clicks the map, so the page still scrolls normally
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());
    const sync = () => {
      const c = map.getCenter();
      setView({ lat: c.lat, lng: c.lng, zoom: map.getZoom() });
    };
    map.on('moveend zoomend', sync);
    mapRef.current = map;

    // Popup links navigate inside the app instead of reloading the page
    const onClick = (e) => {
      const a = e.target.closest?.('a[data-spa]');
      if (!a) return;
      e.preventDefault();
      navigate(a.getAttribute('href'));
    };
    elRef.current.addEventListener('click', onClick);

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(elRef.current);
    const el = elRef.current;
    return () => {
      ro.disconnect();
      el.removeEventListener('click', onClick);
      map.remove();
      mapRef.current = null;
    };
  }, [navigate]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileRef.current?.remove();
    tileRef.current = L.tileLayer(satellite ? TILES.satellite : TILES.map, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps',
    }).addTo(map);
  }, [satellite]);

  // Markers + path whenever the route changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !origin) return;
    layerRef.current?.remove();
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;

    const points = [origin, ...stops.map((p) => ({ lat: p.latitude, lng: p.longitude }))];
    if (circular && stops.length) points.push(origin);

    L.marker([origin.lat, origin.lng], {
      icon: startLabel === 'S' ? startIcon(originName) : stopIcon(startLabel),
      zIndexOffset: 1000,
      keyboard: false,
    })
      .bindPopup(popup(startLabel === 'S' ? `Start · ${originName}` : `${startLabel}. ${originName}`), POPUP)
      .addTo(layer);

    markersRef.current = stops.map((p, i) =>
      L.marker([p.latitude, p.longitude], { icon: stopIcon(i + 1 + numberOffset), title: p.name })
        .bindPopup(popup(`${i + 1 + numberOffset}. ${p.name}`, p.area_name, p.slug), POPUP)
        .on('click', () => onSelectRef.current?.(i))
        .addTo(layer)
    );

    const straight = L.polyline(points.map((p) => [p.lat, p.lng]), {
      color: '#820A14', weight: 4, opacity: 0.8, dashArray: '8 8',
    }).addTo(layer);
    boundsRef.current = straight.getBounds();
    map.fitBounds(boundsRef.current, { padding: [44, 44], maxZoom: 16 });

    // Upgrade to the real road path when the routing service answers
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    setPath({ status: 'loading', km: null });
    fetchRoadGeometry(points, ctrl.signal, travelMode)
      .then((geo) => {
        if (!geo || layerRef.current !== layer) return;
        layer.removeLayer(straight);
        L.polyline(geo.latlngs, { color: '#FBD596', weight: 10, opacity: 0.85 }).addTo(layer);
        L.polyline(geo.latlngs, { color: '#820A14', weight: 5, opacity: 0.95 }).addTo(layer);
        setPath({ status: 'road', km: geo.distanceKm });
        onRoadDistance?.(geo.distanceKm);
      })
      .catch(() => {
        if (layerRef.current !== layer) return;
        setPath({ status: 'approx', km: null });
        onRoadDistance?.(null);
      })
      .finally(() => clearTimeout(timer));

    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [origin, originName, stops, circular, startLabel, numberOffset, travelMode]);

  // Highlight and fly to the focused stop
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    markers.forEach((m, i) => {
      m.setIcon(stopIcon(i + 1 + numberOffset, i === focusIndex));
      m.setZIndexOffset(i === focusIndex ? 2000 : 0);
    });
    const m = focusIndex != null ? markers[focusIndex] : null;
    if (!map || !m) return;
    map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 16), { duration: 0.6 });
    map.once('moveend', () => m.openPopup());
  }, [focusIndex, stops, numberOffset]);

  const fitAll = () => boundsRef.current && mapRef.current?.flyToBounds(boundsRef.current, { padding: [44, 44], maxZoom: 16, duration: 0.6 });
  const modeWord = travelMode === 'Walking' ? 'Walking path' : 'Road path';
  const statusText =
    path.status === 'road' ? `${modeWord} · ${formatKm(path.km)}` : path.status === 'loading' ? 'Finding the road path…' : 'Approximate path';

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-2 sm:p-3 shadow-songi">
      <div className="flex items-center justify-between gap-3 px-2 pt-1 pb-3">
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-brand-ink">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-crimson ring-4 ring-brand-vermilion-light" aria-hidden="true" />
          {title}
        </p>
        <p className={`text-sm text-right ${path.status === 'road' ? 'text-brand-ink font-medium' : 'text-brand-muted'}`} aria-live="polite">
          {path.status === 'loading' && <span className="inline-block w-2 h-2 mr-1.5 rounded-full bg-brand-gold animate-pulse" aria-hidden="true" />}
          {statusText}
        </p>
      </div>

      <div className="relative isolate rounded-xl overflow-hidden border border-brand-border/70">
        <div ref={elRef} className={`w-full z-0 bg-brand-paper ${className}`} role="region" aria-label={`${title}: ${stops.length + 1} points`} />

        <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
          <div className="flex flex-col rounded-xl overflow-hidden border border-brand-border shadow-songi divide-y divide-brand-border">
            <MapButton label="Zoom in" onClick={() => mapRef.current?.zoomIn()}><Plus className="w-5 h-5" /></MapButton>
            <MapButton label="Zoom out" onClick={() => mapRef.current?.zoomOut()}><Minus className="w-5 h-5" /></MapButton>
          </div>
          <div className="flex flex-col rounded-xl overflow-hidden border border-brand-border shadow-songi divide-y divide-brand-border">
            <MapButton label="Show the whole route" onClick={fitAll}><Maximize2 className="w-[1.125rem] h-[1.125rem]" /></MapButton>
            <MapButton label={satellite ? 'Show street map' : 'Show satellite view'} onClick={() => setSatellite((s) => !s)} active={satellite}>
              <Layers className="w-[1.125rem] h-[1.125rem]" />
            </MapButton>
          </div>
        </div>

        {view && (
          <p className="hidden sm:flex absolute bottom-3 left-3 z-[400] items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-card/95 border border-brand-border text-xs text-brand-muted shadow-songi tabular-nums">
            <span className="font-semibold text-brand-ink">Siliguri, WB</span>
            <span aria-hidden="true">·</span>
            {view.lat.toFixed(4)}° N, {view.lng.toFixed(4)}° E
            <span aria-hidden="true">·</span>
            Zoom {view.zoom}
          </p>
        )}
      </div>
    </div>
  );
}
