'use client';
// lib/geo/useGeolocation.ts
import { useEffect, useCallback } from 'react';
import { useMapStore } from '@/lib/store/mapStore';

// Reverse geocode using Nominatim (free, no API key)
// TODO: replace with a premium geocoding API for production
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    const addr = data.address;
    // Return human-readable nearest place name
    const place = addr.village || addr.town || addr.city || addr.county || addr.state || 'Unknown location';
    const state = addr.state || '';
    return state ? `${place}, ${state}` : place;
  } catch {
    return 'Your location';
  }
}

export function useGeolocation() {
  const { setUserLocation, setViewport, setLocating } = useMapStore();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      // Fallback to Chennai coast if no geolocation support
      setUserLocation({ lat: 13.09, lng: 80.27, name: 'Chennai, Tamil Nadu' });
      setViewport(13.09, 80.27, 7);
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const name = await reverseGeocode(lat, lng);
        setUserLocation({ lat, lng, name });
        setViewport(lat, lng, 7);
        setLocating(false);
      },
      (_err) => {
        // Graceful fallback: default to Chennai coast (India's major fishing hub)
        setUserLocation({ lat: 13.09, lng: 80.27, name: 'Chennai, Tamil Nadu (default)' });
        setViewport(10.8, 79.0, 6); // Zoom out to show more of India coast
        setLocating(false);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  }, [setUserLocation, setViewport, setLocating]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { requestLocation };
}
