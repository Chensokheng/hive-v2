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
import DeliveryInfo from "./delivery-info";
import OrderItems from "./order-items";
import PaymentMethod from "./payment-method";

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

  // const totalPrice = cartItems.reduce(
  //   (sum, item) => sum + item.price * item.quantity,
  //   0
  // );

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
      <SheetContent className="w-full sm:max-w-[900px]" showCloseBtn={false}>
        <SheetHeader className="hidden">
          <SheetTitle className="hidden" aria-readonly>
            Checkout
          </SheetTitle>
          <SheetDescription className="hidden" aria-readonly>
            This is checkout
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto relative hide-scroll flex flex-col min-h-[90vh]">
          <div className=" bg-white px-4 pt-15 sticky top-0 left-0 w-full z-50">
            <CheckoutHeader />
          </div>
          <div className="bg-white p-4">
            <DeliveryInfo />
          </div>
          <OrderItems />
          <PaymentMethod />
          <div className="flex-1"></div>

          <div className="sticky flex-col bottom-0 gap-4 w-auto py-4 flex items-center justify-center bg-white px-4">
            <div className="w-full flex items-center justify-between">
              <h1 className="text-primary text-[1.375rem] font-bold">
                Total:{" "}
              </h1>
              <div className="flex flex-col justify-end">
                <h1 className=" font-bold text-right bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent text-[1.375rem]">
                  $6
                </h1>
                <p className=" text-[#161F2F]"> ≈10000៛</p>
              </div>
            </div>
            <button className="font-bold text-lg rounded-full bg-gradient-to-r from-[#0055DD] to-[#FF66CC] py-3 w-full text-white">
              PLACE ORDER
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
