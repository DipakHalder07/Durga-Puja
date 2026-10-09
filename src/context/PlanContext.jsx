import React, { createContext, useContext, useState, useEffect, startTransition } from 'react';

const PlanContext = createContext();
const STORAGE_KEY = 'pujo_pandal_saved';

const persist = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage blocked (private mode) — the plan just won't persist
  }
};

export function PlanProvider({ children }) {
  // Starts empty on the server and on the first client render (so hydration matches),
  // then loads the visitor's saved pandals from this device.
  const [savedPandalIds, setSavedPandalIds] = useState([]);

  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    let stored = null;
    try {
      stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem('pujo_songi_saved') || 'null');
    } catch {
      // ignore unreadable storage
    }
    // A transition lets React finish hydrating the page before the saved state lands
    if (Array.isArray(stored) && stored.length) startTransition(() => setSavedPandalIds(stored));
  }, []);

  const toggleSave = (pandalId) => {
    setSavedPandalIds((prev) => {
      const next = prev.includes(pandalId) ? prev.filter((id) => id !== pandalId) : [...prev, pandalId];
      persist(next);
      return next;
    });
  };

  const isSaved = (pandalId) => savedPandalIds.includes(pandalId);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 26.7271, lng: 88.4289, isSimulated: true });
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setIsLocating(false);
        // Default to Siliguri centre if denied
        setUserLocation({
          lat: 26.7271,
          lng: 88.4289,
          isSimulated: true,
        });
      },
      { timeout: 10000 }
    );
  };

  return (
    <PlanContext.Provider
      value={{
        savedPandalIds,
        toggleSave,
        isSaved,
        userLocation,
        isLocating,
        requestUserLocation,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
