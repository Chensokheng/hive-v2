"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronLeft,
  Home,
  Loader2,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import CurrentLocationIcon from "@/components/icon/current-location";
import MapPin from "@/components/icon/map-pin";

import { AddressModal, type TAddressType } from "./AddressModal";

interface AddressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export function AddressDrawer({ isOpen, onClose }: AddressDrawerProps) {
  const [selectedAddress, setSelectedAddress] = useState("Keystone Building");
  const [addressType, setAddressType] = useState<TAddressType>("other");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const showAddressPopup = (type: TAddressType) => {
    setAddressType(type);
    setShowAddressModal(true);
  };

  return (
    <>
      {/* NOTE: Use ShadCN drawer */}
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out",
          "lg:max-w-lg lg:shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <button onClick={onClose} className="h-9 w-9">
            <ChevronLeft className="h-7 w-7 text-primary" />
          </button>
          <h2 className="text-lg font-bold">Address Details</h2>
          <div className="w-8" /> {/* Spacer */}
        </div>
        {/* <MapViewOnlyInner center={DEFAULT_LAT_LNG} showPin={true} /> */}

        <div className="flex-1 overflow-y-auto">
          {/* Choose Address Section */}
          <div className="p-4">
            <h3 className="text-base font-bold mb-3">Choose Address</h3>

            {/* Address Dropdown */}
            <div className="relative mb-4">
              <button className="w-full flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-full bg-secondary hover:bg-gray-50 transition-colors">
                <MapPin className="h-5 w-5 text-primary" />
                {/* <MapPin className="h-5 w-5 text-primary" /> */}
                <span className="text-gray-500 flex-1 text-left">
                  Enter delivery address
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

          {/* Saved Address Section */}
          <div className="px-4 pb-6">
            <h3 className="text-base font-semibold mb-4">Saved Address</h3>

            <div className="space-y-3">
              {/* Add Home Address */}
              <button
                onClick={() => showAddressPopup("home")}
                className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-primary" strokeWidth={2.5} />
                  <span className="text-primary font-medium">
                    Add Home Address
                  </span>
                </div>
                <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </button>
              <Separator className="mb-0" />

              {/* Add Work Address */}
              <button
                onClick={() => showAddressPopup("work")}
                className="flex items-center justify-between w-full mb-0 p-4 hover:bg-primary/10 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <BriefcaseBusiness
                    className="h-4 w-4 text-primary"
                    strokeWidth={2.5}
                  />
                  <span className="text-primary font-medium">
                    Add Work Address
                  </span>
                </div>
                <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
              </button>
              <Separator className="mb-0" />

              {/* Add Other Address */}
              <button
                onClick={() => showAddressPopup("other")}
                className="flex items-center gap-3 w-full mb-0 p-4 hover:bg-primary/10 transition-colors text-left"
              >
                <Plus className="h-5 w-5 text-primary" strokeWidth={2.5} />
                <span className="text-primary font-semibold">
                  Add Other Address
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <AddressModal
          addressType={addressType}
          setOpenModal={setShowAddressModal}
        />
      )}
    </>
  );
}
