import React, { createContext, useContext, useState, useEffect } from 'react';
import pandalsData from '../data/pandals.json';

const PlanContext = createContext();

export function PlanProvider({ children }) {
  const [savedPandalIds, setSavedPandalIds] = useState(() => {
    try {
      const stored = localStorage.getItem('pujo_pandal_saved') || localStorage.getItem('pujo_songi_saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('pujo_pandal_saved', JSON.stringify(savedPandalIds));
    } catch (e) {
      console.error(e);
    }
  }, [savedPandalIds]);

  const toggleSave = (pandalId) => {
    setSavedPandalIds((prev) =>
      prev.includes(pandalId) ? prev.filter((id) => id !== pandalId) : [...prev, pandalId]
    );
  };

  const isSaved = (pandalId) => savedPandalIds.includes(pandalId);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setIsLocating(false);
        // Default to Siliguri center if denied
        setLocationError(err.message || 'Location access denied. Using Siliguri center.');
        setUserLocation({
          lat: 26.7271,
          lng: 88.4289,
          isSimulated: true
        });
      },
      { timeout: 10000 }
    );
  };

  // Helper to calculate distance in km using Haversine formula
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const savedPandals = pandalsData.filter((p) => savedPandalIds.includes(p.id));

  return (
    <PlanContext.Provider
      value={{
        savedPandalIds,
        savedPandals,
        toggleSave,
        isSaved,
        userLocation,
        isLocating,
        locationError,
        requestUserLocation,
        getDistanceKm,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
