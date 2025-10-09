"use client";

import { useEffect, useRef, useState } from "react";

interface DraggableGoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  onMapMove?: (lat: number, lng: number) => void;
  apiKey?: string;
}

export default function DraggableGoogleMap({
  center,
  zoom = 16,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_KEY || "",
  onMapMove,
}: DraggableGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    // This script check is for preventing duplicated script loading
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // placeholder for clean up functions
    };
  }, [apiKey]);

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

    // Listen for drag start
    map.addListener("dragstart", () => {
      setIsDragging(true);
    });

    // Listen for drag end
    map.addListener("dragend", () => {
      setIsDragging(false);
    });

    // Listen for center changes (when user drags the map)
    map.addListener("idle", () => {
      const newCenter = map.getCenter();
      if (newCenter && onMapMove) {
        onMapMove(newCenter.lat(), newCenter.lng());
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            {/* Pin - visible when not dragging */}
            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 transition-all duration-200 ease-in-out ${
                isDragging ? "opacity-0 scale-75" : "opacity-100 scale-100"
              }`}
            >
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-primary drop-shadow-xl"
              >
                <path
                  fill="currentColor"
                  stroke="#fff"
                  stroke-width="2"
                  d="M16 3C10.477 3 6 7.477 6 13c0 8 10 16 10 16s10-8 10-16c0-5.523-4.477-10-10-10zm0 13.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
                />
              </svg>
            </div>

            <div
              className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-200 ${
                isDragging ? "opacity-100 scale-100" : "opacity-0 scale-75"
              }`}
            >
              {/* Circle at top */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="w-6 border-2 border-white h-6 rounded-full bg-primary shadow-lg animate-pulse" />
              </div>
              {/* Dashed line */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-2 flex items-center justify-center">
                <svg
                  width="2"
                  height="20"
                  className="overflow-visible animate-pulse"
                >
                  <line
                    x1="1"
                    y1="0"
                    x2="1"
                    y2="20"
                    stroke="#0055dd"
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Dot at bottom */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <div className="w-2 h-2 border-1 border-white rounded-full bg-primary shadow-md" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
