import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, MapPin, Star, Sparkles, Clock, Ban, Check, 
  Bookmark, Navigation, Layers, CheckCircle2 
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import pandalsData from '../data/pandals.json';
import areasData from '../data/areas.json';

// Fix leaflet default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG markers with score
const createCustomIcon = (score, isSelected) => {
  const isHigh = Number(score) >= 9.4;
  const bg = isSelected ? '#820A14' : isHigh ? '#6C020E' : '#820A14';
  const stroke = isSelected ? '#FFFFFF' : '#E8AE45';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 42" width="32" height="42">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <path d="M16 0C7.16 0 0 7.16 0 16c0 11.2 14.4 24.6 15.2 25.4.4.4 1.1.4 1.5 0C17.6 40.6 32 27.2 32 16 32 7.16 24.84 0 16 0z" fill="${bg}" stroke="${stroke}" stroke-width="1.5" filter="url(#shadow)"/>
      <circle cx="16" cy="15" r="9" fill="#FFFBF5"/>
      <text x="16" y="19" font-family="'Inter', system-ui, sans-serif" font-weight="bold" font-size="9" fill="${bg}" text-anchor="middle">${score}</text>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-pandal-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38],
  });
};

// Map Tile Layers (All working without any API key!)
const TILE_LAYERS = {
  'google-streets': {
    name: 'Google Maps',
    url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps',
  },
  'google-satellite': {
    name: 'Google Satellite',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['0', '1', '2', '3'],
    maxZoom: 20,
    attribution: '&copy; Google Maps Satellite',
  },
  'osm-standard': {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: [],
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
  },
};

