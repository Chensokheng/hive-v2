"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { reverseGeocode } from "@/services/map/get-map";
import { useAddresStore } from "@/store/address";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";

import useGetUserInfo from "@/hooks/use-get-user-info";

import CurrentLocationIcon from "../icon/current-location";

const getCurrentLocationData = async (lat: number, lng: number) => {
  const currentAddr = await reverseGeocode(lat, lng);

  return currentAddr;
};

export default function UseCurrentLocation() {
  const [isLoading, setIsLoading] = useState(false);
  const { merchant } = useParams() as { merchant: string };
  const { data: user } = useGetUserInfo();
  const queryClient = useQueryClient();
  const setUnAuthAddress = useAddresStore((state) => state.setUnAuthAddress);
  const setOpenAddressSheet = useAddresStore(
    (state) => state.setOpenAddressSheet
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

      // Get address and placeId from coordinates
      const locationAddress = await getCurrentLocationData(lat, lng);

      if (user?.userId && user.token) {
        // Logged in user - update via API

        // FIXME: reverse by latLng to get placeId
        /* const res = await updateDeliveryAddress({
          userId: Number(user.userId),
          placeId: locationData.placeId,
          token: user.token,
        }); */

        await queryClient.invalidateQueries({ queryKey: ["user-info"] });
        await queryClient.invalidateQueries({
          queryKey: ["merchant-outlets", merchant],
        });
      } else {
        // Not logged in - update sessionStorage
        sessionStorage.setItem("address", locationAddress);
        sessionStorage.setItem("lat", lat.toString());
        sessionStorage.setItem("lng", lng.toString());

        setUnAuthAddress(locationAddress);

        queryClient.setQueryData(["user-info"], {
          ...user,
          placeAddress: locationAddress,
          latitude: lat,
          longtitude: lng,
        });

        await queryClient.invalidateQueries({
          queryKey: ["merchant-outlets", merchant],
        });
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      // You might want to show a toast notification here
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
