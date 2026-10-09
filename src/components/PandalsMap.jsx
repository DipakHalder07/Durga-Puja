import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const pin = (n) =>
  L.divIcon({
    className: 'pandals-map-pin',
    html: `<div style="width:26px;height:26px;border-radius:9999px;display:flex;align-items:center;justify-content:center;
      font:700 12px Inter,system-ui,sans-serif;background:#820A14;color:#FFFBF5;border:2px solid #FBD596;
      box-shadow:0 3px 8px -2px rgba(58,2,18,.5)">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -12],
  });

// Numbered pandal pins on a small map. The map only starts once it scrolls into view.
export default function PandalsMap({ pandals, className = 'h-64 sm:h-80' }) {
  const elRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!elRef.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: '200px' });
    io.observe(elRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !elRef.current || !pandals.length) return;
    const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '&copy; Google Maps',
    }).addTo(map);
    const markers = pandals.map((p, i) =>
      L.marker([p.latitude, p.longitude], { icon: pin(i + 1) })
        .bindPopup(`<div style="padding:10px 12px"><a href="/pandals/${p.slug}" style="font-weight:700;color:#820A14">${i + 1}. ${p.name}</a><br/><span style="font-size:11px;color:#6E5A55">${p.area_name}</span></div>`)
        .addTo(map)
    );
    map.fitBounds(L.featureGroup(markers).getBounds(), { padding: [28, 28], maxZoom: 16 });
    return () => map.remove();
  }, [visible, pandals]);

  return (
    <div
      ref={elRef}
      className={`relative z-0 w-full rounded-2xl overflow-hidden border border-brand-border bg-brand-paper ${className}`}
      role="img"
      aria-label={`Map of ${pandals.length} pandals`}
    />
  );
}
