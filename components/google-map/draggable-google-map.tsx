"use client";

import { useEffect, useRef, useState } from "react";

interface DraggableGoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  onMapMove?: (lat: number, lng: number) => void;
  apiKey: string;
}

export default function DraggableGoogleMap({
  center,
  zoom = 16,
  onMapMove,
  apiKey,
}: DraggableGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || googleMapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: "greedy",
    });

    googleMapRef.current = map;

    // Listen for center changes (when user drags the map)
    map.addListener("idle", () => {
      const newCenter = map.getCenter();
      if (newCenter && onMapMove) {
        onMapMove(newCenter.lat(), newCenter.lng());
      }
    });
  }, [isLoaded, center.lat, center.lng, zoom, onMapMove]);

  // Update map center when prop changes
  useEffect(() => {
    if (googleMapRef.current) {
      googleMapRef.current.setCenter(center);
    }
  }, [center]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}

      {/* Center pin overlay */}
      {isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="relative">
            <div className="w-10 h-10 relative transform -translate-y-5">
              <svg
                viewBox="0 0 24 24"
                className="w-10 h-10 text-red-500 drop-shadow-xl"
                fill="currentColor"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
