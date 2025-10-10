"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { updateDeliveryAddress } from "@/services/address/update-delivery-address";
import { useAddresStore } from "@/store/address";
import { useSavedLocationStore } from "@/store/saved-address";
import { useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  Home,
  Loader,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";
import useSavedLocations from "@/hooks/use-saved-locations";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// eslint-disable-next-line unused-imports/no-unused-vars
const addressTypes = {
  home: "Home",
  work: "Work",
  other: "Other",
};

export type TAddressType = keyof typeof addressTypes;

export default function SavedAddress() {
  const { merchant } = useParams() as { merchant: string };
  const queryClient = useQueryClient();
  const { data: user } = useGetUserInfo();

  const setSavedAddressModal = useAddresStore(
    (state) => state.setSavedAddressModal
  );
  const setEditingLocation = useSavedLocationStore(
    (state) => state.setEditingLocation
  );

  const { savedLocations, isLoading } = useSavedLocations();
  const [selectingLocationId, setSelectingLocationId] = useState<number | null>(
    null
  );

  // Get locations by type
  const homeLocation = savedLocations.find((loc) => loc.type === "HOME");
  const workLocation = savedLocations.find((loc) => loc.type === "WORK");
  const otherLocations = savedLocations.filter((loc) => loc.type === "OTHER");

  // Handle selecting a saved address to use as delivery address
  const handleSelectAddress = async (
    location: (typeof savedLocations)[0],
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent event bubbling

    if (!user?.userId || !user?.token) {
      alert("Please login to use saved addresses");
      return;
    }

    setSelectingLocationId(location.id);

    try {
      // Update user's delivery address to this saved location
      await updateDeliveryAddress({
        userId: Number(user.userId),
        placeId: location.place_id,
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
    } catch (error) {
      console.error("Error selecting saved address:", error);
      alert("Failed to select address. Please try again.");
    } finally {
      setSelectingLocationId(null);
    }
  };

  // Handle editing a saved address
  const handleEditAddress = (
    type: TAddressType,
    location: (typeof savedLocations)[0],
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent triggering handleSelectAddress
    setEditingLocation(location);
    setSavedAddressModal(type);
  };

  // Handle adding a new address
  const handleAddAddress = (type: TAddressType) => {
    setEditingLocation(null);
    setSavedAddressModal(type);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <h3 className="text-base font-semibold">Saved Address</h3>
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-base font-semibold">Saved Address</h3>

      <div>
        {/* Home Address */}
        {homeLocation ? (
          <div
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest("[data-edit-button]")) {
                handleSelectAddress(homeLocation, e);
              }
            }}
            className={cn(
              "flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left cursor-pointer",
              {
                "opacity-50 cursor-not-allowed":
                  selectingLocationId === homeLocation.id,
              }
            )}
          >
            <div className="flex items-center gap-x-5 flex-1">
              {selectingLocationId === homeLocation.id ? (
                <Loader className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out -m-2" />
                  <Home
                    className="h-4 w-4 text-primary relative z-10 transition-transform duration-500 group-hover:rotate-360"
                    strokeWidth={2.5}
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-gray-400 font-semibold text-xs mb-1">
                  Home Address
                </p>
                <p className="text-black line-clamp-2">
                  {homeLocation.address}
                </p>
              </div>
            </div>
            <button
              data-edit-button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAddress("home", homeLocation, e);
              }}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors cursor-pointer"
              disabled={selectingLocationId === homeLocation.id}
            >
              <Pencil className="h-4 w-4 text-primary" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleAddAddress("home")}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-x-5">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out -m-2" />
                <Home
                  className="h-4 w-4 text-primary relative z-10 transition-transform duration-500 group-hover:rotate-360"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-primary font-normal">Add Home Address</span>
            </div>
            <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </button>
        )}
        <Separator className="mb-0" />

        {/* Work Address */}
        {workLocation ? (
          <div
            onClick={(e) => {
              if (!(e.target as HTMLElement).closest("[data-edit-button]")) {
                handleSelectAddress(workLocation, e);
              }
            }}
            className={cn(
              "flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left cursor-pointer",
              {
                "opacity-50 cursor-not-allowed":
                  selectingLocationId === workLocation.id,
              }
            )}
          >
            <div className="flex items-center gap-x-5 flex-1">
              {selectingLocationId === workLocation.id ? (
                <Loader className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out -m-2" />
                  <BriefcaseBusiness
                    className="h-4 w-4 text-primary relative z-10 transition-transform duration-500 group-hover:rotate-360"
                    strokeWidth={2.5}
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-gray-400 font-semibold text-xs mb-1">
                  Work Address
                </p>
                <p className="text-black line-clamp-2">
                  {workLocation.address}
                </p>
              </div>
            </div>
            <button
              data-edit-button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAddress("work", workLocation, e);
              }}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors cursor-pointer"
              disabled={selectingLocationId === workLocation.id}
            >
              <Pencil className="h-4 w-4 text-primary" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleAddAddress("work")}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-x-5">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out -m-2" />
                <BriefcaseBusiness
                  className="h-4 w-4 text-primary relative z-10 transition-transform duration-500 group-hover:rotate-360"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-primary font-normal">Add Work Address</span>
            </div>
            <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </button>
        )}
        <Separator className="mb-0" />

        {/* Other Addresses */}
        {otherLocations.map((location) => (
          <div key={location.id}>
            <div
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest("[data-edit-button]")) {
                  handleSelectAddress(location, e);
                }
              }}
              className={cn(
                "flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left cursor-pointer",
                {
                  "opacity-50 cursor-not-allowed":
                    selectingLocationId === location.id,
                }
              )}
            >
              <div className="flex items-center gap-x-5 flex-1">
                {selectingLocationId === location.id ? (
                  <Loader className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out -m-2" />
                    <MapPin
                      className="h-4 w-4 text-primary relative z-10 transition-transform duration-500 group-hover:rotate-360"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-gray-400 font-semibold text-xs mb-1">
                    {location.name || "Other"}
                  </p>
                  <p className="text-black line-clamp-2">{location.address}</p>
                </div>
              </div>
              <button
                data-edit-button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditAddress("other", location, e);
                }}
                className="p-2 hover:bg-primary/20 rounded-full transition-colors cursor-pointer"
                disabled={selectingLocationId === location.id}
              >
                <Pencil className="h-4 w-4 text-primary" />
              </button>
            </div>
            <Separator className="mb-0" />
          </div>
        ))}

        {/* Add Other Address Button */}
        <button
          onClick={() => handleAddAddress("other")}
          className="flex items-center gap-x-5 w-full mb-0 p-4 hover:bg-primary/10 transition-colors text-left cursor-pointer group"
        >
          <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-primary font-normal">Add Other Address</span>
        </button>
      </div>
    </div>
  );
}

<style>{`
  @keyframes rotate-360 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .group:hover .group-hover\\:rotate-360 {
    animation: rotate-360 0.5s ease-in-out;
  }
`}</style>;
