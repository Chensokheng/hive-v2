"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { getPlaceByGeocode } from "@/services/address/get-place-by-geocode";
import { updateDeliveryAddress } from "@/services/address/update-delivery-address";
import { useAddresStore } from "@/store/address";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import useGetUserInfo from "@/hooks/use-get-user-info";

import CurrentLocationIcon from "../icon/current-location";

export default function UseCurrentLocation() {
  const t = useTranslations("map");
  const [isLoading, setIsLoading] = useState(false);
  const { merchant } = useParams() as { merchant: string };
  const { data: user } = useGetUserInfo();
  const queryClient = useQueryClient();
  const setUnAuthAddress = useAddresStore((state) => state.setUnAuthAddress);

  const handleUseCurrentLocation = async () => {
    setIsLoading(true);

    try {
      // Get current position from browser
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error(t("toast.geolocationNotSupported")));
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

      if (user?.userId && user.token) {
        // Logged in user - update via API
        // Get address and placeId from coordinates using the API
        const geocodeResult = await getPlaceByGeocode({
          lat,
          lng,
          token: user.token,
        });

        if (!geocodeResult.status || !geocodeResult.data) {
          throw new Error("Failed to get address from location");
        }

        const locationData = geocodeResult.data;
        await updateDeliveryAddress({
          userId: Number(user.userId),
          placeId: locationData.id,
          token: user.token,
        });

        await queryClient.invalidateQueries({ queryKey: ["user-info"] });
        await queryClient.invalidateQueries({
          queryKey: ["merchant-outlets", merchant],
        });
      } else {
        // Not logged in - use sessionStorage
        const locationAddress = "Current Location";

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
      toast.error(
        error instanceof Error ? error.message : t("toast.failedToGetLocation")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleUseCurrentLocation}
      disabled={isLoading}
      className="flex items-center gap-3 p-3 w-full hover:bg-primary/10 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isLoading ? (
        <Loader className="h-5 w-5 text-primary animate-spin" />
      ) : (
        <CurrentLocationIcon className="h-5 w-5 text-primary" />
      )}
      <span className="text-primary font-semibold">
        {isLoading ? t("gettingLocation") : t("useCurrentLocation")}
      </span>
    </button>
  );
}
