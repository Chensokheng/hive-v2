"use client";

import React, { useState } from "react";
import { getPlaceByGeocode } from "@/services/address/get-place-by-geocode";
import { useSavedAddressStore } from "@/store/saved-address";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

import useGetUserInfo from "@/hooks/use-get-user-info";

import CurrentLocationIcon from "../../icon/current-location";

export default function SavedAddressUseCurrentLocation() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useGetUserInfo();

  const updateAddressFormField = useSavedAddressStore(
    (state) => state.updateAddressFormField
  );

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);

    try {
      // Get current position from browser
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
          }

          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Get address from coordinates
      const geocodeResult = await getPlaceByGeocode({
        lat,
        lng,
        token: user?.token || "",
      });

      if (!geocodeResult.status || !geocodeResult.data) {
        toast.error("Failed to get address from location");
      }

      const locationData = geocodeResult.data;

      // Update the form store with current location
      updateAddressFormField("location", {
        id: locationData.id,
        address: locationData.address,
        lat: locationData.lat,
        lng: locationData.lng,
      });
    } catch (error) {
      console.error("Error getting current location:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to get current location. Please enable location permissions."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleUseCurrentLocation}
      disabled={isLoading}
      className="flex items-center gap-3 p-3 w-full hover:bg-primary/10 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <Loader className="h-5 w-5 text-primary animate-spin" />
      ) : (
        <CurrentLocationIcon className="h-5 w-5 text-primary" />
      )}
      <span className="text-primary font-semibold">
        {isLoading ? "Getting location..." : "Use Current Location"}
      </span>
    </button>
  );
}
