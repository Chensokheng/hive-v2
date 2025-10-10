"use client";

import { useMemo } from "react";
import Image from "next/image";

const GOOGLE_MAP_STATIC_IMAGE_URL =
  "https://maps.googleapis.com/maps/api/staticmap";

interface StaticMapImageProps {
  lat: number;
  lng: number;
  address: string;
  addressLength?: number;
  apiKey?: string;
  zoom?: number;
  width?: number;
  height?: number;
  markerColor?: string;
  className?: string;
  mapType?: "roadmap" | "satellite" | "terrain" | "hybrid";
  scale?: 1 | 2; // 2 for retina displays
}

function shortenName(addressName: string, addressLength: number): string {
  if (addressName.length > addressLength) {
    return addressName.slice(0, addressLength) + "...";
  }
  return addressName;
}

function getCityOrCountry(address: string): string {
  const parts = address.split(",").map((part) => part.trim());

  if (parts.length >= 2) {
    // Return second-to-last part
    return parts[parts.length - 2];
  } else {
    return parts[0];
  }
}

/**
 * A reusable component for displaying Google Static Maps
 *
 * 1 Google-map API calll = Each unique URL combination (lat, lng, zoom, size)
 */
export default function StaticMapImage({
  lat,
  lng,
  address,
  addressLength = 50,
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_STATIC_KEY || "",
  zoom = 16,
  width = 600,
  height = 200,
  markerColor = "red",
  mapType = "roadmap",
  scale = 1,
}: StaticMapImageProps) {
  // Memoize URL generation - only recalculates when dependencies change
  const staticMapUrl = useMemo(() => {
    const params = new URLSearchParams({
      center: `${lat},${lng}`,
      zoom: zoom.toString(),
      size: `${width}x${height}`,
      maptype: mapType,
      scale: scale.toString(),
      key: apiKey,
    });

    // Add marker
    params.append("markers", `color:${markerColor}|${lat},${lng}`);

    return `${GOOGLE_MAP_STATIC_IMAGE_URL}?${params.toString()}`;
  }, [lat, lng, zoom, width, height, markerColor, mapType, scale, apiKey]);

  return (
    <div className="rounded-lg mb-2 border-1 border-secondary shadow-sm">
      <div className="rounded-t-lg">
        <div className="h-full w-full flex items-center justify-center">
          <Image
            src={staticMapUrl}
            alt={`Static map image at ${lat}, ${lng}`}
            width={width}
            height={height}
            className="object-cover w-full h-full rounded-t-lg"
            unoptimized // Required for external URLs with query params
          />
        </div>
      </div>

      {/* Location address */}
      <div className="bg-white rounded-b-lg z-50">
        <div className="flex items-center gap-3 px-4 py-2">
          <div>
            <h4 className="font-semibold truncate">
              {" "}
              {shortenName(address, addressLength)}{" "}
            </h4>
            <p className="text-sm text-gray-500">
              {" "}
              {getCityOrCountry(address)}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
