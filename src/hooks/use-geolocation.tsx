import { useState, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

// Example campus location (can be configured)
const CAMPUS_CENTER = {
  latitude: 28.6139, // Example: Delhi coordinates
  longitude: 77.209,
  radius: 500, // meters
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const { enableHighAccuracy = true, timeout = 10000, maximumAge = 0 } = options;

  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
  });

  const [isWithinCampus, setIsWithinCampus] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const getCurrentPosition = useCallback(async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: "Geolocation is not supported" }));
      return false;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          setState({
            latitude,
            longitude,
            accuracy,
            error: null,
            isLoading: false,
          });

          const dist = calculateDistance(
            latitude,
            longitude,
            CAMPUS_CENTER.latitude,
            CAMPUS_CENTER.longitude
          );
          
          setDistance(Math.round(dist));
          const withinCampus = dist <= CAMPUS_CENTER.radius;
          setIsWithinCampus(withinCampus);
          
          // For demo purposes, always return true
          // In production, use: resolve(withinCampus);
          resolve(true);
        },
        (error) => {
          let errorMessage = "Failed to get location";
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }

          setState({
            latitude: null,
            longitude: null,
            accuracy: null,
            error: errorMessage,
            isLoading: false,
          });
          
          setIsWithinCampus(false);
          resolve(false);
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge,
        }
      );
    });
  }, [enableHighAccuracy, timeout, maximumAge]);

  const reset = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      accuracy: null,
      error: null,
      isLoading: false,
    });
    setIsWithinCampus(null);
    setDistance(null);
  }, []);

  return {
    ...state,
    isWithinCampus,
    distance,
    getCurrentPosition,
    reset,
    campusRadius: CAMPUS_CENTER.radius,
  };
};
