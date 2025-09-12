"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { reverseGeocode } from "@/services/map/get-map";
import { Check, Loader2, Target, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CurrentLocationIcon from "@/components/icon/current-location";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-v2/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  ),
});

interface LocationData {
  id: string;
  lat: number;
  lng: number;
  address: string;
}

interface MapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: LocationData) => void;
  initialCenter?: { lat: number; lng: number };
}

const DEFAULT_CENTER = { lat: 11.550966450309836, lng: 104.9287729533798 }; // Keystone building

export function MapLocationPicker({
  isOpen,
  onClose,
  onLocationSelect,
  initialCenter = DEFAULT_CENTER,
}: MapLocationPickerProps) {
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Function to call the Hive API for reverse geocoding
  const reverseGeocodeWithHiveAPI = useCallback(
    async (lat: number, lng: number) => {
      setIsReverseGeocoding(true);
      setError(null);

      try {
        const address = await reverseGeocode(lat, lng);

        // const data = await response.json();
        if (address) {
          const locationData: LocationData = {
            // id: data.data.id,
            id: "placeholder-id",
            lat: lat,
            lng: lng,
            address: address,
          };

          setCurrentLocation(locationData);
          return locationData;
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        setError("Failed to get address for this location");

        // Fallback location data
        const fallbackLocation: LocationData = {
          id: `fallback-${error}-${Date.now()}`,
          lat: 0.0,
          lng: 0.0,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        };

        setCurrentLocation(fallbackLocation);
        return fallbackLocation;
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    []
  );

  // Debounced reverse geocoding when map moves
  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = setTimeout(() => {
      reverseGeocodeWithHiveAPI(mapCenter.lat, mapCenter.lng);
    }, 1000); // 1 second delay

    return () => clearTimeout(timeoutId);
  }, [mapCenter, isOpen, reverseGeocodeWithHiveAPI]);

  // Initialize with current map center when dialog opens
  useEffect(() => {
    if (isOpen) {
      setMapCenter(initialCenter);
      reverseGeocodeWithHiveAPI(initialCenter.lat, initialCenter.lng);
    }
  }, [isOpen, initialCenter, reverseGeocodeWithHiveAPI]);

  const handleMapMove = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  };

  const handleConfirmLocation = () => {
    if (currentLocation) {
      onLocationSelect(currentLocation);
      onClose();
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsReverseGeocoding(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMapCenter(coords);
          await reverseGeocodeWithHiveAPI(coords.lat, coords.lng);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError(
            "Unable to get your current location. Please ensure location services are enabled."
          );
          setIsReverseGeocoding(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle className="hidden" aria-readonly>
            Select Location on Map
          </DialogTitle>
          <DialogDescription className="hidden" aria-readonly>
            Drag the map to select your desired location
          </DialogDescription>
        </DialogHeader>

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Location</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Modal Content */}
        <div className="p-4 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Drag the map to position the pin at your desired location
              </p>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200">
              <MapComponent
                center={mapCenter}
                selectedAddress={null}
                zoom={16}
                showDropPin={true}
                onMapMove={handleMapMove}
                allowProgrammaticUpdate={false}
              />
            </div>

            {/* Loading Overlay */}
            {isReverseGeocoding && (
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <div className="bg-white rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">
                      Getting address...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current Location Button */}
          <Button
            onClick={handleUseCurrentLocation}
            variant="outline"
            disabled={isReverseGeocoding}
            className="w-full cursor-pointer"
          >
            {/* <Target className="w-4 h-4 mr-2" /> */}
            <CurrentLocationIcon className="h-5 w-5 text-primary" />
            Use Current Location
          </Button>

          {/* Address Display */}
          {currentLocation && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900">Selected Location:</h4>
              <p className="text-sm text-gray-600 break-words">
                {currentLocation.address}
              </p>

              {/* DEBUG */}
              {/* <div className="text-xs text-gray-500">
                <p>Lat: {currentLocation.lat.toFixed(6)}</p>
                <p>Lng: {currentLocation.lng.toFixed(6)}</p>
                <p>ID: {currentLocation.id}</p>
              </div> */}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-between gap-3 p-4 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLocation}
            disabled={!currentLocation || isReverseGeocoding}
            className="flex-1"
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
