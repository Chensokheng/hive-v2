"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPlaceByGeocode } from "@/services/address/get-place-by-geocode";
import { updateDeliveryAddress } from "@/services/address/update-delivery-address";
import { DEFAULT_LAT_LNG, useAddresStore } from "@/store/address";
import {
  LocationData,
  useSavedAddressStore,
  useSavedLocationStore,
} from "@/store/saved-address";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

import useGetUserInfo from "@/hooks/use-get-user-info";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DraggableGoogleMap from "@/components/google-map/draggable-google-map";
import CurrentLocationIcon from "@/components/icon/current-location";

interface MapLocationPickerProps {
  initialCenter?: { lat: number; lng: number };
}

export function MapLocationPicker({
  initialCenter = DEFAULT_LAT_LNG,
}: MapLocationPickerProps) {
  const t = useTranslations("map");
  const { merchant } = useParams() as { merchant: string };
  const queryClient = useQueryClient();
  const { data: user } = useGetUserInfo();

  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [canRenderMap, setCanRenderMap] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const openDraggableMap = useAddresStore((state) => state.openDraggableMap);
  const mapContext = useAddresStore((state) => state.mapContext);
  const setOpenDraggableMap = useAddresStore(
    (state) => state.setOpenDraggableMap
  );

  const addressFormData = useSavedAddressStore(
    (state) => state.addressFormData
  );
  const updateAddressFormField = useSavedAddressStore(
    (state) => state.updateAddressFormField
  );
  const editingLocation = useSavedLocationStore(
    (state) => state.editingLocation
  );

  // Determine initial center based on context
  const getInitialCenter = useCallback(() => {
    if (mapContext === "saved-address") {
      // For saved address: prioritize form data > editing location > user location
      if (addressFormData.location) {
        return {
          lat: addressFormData.location.lat,
          lng: addressFormData.location.lng,
        };
      }
      if (editingLocation) {
        return {
          lat: editingLocation.lat,
          lng: editingLocation.lng,
        };
      }
    }
    // For user location or fallback
    return initialCenter;
  }, [mapContext, addressFormData.location, editingLocation, initialCenter]);

  // Function to get place data using getPlaceByGeocode
  const getPlaceData = useCallback(
    async (lat: number, lng: number) => {
      if (!user?.token) {
        throw new Error("User token is required");
      }

      setError(null);

      try {
        const geocodeResult = await getPlaceByGeocode({
          lat,
          lng,
          token: user.token,
        });

        if (geocodeResult.status && geocodeResult.data) {
          const locationData: LocationData = {
            id: geocodeResult.data.id,
            lat: geocodeResult.data.lat,
            lng: geocodeResult.data.lng,
            address: geocodeResult.data.address,
          };

          setCurrentLocation(locationData);
          return locationData;
        } else {
          toast.error(t("toast.invalidLocationResponse"));
          // toast.error("Invalid location response format");
        }
      } catch (error: any) {
        console.error("Reverse geocoding error:", error);
        toast.error(t("toast.failedToGetAddressForLocation"));
        // toast.error("Failed to get address for this location");
      } finally {
        setIsReverseGeocoding(false);
      }
    },
    [user?.token]
  );

  // Initial check when dialog opens - test API before rendering map
  useEffect(() => {
    const initializeMap = async () => {
      if (openDraggableMap && !canRenderMap && user?.token) {
        setIsInitializing(true);
        setError(null);

        const center = getInitialCenter();

        try {
          // Test the API with initial coordinates
          const result = await getPlaceByGeocode({
            lat: center.lat,
            lng: center.lng,
            token: user.token,
          });

          if (result.status && result.data) {
            setCanRenderMap(true);
            setMapCenter(center);
            setCurrentLocation({
              id: result.data.id,
              lat: result.data.lat,
              lng: result.data.lng,
              address: result.data.address,
            });
          } else {
            toast.error(t("toast.apiRequestFailed"));
          }
        } catch (error: any) {
          console.error("Map initialization error:", error);
          toast.error(t("toast.failedToInitializeMap"));
          setCanRenderMap(false);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    if (openDraggableMap) {
      initializeMap();
    } else {
      setCanRenderMap(false);
      setCurrentLocation(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDraggableMap, user?.token, getInitialCenter]);

  useEffect(() => {
    if (!canRenderMap || !user?.token) return;

    setIsReverseGeocoding(true);
    const timeoutId = setTimeout(() => {
      getPlaceData(mapCenter.lat, mapCenter.lng);
    }, 1000); // NOTE: wait for 1 second before getting the data

    return () => clearTimeout(timeoutId);
  }, [mapCenter.lat, mapCenter.lng, canRenderMap, user?.token, getPlaceData]);

  const handleMapMove = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  };

  const handleConfirmLocation = async () => {
    if (!currentLocation || !user?.userId || !user?.token) return;

    setIsUpdating(true);

    try {
      if (mapContext === "user-location") {
        // Update user's main delivery address
        await updateDeliveryAddress({
          userId: Number(user.userId),
          placeId: currentLocation.id,
          token: user.token,
        });

        // Refresh user data and outlets
        await queryClient.invalidateQueries({ queryKey: ["user-info"] });
        await queryClient.invalidateQueries({
          queryKey: ["merchant-outlets", merchant],
        });
        await queryClient.invalidateQueries({
          queryKey: ["outlet-menu-nearby"],
        });

        toast.success(t("toast.locationUpdated"));
      } else if (mapContext === "saved-address") {
        // Update the form data for saved address
        updateAddressFormField("location", currentLocation);
        // toast.success("Location selected");
      }

      setOpenDraggableMap(false);
    } catch (error) {
      console.error("Error confirming location:", error);
      toast.error("Failed to update location. Please try again.");
    } finally {
      setIsUpdating(false);
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
          await getPlaceData(coords.lat, coords.lng);
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

  const handleClose = () => {
    setOpenDraggableMap(false);
    setCanRenderMap(false);
    setCurrentLocation(null);
    setError(null);
  };

  return (
    <Dialog open={openDraggableMap} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-2xl h-10/12 md:h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="hidden">
          <DialogTitle className="hidden" aria-readonly>
            {"Select " +
              (mapContext === "user-location" ? "Your" : "Address") +
              " Location"}
          </DialogTitle>
          <DialogDescription className="hidden" aria-readonly>
            Drag the map to select your desired location
          </DialogDescription>
        </DialogHeader>

        {isInitializing && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-base text-gray-600 font-medium">
              Loading map...
            </p>
          </div>
        )}

        {!isInitializing && error && !canRenderMap && (
          <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Unable to Load Map
              </h3>
              <p className="text-sm text-gray-600 max-w-md">{error}</p>
            </div>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        )}

        {!isInitializing && canRenderMap && (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {mapContext === "user-location"
                      ? t("selectYourLocation")
                      : t("selectAddressLocation")}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {t("dragMapInstruction")}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-10 w-10 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <DraggableGoogleMap
                center={mapCenter}
                zoom={16}
                onMapMove={handleMapMove}
              />

              {/* Loading Overlay */}
              {isReverseGeocoding && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs md:text-sm font-medium text-gray-700">
                        {t("updatingLocation")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border-t shadow-lg">
              <div className="px-6 py-4 space-y-3">
                {currentLocation && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {t("selectedAddress")}
                      </p>
                    </div>
                    <p className="text-sm text-gray-900 leading-relaxed pl-6">
                      {currentLocation.address}
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleUseCurrentLocation}
                  variant="outline"
                  disabled={isReverseGeocoding || isUpdating}
                  className="w-full h-11 rounded-lg border-2 hover:bg-primary/5 hover:border-primary transition-colors"
                >
                  <CurrentLocationIcon className="h-5 w-5 text-primary mr-2" />
                  <span className="font-medium">{t("useCurrentLocation")}</span>
                </Button>
              </div>

              <div className="flex gap-3 px-6 py-4 bg-gray-50 border-t">
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 h-11 rounded-lg font-medium"
                  disabled={isUpdating}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={handleConfirmLocation}
                  disabled={
                    !currentLocation || isReverseGeocoding || isUpdating
                  }
                  className="flex-1 h-11 rounded-lg font-medium"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("updatingLocation")}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {mapContext === "user-location"
                        ? t("updateMyLocation")
                        : t("confirmLocation")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
