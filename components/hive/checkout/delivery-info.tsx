import React, { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import MapPin from "@/components/icon/map-pin";

import { AddressInfoDrawer } from "./address/address-info-drawer";

export default function DeliveryInfo() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h1 className="font-bold">Delivery to:</h1>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FF66CC]/10 grid place-content-center">
              <MapPin color="#FF66CC" />
            </div>
            <p className=" font-medium flex-1 text-left">
              Key stone Building, Norodom Blvd, Sangkat Tonle Bassac, Khan
              Chamkarmon, Phnom Penh
            </p>
          </div>

          <div className="">
            <ChevronRight />
          </div>
        </button>
      </div>
      {/* Receiver */}
      <div className="space-y-2">
        <h1 className="font-bold">Receiver Information</h1>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary grid place-content-center">
            {/* TODO:convert to ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#fff"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Ubol</span>
            <span className="text-gray-600">+855 10 111 222</span>
          </div>
        </div>
        <div className="mt-3">
          <Textarea
            placeholder="Note to driver"
            className="w-full p-3 border border-gray-200 rounded-lg resize-none text-gray-500"
            rows={3}
          />
        </div>
      </div>
      {/* should sheet addres go here */}
      <AddressInfoDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      {/* should sheet addres go here */}
    </div>
  );
}
