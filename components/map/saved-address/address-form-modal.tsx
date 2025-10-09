"use client";

import { useEffect, useMemo } from "react";
import { useAddresStore } from "@/store/address";
import {
  useSavedAddressStore,
  useSavedLocationStore,
} from "@/store/saved-address";
import { Loader, X } from "lucide-react";

import { cn } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";
import useSavedLocations from "@/hooks/use-saved-locations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import StaticMapImage from "@/components/google-map/static-google-map-image";

import SavedAddressUseCurrentLocation from "./current-location";
import SavedAddressSearch from "./search-saved-address";

const addressTypes = {
  home: "Home",
  work: "Work",
  other: "Other",
};

export type TAddressType = keyof typeof addressTypes;

interface AddressModalProps {
  addressType: TAddressType;
  setOpenModal: (isOpen: string) => void;
}

const DEFAULT_LAT_LNG = { lat: 11.550966450309836, lng: 104.9287729533798 };
const DEFAULT_ADDRESS =
  "No. 86A, Street 110, Russian Federation Blvd (110), Phnom Penh, Cambodia";

export default function AddressModal({ setOpenModal }: AddressModalProps) {
  const { data: user } = useGetUserInfo();

  // Get state from stores
  const savedAddressType = useAddresStore((state) => state.savedAddressType);

  const addressFormData = useSavedAddressStore(
    (state) => state.addressFormData
  );
  const setAddressFormData = useSavedAddressStore(
    (state) => state.setAddressFormData
  );
  const updateAddressFormField = useSavedAddressStore(
    (state) => state.updateAddressFormField
  );
  const resetAddressForm = useSavedAddressStore(
    (state) => state.resetAddressForm
  );

  const editingLocation = useSavedLocationStore(
    (state) => state.editingLocation
  );
  const setEditingLocation = useSavedLocationStore(
    (state) => state.setEditingLocation
  );

  const setOpenDraggableMap = useAddresStore(
    (state) => state.setOpenDraggableMap
  );

  const { createLocation, updateLocation, isCreating, isUpdating } =
    useSavedLocations();

  const modalType: TAddressType =
    savedAddressType && savedAddressType in addressTypes
      ? (savedAddressType as TAddressType)
      : "other";

  const isHomeOrWork = ["home", "work"].includes(modalType);

  // Get current map data for display
  const currentMapData = useMemo(() => {
    // Priority: formData.location > editingLocation > user data > default
    if (addressFormData.location) {
      return {
        lat: addressFormData.location.lat,
        lng: addressFormData.location.lng,
        address: addressFormData.location.address,
      };
    }

    if (editingLocation) {
      return {
        lat: editingLocation.lat,
        lng: editingLocation.lng,
        address: editingLocation.address,
      };
    }

    if (user?.latitude && user?.longtitude && user?.placeAddress) {
      return {
        lat: user.latitude,
        lng: user.longtitude,
        address: user.placeAddress,
      };
    }

    const sessionLat = sessionStorage.getItem("lat");
    const sessionLng = sessionStorage.getItem("lng");
    const sessionAddress = sessionStorage.getItem("address");

    if (sessionLat && sessionLng && sessionAddress) {
      return {
        lat: parseFloat(sessionLat),
        lng: parseFloat(sessionLng),
        address: sessionAddress,
      };
    }

    return {
      lat: DEFAULT_LAT_LNG.lat,
      lng: DEFAULT_LAT_LNG.lng,
      address: DEFAULT_ADDRESS,
    };
  }, [addressFormData.location, editingLocation, user]);

  // Initialize form when modal opens or editing location changes
  useEffect(() => {
    if (savedAddressType) {
      if (editingLocation) {
        // Editing existing location
        setAddressFormData({
          label: editingLocation.name || addressTypes[modalType],
          location: {
            id: editingLocation.place_id,
            lat: editingLocation.lat,
            lng: editingLocation.lng,
            address: editingLocation.address,
          },
        });
      } else {
        // Creating new location
        setAddressFormData({
          label: isHomeOrWork ? addressTypes[modalType] : "",
          location: undefined,
        });
      }
    }
  }, [
    editingLocation,
    savedAddressType,
    modalType,
    isHomeOrWork,
    setAddressFormData,
  ]);

  const handleSaveAddress = async () => {
    if (!addressFormData.location || !user?.token) {
      alert("Please select a location");
      return;
    }

    try {
      const addressData = {
        name: isHomeOrWork ? null : addressFormData.label || null,
        address: addressFormData.location.address,
        place_id: addressFormData.location.id || "",
        lat: addressFormData.location.lat,
        lng: addressFormData.location.lng,
        type: modalType.toUpperCase() as "HOME" | "WORK" | "OTHER",
      };

      if (editingLocation) {
        await updateLocation({
          id: editingLocation.id,
          ...addressData,
        });
      } else {
        await createLocation(addressData);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  /* 
  NOTE: Disable deleting saved-location for now
  const handleDeleteAddress = async () => {
    if (!editingLocation) return;

    const confirmed = confirm(
      `Are you sure you want to delete this ${modalType} address?`
    );
    if (!confirmed) return;

    try {
      await deleteLocation(editingLocation.id);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    }
  }; */

  const handleCloseModal = () => {
    setOpenModal("");
    setEditingLocation(null);
    resetAddressForm();
  };

  const isLoading = isCreating || isUpdating;
  // const isLoading = isCreating || isUpdating || isDeleting;

  return (
    <>
      <Dialog
        open={!!savedAddressType}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent className="w-full max-w-sm max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="hidden">
            <DialogTitle className="hidden" aria-readonly>
              {editingLocation
                ? `Edit ${addressTypes[modalType]} Address`
                : `Add ${addressTypes[modalType]} Address`}
            </DialogTitle>
            <DialogDescription className="hidden" aria-readonly>
              {editingLocation ? "Update" : "Add a new"} address for delivery
            </DialogDescription>
          </DialogHeader>

          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">
              {editingLocation
                ? `Edit ${addressTypes[modalType]} Address`
                : `Add ${addressTypes[modalType]} Address`}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseModal}
              className="h-8 w-8"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="px-4 space-y-3">
              {/* Label input for "Other" type */}
              {!isHomeOrWork && (
                <Input
                  id="label"
                  value={addressFormData.label}
                  onChange={(e) =>
                    updateAddressFormField("label", e.target.value)
                  }
                  className="rounded-2xl p-4 h-14"
                  placeholder="Add address name"
                  disabled={isLoading}
                />
              )}

              {/* Use the dedicated saved address search component */}
              <SavedAddressSearch className="space-y-3" />

              <div
                onClick={() => !isLoading && setOpenDraggableMap(true)}
                className={cn(
                  "h-44 bg-gray-100 rounded-lg mb-2 border-secondary border-1 cursor-pointer",
                  { "opacity-50 cursor-not-allowed": isLoading }
                )}
              >
                <StaticMapImage
                  lat={currentMapData.lat}
                  lng={currentMapData.lng}
                  address={currentMapData.address}
                  addressLength={30}
                />
              </div>

              <SavedAddressUseCurrentLocation />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-between gap-3 p-5 border-t">
            {/* {editingLocation && (
              <Button
                onClick={handleDeleteAddress}
                variant="outline"
                className="rounded-full border-red-500 text-red-500 hover:bg-red-50"
                disabled={isLoading}
              >
                {isDeleting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            )} */}
            <Button
              onClick={handleSaveAddress}
              className="rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 ml-auto"
              disabled={!addressFormData.location || isLoading}
            >
              {isCreating || isUpdating ? (
                <Loader className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingLocation ? "Update" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
