"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CurrentLocationIcon from "@/components/icon/current-location";
import MapPin from "@/components/icon/map-pin";

const addressTypes = {
  home: "Home",
  work: "Work",
  other: "Other",
};

export type TAddressType = keyof typeof addressTypes;

interface AddressModalProps {
  addressType: TAddressType;
  setOpenModal: (isOpen: boolean) => void;
}

interface AddressFormData {
  label: TAddressType;
  address?: object;
}

const DEFAULT_LAT_LNG = { lat: 11.550966450309836, lng: 104.9287729533798 }; // Keystone building

const MapViewOnlyInner = dynamic(
  () => import("@/components/map-v2/MapViewOnlyComponent"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    ),
  }
);

export function AddressModal({ addressType, setOpenModal }: AddressModalProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    label: addressType,
    address: {},
  });

  const isHomeOrWork = [addressTypes.home, addressTypes.work].includes(
    addressTypes[addressType]
  );

  const handleSaveAddress = () => {
    console.log(">>>>>>>> Saving address:", formData);

    setOpenModal(false);
    // Reset form

    // NOTE: React-hook-form
    setFormData({
      label: "home",
      address: {},
    });
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {/* Modal Backdrop */}
      {/* NOTE: use ShadCN Dialog */}
      <div
        className="fixed inset-0 bg-black/50 z-60"
        onClick={() => setOpenModal(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-70 flex items-center justify-center p-5">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">
              {`Add ${addressTypes[addressType]} Address`}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenModal(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Modal Content */}
          <div className="p-4 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Address Label */}
            {/* NOTE: Input title animation from placeholder -> go up */}
            <Input
              id="label"
              value={isHomeOrWork ? addressType : ""}
              onChange={(e) => handleInputChange("label", e.target.value)}
              className={cn("py-6 rounded-2xl", isHomeOrWork ? "hidden" : "")}
              placeholder={"Add address name"}
            />

            <div className="">
              <h3 className="text-base font-bold mb-3">Choose Address</h3>

              {/* Address Dropdown */}
              <div className="relative mb-4">
                <button className="w-full flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-full bg-secondary hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-gray-500 flex-1 text-left">
                    Enter address
                  </span>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="relative h-34 bg-gray-100 rounded-lg mb-2 border-secondary border-1 overflow-hidden">
                {/* Map Container */}
                <MapViewOnlyInner center={DEFAULT_LAT_LNG} showPin={true} />

                {/* Selected Location Overlay */}
                <div className="absolute z-50 bottom-0 left-0 right-0 bg-white shadow-lg border-gray-200">
                  <div className="flex items-center gap-3 p-2">
                    <MapPin className="text-gray-500 h-6 w-6" />
                    <div>
                      <h4 className="font-semibold"> {"Keystone Building"} </h4>
                      <p className="text-sm text-gray-500"> {"Phnom Penh"} </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Use Current Location */}
              <button className="flex items-center gap-3 p-3 w-full hover:bg-primary/10 rounded-lg transition-colors group">
                <CurrentLocationIcon className="h-5 w-5 text-primary" />
                <span className="text-primary font-semibold">
                  Use Current Location
                </span>
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-5">
            <Button
              onClick={handleSaveAddress}
              className=" rounded-full bg-primary hover:bg"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
