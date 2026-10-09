import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoadGeometry } from '../lib/routeEngine';

const numberedIcon = (label, isOrigin = false) =>
  L.divIcon({
    className: 'route-stop-marker',
    html: `<div style="
      width:${isOrigin ? 34 : 30}px;height:${isOrigin ? 34 : 30}px;border-radius:9999px;
      display:flex;align-items:center;justify-content:center;
      font:800 ${isOrigin ? 11 : 13}px 'Plus Jakarta Sans',system-ui,sans-serif;
      background:${isOrigin ? '#E8AE45' : '#820A14'};color:${isOrigin ? '#3A0212' : '#FFFBF5'};
      border:3px solid ${isOrigin ? '#3A0212' : '#FBD596'};
      box-shadow:0 4px 10px -2px rgba(58,2,18,.45)">${label}</div>`,
    iconSize: [isOrigin ? 34 : 30, isOrigin ? 34 : 30],
    iconAnchor: [isOrigin ? 17 : 15, isOrigin ? 17 : 15],
    popupAnchor: [0, -14],
  });

// Leaflet map of a route: start marker, numbered stops, road path (or straight-line fallback)
// startLabel/numberOffset let the first pandal act as the start (curated circuits)
export default function RouteMap({ origin, originName = 'Start', stops, circular = false, startLabel = 'S', numberOffset = 0, travelMode, onRoadDistance, className = 'h-72 sm:h-96' }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const [pathStatus, setPathStatus] = useState('loading'); // loading | road | approx

  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, { zoomControl: true, scrollWheelZoom: false, tap: true });
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps',
    }).addTo(map);
    mapRef.current = map;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(elRef.current);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !origin) return;
    layerRef.current?.remove();
    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;

    const points = [origin, ...stops.map((p) => ({ lat: p.latitude, lng: p.longitude }))];
    if (circular && stops.length) points.push(origin);

    L.marker([origin.lat, origin.lng], { icon: numberedIcon(startLabel, true), zIndexOffset: 1000 })
      .bindPopup(`<div style="padding:10px 12px"><strong>${startLabel === 'S' ? 'Start: ' : `${startLabel}. `}${originName}</strong></div>`)
      .addTo(layer);
    stops.forEach((p, i) => {
      L.marker([p.latitude, p.longitude], { icon: numberedIcon(i + 1 + numberOffset) })
        .bindPopup(`<div style="padding:10px 12px"><strong>${i + 1 + numberOffset}. ${p.name}</strong><br/><span style="font-size:11px;color:#6E5A55">${p.area_name}</span></div>`)
        .addTo(layer);
    });

    const straight = L.polyline(points.map((p) => [p.lat, p.lng]), {
      color: '#820A14', weight: 4, opacity: 0.85, dashArray: '8 8',
    }).addTo(layer);
    map.fitBounds(straight.getBounds(), { padding: [36, 36], maxZoom: 16 });

    // Upgrade to real road geometry when the routing service answers
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    setPathStatus('loading');
    fetchRoadGeometry(points, ctrl.signal, travelMode)
      .then((geo) => {
        if (!geo || layerRef.current !== layer) return;
        layer.removeLayer(straight);
        L.polyline(geo.latlngs, { color: '#FBD596', weight: 9, opacity: 0.9 }).addTo(layer);
        L.polyline(geo.latlngs, { color: '#820A14', weight: 5, opacity: 0.95 }).addTo(layer);
        setPathStatus('road');
        onRoadDistance?.(geo.distanceKm);
      })
      .catch(() => {
        if (layerRef.current !== layer) return;
        setPathStatus('approx');
        onRoadDistance?.(null);
      })
      .finally(() => clearTimeout(timer));

    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [origin, originName, stops, circular, startLabel, numberOffset, travelMode]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-brand-border shadow-2xs">
      <div ref={elRef} className={`w-full z-0 ${className}`} role="img" aria-label="Map of your Puja route" />
      <span className="absolute bottom-2 left-2 z-[400] px-2 py-1 rounded-md bg-brand-card/95 text-[10px] font-semibold text-brand-muted border border-brand-border shadow-2xs">
        {pathStatus === 'road' ? (travelMode === 'Walking' ? 'Walking path' : 'Road path') : pathStatus === 'loading' ? 'Loading road path…' : 'Approximate path (straight lines)'}
      </span>
    </div>
  );
}
