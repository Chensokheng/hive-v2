"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { reverseGeocode } from "@/services/map/get-map";
import { ChevronDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapLocationPicker } from "@/components/hive/checkout/address/map-draggable-modal";
import CurrentLocationIcon from "@/components/icon/current-location";
import MapPin from "@/components/icon/map-pin";

const addressTypes = {
  home: "Home",
  work: "Work",
  other: "Other",
};

export type TAddressType = keyof typeof addressTypes;

// FIXME: move to DTOs
interface LocationData {
  id?: string;
  lat: number;
  lng: number;
  address: string;
}

interface AddressModalProps {
  addressType: TAddressType;
  setOpenModal: (isOpen: boolean) => void;
}

interface AddressFormData {
  label: TAddressType;
  address?: LocationData;
}

const DEFAULT_LAT_LNG = { lat: 11.550966450309836, lng: 104.9287729533798 }; // Keystone building

const MapViewOnlyInner = dynamic(
  () => import("@/components/map/MapViewOnlyComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    ),
  }
);

export function AddressModal({ addressType, setOpenModal }: AddressModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    label: addressType,
    address: undefined,
  });

  const [showMapPicker, setShowMapPicker] = useState(false);

  // NOTE: use the formData for /saved-location
  console.log("Form Data:", formData);

  const isHomeOrWork = [addressTypes.home, addressTypes.work].includes(
    addressTypes[addressType]
  );

  const handleSaveAddress = () => {
    // Validate that we have address data
    if (!formData.address) {
      alert("Please select a location on the map");
      return;
    }

    console.log("Saving address:", formData);

    setOpenModal(false);
    // Reset form

    // NOTE: Use React-hook-form
    setFormData({
      label: "home",
      address: undefined,
    });
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: LocationData) => {
    console.log("Selected location:", location);
    setFormData((prev) => ({ ...prev, address: location }));
    setShowMapPicker(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const address = await reverseGeocode(coords.lat, coords.lng);

          try {
            const locationData: LocationData = {
              // id: data.data.id,
              lat: coords.lat,
              lng: coords.lng,
              address: address,
            };

            setFormData((prev) => ({ ...prev, address: locationData }));
            // Call the Hive API for reverse geocoding
            /* const response = await fetch(
              `https://api.gohive.online/api/web/consumer/address/place-by-geocode?latlng=${coords.lat},${coords.lng}`,
              {
                headers: {
                  "User-Agent": "NextJS-Map-App/1.0",
                  Accept: "application/json",
                },
              }
            );

            console.log(">>>>> response", response);

            if (response.ok) {
              const data = await response.json();
              if (data.status && data.data) {
                const locationData: LocationData = {
                  id: data.data.id,
                  lat: data.data.lat,
                  lng: data.data.lng,
                  address: data.data.address,
                };

                setFormData((prev) => ({ ...prev, address: locationData }));
              }
            } else {
              throw new Error("Failed to get address");
            } */
          } catch (error) {
            console.error("Error getting address:", error);
            // Fallback to coordinates
            const fallbackLocation: LocationData = {
              id: `current-${Date.now()}`,
              lat: coords.lat,
              lng: coords.lng,
              address: `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
            };
            setFormData((prev) => ({ ...prev, address: fallbackLocation }));
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your current location. Please ensure location services are enabled."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <Dialog open={true} onOpenChange={setOpenModal}>
        <DialogContent className="w-full max-w-sm max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="hidden">
            <DialogTitle className="hidden" aria-readonly>
              {`Add ${addressTypes[addressType]} Address`}
            </DialogTitle>
            <DialogDescription className="hidden" aria-readonly>
              Add a new address for delivery
            </DialogDescription>
          </DialogHeader>

          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">
              {`Add ${addressTypes[addressType]} Address`}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenModal(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="p-4 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Address Label */}
            <Input
              id="label"
              value={isHomeOrWork ? addressType : ""}
              onChange={(e) => handleInputChange("label", e.target.value)}
              className={cn("py-6 rounded-2xl", isHomeOrWork ? "hidden" : "")}
              placeholder={"Add address name"}
            />

            <div className="">
              <h3 className="text-base font-bold mb-3">Choose Address</h3>

              {/* Address Dropdown */}
              <div className="relative mb-4">
                <button
                  onClick={() => setShowMapPicker(true)}
                  className="w-full flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-full bg-secondary hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-500 flex-1 text-left">
                    {formData.address ? "Change address" : "Enter address"}
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div
                onClick={() => setShowMapPicker(true)}
                className="relative h-34 bg-gray-100 rounded-lg mb-2 border-secondary border-1 overflow-hidden cursor-pointer"
              >
                <MapViewOnlyInner
                  center={
                    formData.address
                      ? {
                          lat: formData.address.lat,
                          lng: formData.address.lng,
                        }
                      : DEFAULT_LAT_LNG
                  }
                  showPin={true}
                />
                <div
                  className="cursor-pointer relative"
                  onClick={() => setShowMapPicker(true)}
                >
                  <MapViewOnlyInner
                    center={
                      formData.address
                        ? {
                            lat: formData.address.lat,
                            lng: formData.address.lng,
                          }
                        : DEFAULT_LAT_LNG
                      // DEFAULT_LAT_LNG
                    }
                    showPin={true}
                  />

                  {/* Click overlay */}
                  <div className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 rounded-lg px-3 py-2 opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium text-gray-700">
                        Click to select location
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Location Overlay */}
                <div className="absolute z-50 bottom-0 left-0 right-0 bg-white shadow-lg border-gray-200">
                  <div className="flex items-center gap-3 p-2">
                    <MapPin className="text-gray-500 h-6 w-6" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {formData.address
                          ? formData.address.address.split(",")[0]
                          : "Keystone Building"}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">
                        {formData.address
                          ? formData.address.address
                          : "Phnom Penh"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Use Current Location */}
              <button
                onClick={handleUseCurrentLocation}
                className="flex items-center gap-3 p-3 w-full hover:bg-primary/10 rounded-lg transition-colors group cursor-pointer"
              >
                <CurrentLocationIcon className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">
                  Use Current Location
                </span>
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-5">
            <Button
              onClick={handleSaveAddress}
              className="rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
              disabled={!formData.address}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Location Picker Dialog */}
      <MapLocationPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleLocationSelect}
        initialCenter={
          formData.address
            ? { lat: formData.address.lat, lng: formData.address.lng }
            : DEFAULT_LAT_LNG
        }
      />
    </>
  );
}