export default function InteractiveMap({ initialSelectedPandal = null, height = 'h-[650px]' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const currentTileLayerRef = useRef(null);
  const markersRef = useRef({});

  const { isSaved, toggleSave, userLocation, requestUserLocation } = usePlan();

  const [mapType, setMapType] = useState('google-streets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePandal, setActivePandal] = useState(initialSelectedPandal);

  // Filter pandals
  const filteredPandals = pandalsData.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.theme && p.theme.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesArea = selectedArea === 'All' || p.area_name === selectedArea;
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Verified' && p.verified) ||
      (selectedCategory === 'Top Theme' && (p.category === 'Theme' || Number(p.pujo_songi_score) >= 9.3)) ||
      (selectedCategory === 'Traditional' && (p.category === 'Traditional' || p.category === 'Sabeki')) ||
      (selectedCategory === 'Parking' && p.parking_available);

    return matchesSearch && matchesArea && matchesCategory;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [26.718, 88.428],
        zoom: 13,
        zoomControl: true,
      });

      // Default to Google Maps layer (100% Free, NO API KEY NEEDED)
      const tileConfig = TILE_LAYERS['google-streets'];
      const tileLayer = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
        subdomains: tileConfig.subdomains,
      }).addTo(map);

      currentTileLayerRef.current = tileLayer;
      mapInstanceRef.current = map;

      // Force recalculate dimensions so tiles render immediately without grey borders
      setTimeout(() => {
        map.invalidateSize();
      }, 150);

      const handleResize = () => map.invalidateSize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        map.remove();
        mapInstanceRef.current = null;
      };
    }
  }, []);

  // Handle Map Type switch (Google Maps, Satellite, Warm Map)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const tileConfig = TILE_LAYERS[mapType] || TILE_LAYERS['google-streets'];
    const newLayer = L.tileLayer(tileConfig.url, {
      attribution: tileConfig.attribution,
      maxZoom: tileConfig.maxZoom,
      subdomains: tileConfig.subdomains,
    }).addTo(map);

    currentTileLayerRef.current = newLayer;
  }, [mapType]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    filteredPandals.forEach((pandal) => {
      if (!pandal.latitude || !pandal.longitude) return;

      const lat = parseFloat(pandal.latitude);
      const lng = parseFloat(pandal.longitude);
      const isSelected = activePandal?.id === pandal.id;
      const score = pandal.pujo_songi_score || '9.0';

      const marker = L.marker([lat, lng], {
        icon: createCustomIcon(score, isSelected),
      }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="min-width: 230px; max-width: 270px; font-family: 'Inter', system-ui, sans-serif; padding: 12px 14px;">
          <div style="font-size: 10px; font-weight: 700; color: #820A14; text-transform: uppercase; margin-bottom: 2px;">
            ${pandal.area_name} • ${pandal.zone || 'Siliguri'}
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #2A0A0E; margin-bottom: 4px; line-height: 1.25;">
            ${pandal.name}
          </div>
          ${pandal.theme ? `<div style="font-size: 11px; color: #6E5A55; margin-bottom: 8px; line-height: 1.3;">${pandal.theme}</div>` : ''}
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid #F0DFC8; padding-top: 8px;">
            <span style="font-weight: 700; color: #6C020E;">★ ${pandal.rating}</span>
            <span style="font-weight: 700; color: #820A14;">Pandal Score ${pandal.pujo_songi_score}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setActivePandal(pandal);
      });

      markersRef.current[pandal.id] = marker;
    });

    // Fly to active pandal if provided
    if (activePandal && markersRef.current[activePandal.id]) {
      const pLat = parseFloat(activePandal.latitude);
      const pLng = parseFloat(activePandal.longitude);
      map.flyTo([pLat, pLng], 15, { duration: 1 });
      markersRef.current[activePandal.id].openPopup();
    }
  }, [filteredPandals, activePandal]);

  // Pan to user location if requested
  useEffect(() => {
    if (userLocation && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      const userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);
      userMarker.bindPopup('<b>You are here</b><br/>Siliguri Metropolitan Area').openPopup();
      map.flyTo([userLocation.lat, userLocation.lng], 14);
    }
  }, [userLocation]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-brand-border bg-brand-card shadow-songi flex flex-col">
      {/* Map Filter Controls Bar */}
      <div className="p-3 sm:p-4 md:p-5 border-b border-brand-border bg-brand-card/95 backdrop-blur-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 z-10">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2.5">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search pandal, area, or theme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-brand-ivory border border-brand-border text-brand-primary placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
            />
          </div>

          {/* Area Dropdown */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl bg-brand-ivory border border-brand-border text-brand-primary font-medium focus:outline-none focus:ring-2 focus:ring-brand-vermilion"
          >
            <option value="All">All 28 Areas ({pandalsData.length} Pandals)</option>
            {areasData.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Map Type Switcher & Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Layer Selector */}
          <div className="flex items-center bg-brand-ivory p-0.5 rounded-xl border border-brand-border shrink-0">
            {Object.entries(TILE_LAYERS).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMapType(key)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mapType === key
                    ? 'bg-brand-primary text-white shadow-2xs'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
                title={`Switch to ${cfg.name} (No API Key Required)`}
              >
                {cfg.name}
              </button>
            ))}
          </div>

          {/* Quick Filters */}
          {['All', 'Top Theme', 'Traditional', 'Parking', 'Verified'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-brand-vermilion text-white shadow-xs'
                  : 'bg-brand-ivory text-brand-primary border border-brand-border/80 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}

          <button
            type="button"
            onClick={requestUserLocation}
            className="p-2 rounded-xl bg-brand-ivory border border-brand-border text-brand-vermilion hover:bg-white active:scale-95 transition-all shadow-xs shrink-0"
            title="Locate my position on map"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className={`relative w-full ${height} z-0`}>
        <div ref={mapRef} className="w-full h-full" />

        {/* Floating count & Map status badge */}
        <div className="absolute top-4 left-4 z-[400] flex items-center gap-2">
          <div className="bg-brand-card/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-border shadow-songi text-xs font-bold text-brand-primary flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span><strong className="text-brand-vermilion">{filteredPandals.length}</strong> pandals</span>
          </div>

          <div className="hidden xs:flex bg-brand-card/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-border shadow-songi text-xs font-semibold text-brand-primary items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Maps Engine (No Key Needed)</span>
          </div>
        </div>

        {/* Active Pandal Drawer when marker is clicked */}
        {activePandal && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[400] bg-brand-card border border-brand-border rounded-2xl p-4 shadow-songi-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="eyebrow text-brand-vermilion block">
                  {activePandal.area_name} • {activePandal.zone}
                </span>
                <h4 className="font-display text-h3 font-semibold text-brand-ink mt-1 line-clamp-1">
                  {activePandal.name}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActivePandal(null)}
                className="text-brand-muted hover:text-brand-primary text-xs p-1"
              >
                ✕
              </button>
            </div>

            {activePandal.theme && (
              <p className="text-xs text-brand-muted mt-1.5 line-clamp-2">
                {activePandal.theme}
              </p>
            )}

            <div className="mt-3 pt-2.5 border-t border-brand-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-maroon">★ {activePandal.rating}</span>
                <span className="text-brand-border">•</span>
                <span className="text-brand-muted">~{activePandal.estimated_visit_minutes} min</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleSave(activePandal.id)}
                  className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    isSaved(activePandal.id)
                      ? 'bg-brand-vermilion text-white border-brand-vermilion'
                      : 'bg-brand-ivory text-brand-primary border-brand-border'
                  }`}
                  title="Save to plan"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                </button>

                <Link
                  to={`/pandals/${activePandal.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-brand-vermilion hover:bg-brand-vermilion-hover text-white text-xs font-bold transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
