"use client";

import React, { useEffect, useTransition } from "react";
import { updateCartFee } from "@/services/outlet/update-cart-fee";
import placeOrder from "@/services/place-order";
import { useGlobalState } from "@/store";
import { OutletUnpaidItemsDto } from "@/types-v2/dto";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetUserInfo from "@/hooks/use-get-user-info";
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

export default function CheckoutSheet({
  unpaidItem,
  isFetching,
}: {
  unpaidItem: OutletUnpaidItemsDto;
  isFetching: boolean;
}) {
  const checkoutSheetOpen = useGlobalState((state) => state.checkoutSheetOpen);
  const setCheckoutSheetOpen = useGlobalState(
    (state) => state.setCheckoutSheetOpen
  );
  const [isPending, startTransition] = useTransition();
  const { data: user } = useGetUserInfo();
  const { data: rate } = useGetExchangeRate();
  const isOrderChangeItem = useGlobalState((state) => state.isOrderChangeItem);

  const makeOrder = () => {
    startTransition(async () => {
      try {
        const res = await placeOrder({
          cartId: unpaidItem.cartId,
          receiverPhone: unpaidItem.userInfo.phone,
          userId: unpaidItem.userInfo.userId,
          receiverName: unpaidItem.userInfo.name,
        });

        // Check if payment response exists
        if (res.data) {
          const deepLink = res.data.data.deeplink;
          const webView = res.data.data.webview;
          const timeout = 2000; // 2 seconds timeout
          const clickedAt = Date.now();

          // Try to redirect to the app first
          if (deepLink) {
            window.location.href = deepLink;

            // Fallback to webview if app doesn't open
            setTimeout(() => {
              // If the time passed is too short, the user probably switched to the app
              if (Date.now() - clickedAt < timeout + 100) {
                if (webView) {
                  window.open(webView, "_blank");
                }
              }
            }, timeout);
          } else if (webView) {
            // If no deep link, open webview directly
            window.open(webView, "_blank");
          }
        }
      } catch (error) {
        console.error("Failed to place order:", error);
        // Handle error appropriately (show toast, etc.)
      }
    });
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const checkoutParam = urlSearchParams.get("checkout");
    if (checkoutParam === "true") {
      setCheckoutSheetOpen(true);
    }
  }, [setCheckoutSheetOpen]);

  useEffect(() => {
    if (unpaidItem?.totalQuantity === 0) {
      setCheckoutSheetOpen(false);
    }
  }, [unpaidItem?.totalQuantity]);

  // update fee
  useEffect(() => {
    if (unpaidItem?.cartId) {
      updateCartFee({
        cartId: unpaidItem.cartId,
        userId: unpaidItem.userInfo.userId,
        token: user?.token!,
      });
    }
  }, []);

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
          <OrderItems unpaidItem={unpaidItem} isFetching={isFetching} />
          <PaymentMethod />
          <div className="flex-1"></div>

          <div className="sticky flex-col bottom-0 gap-4 w-auto py-4 flex items-center justify-center bg-white px-4">
            <div className="w-full flex items-center justify-between">
              <h1 className="text-primary text-[1.375rem] font-bold">
                Total:{" "}
              </h1>
              <div className="flex flex-col justify-end">
                <h1 className=" font-bold text-right bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent text-[1.375rem]">
                  ${unpaidItem?.finalTotal}
                </h1>
                <p className=" text-[#161F2F]">
                  {" "}
                  ≈{unpaidItem?.finalTotal * (rate || 0)}៛
                </p>
              </div>
            </div>
            <button
              className={cn(
                "font-bold text-lg rounded-full bg-gradient-to-r from-[#0055DD] to-[#FF66CC] py-3 w-full text-white",
                {
                  " animate-pulse": isOrderChangeItem || isPending,
                }
              )}
              disabled={isFetching || isOrderChangeItem || isPending}
              onClick={makeOrder}
            >
              {isFetching ? (
                <Loader2 className=" animate-spin mx-auto h-7" />
              ) : (
                "PLACE ORDER"
              )}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
