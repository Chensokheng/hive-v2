"use client";

import { LatLngLiteral, LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface MapViewOnlyComponentProps {
  center: LatLngLiteral;
  zoom?: number;
  className?: string;
  showPin?: boolean;
  pinColor?: string;
}

export default function MapViewOnlyComponent({
  center,
  zoom = 16,
  className = "w-full rounded-lg overflow-hidden border border-gray-200",
  showPin = true,
  pinColor = "text-red-500",
}: MapViewOnlyComponentProps) {
  const position: LatLngTuple = [center.lat, center.lng];

  return (
    <div className={`${className} h-full relative`}>
      <div className="z-10 h-full w-full">
        <MapContainer
          center={position}
          zoom={zoom}
          style={{ height: "100%", width: "100", zIndex: 10 }}
          zoomControl={false}
          scrollWheelZoom={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>

      {/* Center pin - conditionally rendered */}
      {showPin && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="relative">
            <div className="w-10 h-10 relative transform -translate-y-3 translate-x-3">
              <svg
                viewBox="0 0 24 24"
                className={`w-10 h-10 ${pinColor} drop-shadow-xl filter`}
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
