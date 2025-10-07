"use client";

import { useState } from "react";
import { useAddresStore } from "@/store/address";
import { X } from "lucide-react";

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
import UseCurrentLocation from "@/components/google-map/current-location";
import StaticMapImage from "@/components/google-map/static-google-map-image";
import { MapLocationPicker } from "@/components/hive/checkout/address/map-draggable-modal";
import SearchAddress from "@/components/map/search-address";

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
  setOpenModal: (isOpen: string) => void;
}

interface AddressFormData {
  label: TAddressType;
  address?: LocationData;
}

const DEFAULT_LAT_LNG = { lat: 11.550966450309836, lng: 104.9287729533798 }; // Keystone building
const DEFAULT_ADDRESS =
  "No. 86A, Street 110, Russian Federation Blvd (110), Phnom Penh, Cambodia";

export function AddressModal({ addressType, setOpenModal }: AddressModalProps) {
  const savedAddressType = useAddresStore((state) => state.savedAddressType);
  const setSavedAddressModal = useAddresStore(
    (state) => state.setSavedAddressModal
  );

  const modalType: TAddressType =
    savedAddressType && savedAddressType in addressTypes
      ? (savedAddressType as TAddressType)
      : "other";

  const [formData, setFormData] = useState<AddressFormData>({
    label: modalType,
    address: undefined,
  });

  const [showMapPicker, setShowMapPicker] = useState(false);

  const isHomeOrWork = [addressTypes.home, addressTypes.work].includes(
    addressTypes[modalType]
  );

  const handleSaveAddress = () => {
    // Validate that we have address data
    if (!formData.address) {
      alert("Please select a location on the map");
      return;
    }

    setOpenModal("");

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

  return (
    <>
      <Dialog
        open={!!savedAddressType}
        onOpenChange={(open) =>
          setSavedAddressModal(open ? savedAddressType : "")
        }
      >
        <DialogContent className="w-full max-w-sm max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="hidden">
            <DialogTitle className="hidden" aria-readonly>
              {`Add ${addressTypes[modalType]} Address`}
            </DialogTitle>
            <DialogDescription className="hidden" aria-readonly>
              Add a new address for delivery
            </DialogDescription>
          </DialogHeader>

          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">
              {`Add ${addressTypes[modalType]} Address`}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenModal("")}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="px-4 space-y-3">
              <Input
                id="label"
                value={isHomeOrWork ? modalType : ""}
                onChange={(e) => handleInputChange("label", e.target.value)}
                className={cn(
                  "rounded-2xl p-4 h-14",
                  isHomeOrWork ? "hidden" : ""
                )}
                placeholder={"Add address name"}
              />

              <SearchAddress className="space-y-3" />

              <div
                onClick={() => setShowMapPicker(true)}
                className="h-44 bg-gray-100 rounded-lg mb-2 border-secondary border-1 cursor-pointer"
              >
                <StaticMapImage
                  lat={DEFAULT_LAT_LNG.lat}
                  lng={DEFAULT_LAT_LNG.lng}
                  address={DEFAULT_ADDRESS}
                  addressLength={30}
                />
              </div>

              <UseCurrentLocation />
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
