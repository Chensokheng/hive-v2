"use client";

import React, { useEffect } from "react";
import { useGlobalState } from "@/store";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import CheckoutHeader from "./checkout-header";
import DeliveryAddress from "./delivery-info";

export default function CheckoutSheet() {
  const cartItems = [
    {
      id: 1,
      name: "Grilled Seafood Platter",
      restaurant: "Ocean Delights",
      price: 28.5,
      quantity: 1,
      image: "/seafood-platter.png",
    },
    {
      id: 2,
      name: "Traditional Khmer Curry",
      restaurant: "Angkor Kitchen",
      price: 15.75,
      quantity: 1,
      image: "/khmer-curry.png",
    },
  ];

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const checkoutSheetOpen = useGlobalState((state) => state.checkoutSheetOpen);
  const setCheckoutSheetOpen = useGlobalState(
    (state) => state.setCheckoutSheetOpen
  );

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const checkoutParam = urlSearchParams.get("checkout");
    if (checkoutParam === "true") {
      setCheckoutSheetOpen(true);
    }
  }, [setCheckoutSheetOpen]);

  return (
    <Sheet
      open={checkoutSheetOpen}
      onOpenChange={(open) => {
        setCheckoutSheetOpen(open);
      }}
    >
      <SheetContent
        className="w-full sm:max-w-[900px] gap-[1]"
        showCloseBtn={false}
      >
        <SheetHeader className="hidden">
          <SheetTitle className="hidden" aria-readonly>
            Checkout
          </SheetTitle>
          <SheetDescription className="hidden" aria-readonly>
            This is checkout
          </SheetDescription>
        </SheetHeader>
        <div className=" bg-white px-5 relative pt-15">
          <CheckoutHeader />
        </div>
        <div className="bg-white p-3">
          <DeliveryAddress />
        </div>
      </SheetContent>
    </Sheet>
  );
}
