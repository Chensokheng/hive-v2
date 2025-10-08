"use client";

import React, { useRef, useState } from "react";
import { seachAddressKeyword } from "@/services/address/search-address-keyword";
import { useSavedAddressStore } from "@/store/saved-address";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Loader, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import useGetAddressByKeyword from "@/hooks/use-get-address-by-keyword";

import MapIcon from "../../icon/map";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export default function SavedAddressSearch({
  className,
}: {
  className?: string;
}) {
  const [isLoading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Get form state from store
  const addressFormData = useSavedAddressStore(
    (state) => state.addressFormData
  );
  const updateAddressFormField = useSavedAddressStore(
    (state) => state.updateAddressFormField
  );

  const { data, isFetching } = useGetAddressByKeyword(search);
  const [animationParent] = useAutoAnimate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((value: string) => {
    const searchParam = "?keyword=" + value;
    setSearch(searchParam);
  }, 500);

  const handleSelectAddress = async (value: {
    id: string;
    address: string;
  }) => {
    setLoading(true);

    try {
      // Get full address details from the API
      const searchParam = "?keyword=" + value.address + "&placeId=" + value.id;
      const res = await seachAddressKeyword(searchParam);

      if (res.data.length) {
        const selectedAddress = res.data[0];

        // Update the form store with the selected location
        updateAddressFormField("location", {
          id: selectedAddress.id,
          address: selectedAddress.address,
          lat: selectedAddress.lat ?? 11.550966450309836,
          lng: selectedAddress.lng ?? 104.9287729533798,
        });

        // Clear search and update input display
        setSearch("");
        if (inputRef.current) {
          inputRef.current.value = selectedAddress.address;
        }
      }
    } catch (error) {
      console.error("Error selecting address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setSearch("");
    updateAddressFormField("location", undefined);
    inputRef.current?.focus();
  };

  return (
    <div className={className}>
      <Label className="font-bold text-base">Choose Address</Label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <MapIcon fill="#0055DD" />
        </div>

        <Input
          defaultValue={addressFormData.location?.address || ""}
          ref={inputRef}
          className="rounded-full bg-[#EBEFF7] h-10 border-none pl-10 w-full pr-10"
          tabIndex={-1}
          placeholder="Enter delivery address"
          onChange={(e) => handleSearch(e.target.value)}
        />

        {(isFetching || isLoading) && (
          <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
            <Loader className="animate-spin w-4 h-4" />
          </div>
        )}

        {addressFormData.location && !isLoading && !isFetching && (
          <button
            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer z-50"
            onClick={handleClearInput}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div
          className={cn(
            "absolute mt-2 -bottom-auto right-0 h-auto w-full rounded-xl bg-white transition-all duration-300 divide-y z-10",
            {
              "border shadow-lg": data?.data.length,
            }
          )}
          ref={animationParent}
        >
          {data?.data.map((value, index) => {
            return (
              <button
                key={value.id}
                type="button"
                className={cn(
                  "p-5 border-gray-200 cursor-pointer hover:bg-primary/10 transition-all text-left w-full",
                  {
                    "rounded-b-lg": index === data?.data.length - 1,
                    "rounded-t-lg": index === 0,
                    "opacity-50": isFetching || isLoading,
                    "animate-pulse": isLoading,
                  }
                )}
                onClick={() => handleSelectAddress(value)}
                disabled={isLoading || isFetching}
              >
                <h1 className="text-sm lg:text-base">{value.address}</h1>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
