import React from "react";
import { useParams } from "next/navigation";
import { useOutletStore } from "@/store/outlet";
import { ChevronLeft, Pen } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import { Button } from "@/components/ui/button";

import PickUpTime from "./pick-up-time";

export default function CheckoutHeader() {
  const t = useTranslations("checkout");
  const { merchant, outlet } = useParams() as {
    merchant: string;
    outlet: string;
  };
  const setOpenCheckoutSheet = useOutletStore(
    (state) => state.setOpenCheckoutSheet
  );
  const isDelivery = useOutletStore((state) => state.isDelivery);
  const setIsDelivery = useOutletStore((state) => state.setIsDelivery);
  const pickupTime = useOutletStore((state) => state.pickupTime);

  // Use localStorage as fallback when merchant or outlet params are not available
  const merchantName =
    merchant ||
    (typeof window !== "undefined"
      ? localStorage.getItem("lastSelectedMerchant")
      : null);
  const outletName =
    outlet ||
    (typeof window !== "undefined"
      ? localStorage.getItem("lastSelectedOutletName")
      : null);

  const { data } = useGetOutletInfo(merchantName || "", outletName || "", 0, 0);

  const formatPickupTime = (timestamp: number | null) => {
    if (!timestamp) return t("asap");

    const date = new Date(timestamp);
    const now = new Date();

    // Check if it's today
    const isToday = date.toDateString() === now.toDateString();

    // Check if it's ASAP (within 1 minute of now)
    const timeDiff = Math.abs(date.getTime() - now.getTime());
    if (timeDiff < 60000) {
      return "As soon as possible";
    }

    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) {
      return `${t("today")} ${timeString}`;
    }

    const dateString = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return `${dateString} at ${timeString}`;
  };

  return (
    <>
      <div className="bg-white px-4 pt-15 sticky top-0 left-0 w-full z-50">
        <div
          className="flex items-center py-3 border-primary-bg absolute top-0 left-0 w-full bg-white"
          onClick={() => setOpenCheckoutSheet(false)}
        >
          <ChevronLeft className="text-primary w-8 h-8 cursor-pointer" />
          <h1 className="flex-1 text-center text-lg font-bold">{t("title")}</h1>
        </div>
      </div>

      <div className="flex px-4">
        <div className="flex p-1 bg-[#EBEFF7] rounded-full">
          {data?.data?.joined_delivery && (
            <button
              className={cn(
                "py-2 px-4.5  rounded-full font-semibold cursor-pointer transition-all text-sm",
                {
                  "bg-white text-[#161F2F]": isDelivery,
                }
              )}
              onClick={() => setIsDelivery(true)}
            >
              {t("delivery")}
            </button>
          )}

          {data?.data?.isEnableSelfPickUp && (
            <div>
              <PickUpTime>
                <button
                  className={cn(
                    "py-2 px-4.5  rounded-full font-semibold cursor-pointer transition-all text-sm",
                    {
                      "bg-white text-[#161F2F]": !isDelivery,
                    }
                  )}
                  onClick={() => setIsDelivery(false)}
                >
                  {t("pickup")}
                </button>
              </PickUpTime>
            </div>
          )}
        </div>
      </div>
      {!isDelivery && (
        <div>
          <Button
            variant={"outline"}
            className="mt-3 text-sm text-white px-4 mx-4 rounded-full justify-start bg-primary cursor-pointer"
            onClick={() => {
              document.getElementById("pick-up-dialog")?.click();
            }}
          >
            <span className="font-">{t("pickupTime")} </span>
            <span>{formatPickupTime(pickupTime)}</span>
            <Pen />
          </Button>
        </div>
      )}
    </>
  );
}
