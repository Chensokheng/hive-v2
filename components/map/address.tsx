"use client";

import React from "react";
import { useAddresStore } from "@/store/address";
import { ChevronLeft } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import SearchAddress from "./search-address";

export default function Address() {
  const openAddresSheet = useAddresStore((state) => state.openAddresSheet);
  const setOpenAddresSheet = useAddresStore(
    (state) => state.setOpenAddressSheet
  );

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
          {/* header */}
          <SearchAddress />
        </div>
      </SheetContent>
    </Sheet>
  );
}
