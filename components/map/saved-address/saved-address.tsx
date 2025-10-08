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

import useGetUserInfo from "@/hooks/use-get-user-info";
import useSavedLocations from "@/hooks/use-saved-locations";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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

      // Close the address sheet
      // setOpenAddressSheet(false);
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
          <button
            onClick={(e) => handleSelectAddress(homeLocation, e)}
            disabled={selectingLocationId === homeLocation.id}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3 flex-1">
              {selectingLocationId === homeLocation.id ? (
                <Loader className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <Home className="h-4 w-4 text-primary" strokeWidth={2.5} />
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
              onClick={(e) => handleEditAddress("home", homeLocation, e)}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors"
              disabled={selectingLocationId === homeLocation.id}
            >
              <Pencil className="h-4 w-4 text-primary" />
            </button>
          </button>
        ) : (
          <button
            onClick={() => handleAddAddress("home")}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-primary" strokeWidth={2.5} />
              <span className="text-primary font-normal">Add Home Address</span>
            </div>
            <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </button>
        )}
        <Separator className="mb-0" />

        {/* Work Address */}
        {workLocation ? (
          <button
            onClick={(e) => handleSelectAddress(workLocation, e)}
            disabled={selectingLocationId === workLocation.id}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3 flex-1">
              {selectingLocationId === workLocation.id ? (
                <Loader className="h-4 w-4 text-primary animate-spin" />
              ) : (
                <BriefcaseBusiness
                  className="h-4 w-4 text-primary"
                  strokeWidth={2.5}
                />
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
              onClick={(e) => handleEditAddress("work", workLocation, e)}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors"
              disabled={selectingLocationId === workLocation.id}
            >
              <Pencil className="h-4 w-4 text-primary" />
            </button>
          </button>
        ) : (
          <button
            onClick={() => handleAddAddress("work")}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <BriefcaseBusiness
                className="h-4 w-4 text-primary"
                strokeWidth={2.5}
              />
              <span className="text-primary font-normal">Add Work Address</span>
            </div>
            <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          </button>
        )}
        <Separator className="mb-0" />

        {/* Other Addresses */}
        {otherLocations.map((location) => (
          <div key={location.id}>
            <button
              onClick={(e) => handleSelectAddress(location, e)}
              disabled={selectingLocationId === location.id}
              className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3 flex-1">
                {selectingLocationId === location.id ? (
                  <Loader className="h-4 w-4 text-primary animate-spin" />
                ) : (
                  <MapPin
                    className="h-4 w-4 text-primary mt-1"
                    strokeWidth={2.5}
                  />
                )}
                <div className="flex-1">
                  <p className="text-gray-400 font-semibold text-xs mb-1">
                    {location.name || "Other"}
                  </p>
                  <p className="text-black line-clamp-2">{location.address}</p>
                </div>
              </div>
              <button
                onClick={(e) => handleEditAddress("other", location, e)}
                className="p-2 hover:bg-primary/20 rounded-full transition-colors"
                disabled={selectingLocationId === location.id}
              >
                <Pencil className="h-4 w-4 text-primary" />
              </button>
            </button>
            <Separator className="mb-0" />
          </div>
        ))}

        {/* Add Other Address Button */}
        <button
          onClick={() => handleAddAddress("other")}
          className="flex items-center gap-3 w-full mb-0 p-4 hover:bg-primary/10 transition-colors text-left"
        >
          <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-primary font-normal">Add Other Address</span>
        </button>
      </div>
    </div>
  );
}
