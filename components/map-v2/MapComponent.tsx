"use client";

import { useEffect } from "react";
import { LatLngLiteral, LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";

interface Address {
  id: string;
  name: string;
  nameKh?: string;
  description: string;
  coordinates: LatLngLiteral;
  type: "building" | "street" | "district";
}

interface MapComponentProps {
  center: LatLngLiteral;
  selectedAddress: Address | null;
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  showDropPin?: boolean;
  onMapMove?: (lat: number, lng: number) => void;
  allowProgrammaticUpdate?: boolean;
}

// Component to update map view when center changes
function ChangeView({
  center,
  zoom,
  shouldUpdate = true,
}: {
  center: { lat: number; lng: number };
  zoom: number;
  shouldUpdate?: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (shouldUpdate) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map, shouldUpdate]);

  return null;
}

// Component to handle map click events
function MapClickHandler({
  onMapClick,
}: {
  onMapClick?: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

// Component to track map center changes for drop pin functionality
function MapCenterTracker({
  onCenterChange,
}: {
  onCenterChange?: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter();

      console.log(">>> mapsCenterTracker - cente: ", center);
      if (onCenterChange) {
        onCenterChange(center.lat, center.lng);
      }
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, onCenterChange]);

  return null;
}

export default function MapComponent({
  center,
  selectedAddress,
  zoom = 16,
  onMapClick,
  showDropPin = false,
  onMapMove,
  allowProgrammaticUpdate = true,
}: MapComponentProps) {
  const position: LatLngTuple = [center.lat, center.lng];

  console.log("<<<<<<<< Map component: zoom ", zoom);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200 relative z-0">
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        // zoomControl={true}
        // scrollWheelZoom={true}
        className="z-1"
      >
        <ChangeView
          center={center}
          zoom={zoom}
          shouldUpdate={allowProgrammaticUpdate && !showDropPin}
        />
        <MapClickHandler onMapClick={onMapClick} />
        <MapCenterTracker onCenterChange={onMapMove} />

        <TileLayer
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>

      {/* Center pin for drop pin mode */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="relative">
          {/* Pin icon in center */}
          <div className="w-10 h-10 relative transform -translate-y-5">
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-red-500 drop-shadow-xl filter"
              fill="currentColor"
              // style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
