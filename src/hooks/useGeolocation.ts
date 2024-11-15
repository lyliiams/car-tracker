import { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  error?: string;
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ 
        latitude: 0, 
        longitude: 0, 
        error: 'Geolocation is not supported' 
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        setLocation({ 
          latitude: 0, 
          longitude: 0, 
          error: error.message 
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}