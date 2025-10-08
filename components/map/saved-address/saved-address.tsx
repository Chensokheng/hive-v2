"use client";

import { useAddresStore } from "@/store/address";
import { useSavedLocationStore } from "@/store/saved-address";
import { BriefcaseBusiness, Home, MapPin, Pencil, Plus } from "lucide-react";

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
  const setSavedAddressModal = useAddresStore(
    (state) => state.setSavedAddressModal
  );
  const setEditingLocation = useSavedLocationStore(
    (state) => state.setEditingLocation
  );

  const { savedLocations, isLoading } = useSavedLocations();

  // Get locations by type
  const homeLocation = savedLocations.find((loc) => loc.type === "HOME");
  const workLocation = savedLocations.find((loc) => loc.type === "WORK");
  const otherLocations = savedLocations.filter((loc) => loc.type === "OTHER");

  const handleAddOrEdit = (
    type: TAddressType,
    location?: (typeof savedLocations)[0]
  ) => {
    if (location) {
      setEditingLocation(location);
    } else {
      setEditingLocation(null);
    }
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
            onClick={() => handleAddOrEdit("home", homeLocation)}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left"
          >
            <div className="flex items-center gap-3 flex-1">
              <Home className="h-4 w-4 text-primary" strokeWidth={2.5} />
              <div className="flex-1">
                <p className="text-gray-400 font-semibold text-xs mb-1">
                  Home Address
                </p>
                <p className="text-black line-clamp-2">
                  {homeLocation.address}
                </p>
              </div>
            </div>
            <Pencil className="h-4 w-4 text-primary" />
          </button>
        ) : (
          <button
            onClick={() => handleAddOrEdit("home")}
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
            onClick={() => handleAddOrEdit("work", workLocation)}
            className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left"
          >
            <div className="flex items-center gap-3 flex-1">
              <BriefcaseBusiness
                className="h-4 w-4 text-primary"
                strokeWidth={2.5}
              />
              <div className="flex-1">
                <p className="text-gray-400 font-semibold text-xs mb-1">
                  Work Address
                </p>
                <p className="text-black line-clamp-2">
                  {workLocation.address}
                </p>
              </div>
            </div>
            <Pencil className="h-4 w-4 text-primary" />
          </button>
        ) : (
          <button
            onClick={() => handleAddOrEdit("work")}
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
              onClick={() => handleAddOrEdit("other", location)}
              className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group text-left"
            >
              <div className="flex items-center gap-3 flex-1">
                <MapPin
                  className="h-4 w-4 text-primary mt-1"
                  strokeWidth={2.5}
                />
                <div className="flex-1">
                  <p className="text-gray-400 font-semibold text-xs mb-1">
                    {location.name || "Other"}
                  </p>
                  <p className="text-black line-clamp-2">{location.address}</p>
                </div>
              </div>
              <Pencil className="h-4 w-4 text-primary" />
            </button>
            <Separator className="mb-0" />
          </div>
        ))}

        {/* Add Other Address Button */}
        <button
          onClick={() => handleAddOrEdit("other")}
          className="flex items-center gap-3 w-full mb-0 p-4 hover:bg-primary/10 transition-colors text-left"
        >
          <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
          <span className="text-primary font-normal">Add Other Address</span>
        </button>
      </div>
    </div>
  );
}
