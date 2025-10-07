"use client";

import React, { useMemo } from "react";
import { useAddresStore } from "@/store/address";
import { ChevronLeft } from "lucide-react";

import useGetUserInfo from "@/hooks/use-get-user-info";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import UseCurrentLocation from "../google-map/current-location";
import StaticMapImage from "../google-map/static-google-map-image";
import { AddressModal } from "./modal/address-form-modal";
import SavedAddress from "./saved-address";
import SearchAddress from "./search-address";

// NOTE: We need to use this default location to render the map
const DEFAULT_LAT_LNG = { lat: 11.550966450309836, lng: 104.9287729533798 }; // Keystone building
const DEFAULT_ADDRESS = "146 Norodom Blvd, Phnom Penh, Cambodia";

export default function Address() {
  const { data: user } = useGetUserInfo();
  const openAddresSheet = useAddresStore((state) => state.openAddresSheet);
  const setOpenAddresSheet = useAddresStore(
    (state) => state.setOpenAddressSheet
  );

  const setSavedAddressModal = useAddresStore(
    (state) => state.setSavedAddressModal
  );

  const currentMapData = useMemo(() => {
    if (user?.latitude && user?.longtitude && user?.placeAddress) {
      // Use user data
      return {
        lat: user.latitude,
        lng: user.longtitude,
        address: user.placeAddress,
      };
    } else {
      const getSessionStorageValue = (key: string): string | null => {
        if (typeof window !== "undefined") {
          const value = sessionStorage.getItem(key);
          return value ? value : null;
        }
        return null;
      };

      // Use sessionStorage
      const sessionLat = Number(getSessionStorageValue("lat"));
      const sessionLng = Number(getSessionStorageValue("lng"));
      const sessionAddress = getSessionStorageValue("address");

      if (sessionLat && sessionLng && sessionAddress) {
        return {
          lat: sessionLat,
          lng: sessionLng,
          address: sessionAddress,
        };
      }
    }

    // Fallback
    return {
      lat: DEFAULT_LAT_LNG.lat,
      lng: DEFAULT_LAT_LNG.lng,
      address: DEFAULT_ADDRESS,
    };
  }, [user?.latitude, user?.longtitude, user?.placeAddress]);

  return (
    <Sheet open={openAddresSheet} onOpenChange={setOpenAddresSheet}>
      <SheetContent
        showCloseBtn={false}
        className=" focus:outline-none border-none w-full sm:max-w-[600px]"
      >
        <SheetHeader className="hidden">
          <SheetTitle>Config Address</SheetTitle>
          <SheetDescription>User set address</SheetDescription>
        </SheetHeader>
        <div className="w-full">
          {/* header */}
          <div
            className="flex items-center p-4 lg:p-6  cursor-pointer border-b"
            onClick={() => setOpenAddresSheet(false)}
          >
            <ChevronLeft className="text-primary w-8 h-8 cursor-pointer" />
            <h1 className="font-bold text-lg lg:text-2xl flex-1 text-center">
              Address Details
            </h1>
          </div>
          <SearchAddress className="p-4 space-y-3" />

          <div className="px-4">
            <StaticMapImage
              lat={currentMapData.lat}
              lng={currentMapData.lng}
              address={currentMapData.address}
            />

            <UseCurrentLocation />
          </div>

          <SavedAddress />

          <AddressModal
            addressType="other"
            setOpenModal={setSavedAddressModal}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
