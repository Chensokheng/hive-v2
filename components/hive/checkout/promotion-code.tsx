import React, { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { applyPromoCode } from "@/services/apply-promo-code";
import { useCheckoutStore } from "@/store/checkout";
import { useOutletStore } from "@/store/outlet";
import { AsyncImage } from "loadable-image";
import { ChevronRight, Loader, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Blur } from "transitions-kit";

import { cn, getImageUrl } from "@/lib/utils";
import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import useGetPromotionCode from "@/hooks/use-get-promotion-code";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PromotionIcon from "@/components/icon/promotion";

export default function PromotionCode({ cartId }: { cartId: number }) {
  const t = useTranslations("checkout");
  const [open, setOpen] = useState(false);
  const { data: user } = useGetUserInfo();
  const { merchant, outlet } = useParams();
  const [isPending, startTransition] = useTransition();

  const selectedPromotionCode = useCheckoutStore(
    (state) => state.selectedPromotionCode
  );
  const setSelectedPromotionCode = useCheckoutStore(
    (state) => state.setSelectedPromotionCode
  );

  const { data: outletInfo } = useGetOutletInfo(
    merchant as string,
    outlet as string,
    null,
    null
  );

  const { data: promotionCodes } = useGetPromotionCode(
    outletInfo?.data.id as number,
    outletInfo?.data.merchant_id as number
  );

  const isMobile = useIsMobile();
  // eslint-disable-next-line unused-imports/no-unused-vars
  const isDelivery = useOutletStore((state) => state.isDelivery);
  const handleApplyCode = async (code: string, id: number) => {
    startTransition(async () => {
      const res = await applyPromoCode(
        code,
        cartId,
        false,
        user?.token as string
      );
      if (!res.status) {
        toast.error(res.message || t("toast.failToApplyPromo"), {
          position: isMobile ? "bottom-center" : "top-center",
        });
        return;
      } else {
        setSelectedPromotionCode({
          code,
          id,
          discoundAmount: res.data.discount_info.discount_value,
        });
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        className={cn(
          "bg-[#FF66CC]/10 py-5 px-4 rounded-2xl  gap-4 flex mx-4 mb-4 cursor-pointer ",
          {
            "ring ring-primary": selectedPromotionCode.code,
          }
        )}
        onClick={() => {
          if (!selectedPromotionCode.code) {
            setOpen(true);
          }
        }}
      >
        <div className="flex-1 flex items-center gap-2">
          <PromotionIcon />
          <h1 className="text-[#161F2F] font-bold">
            {selectedPromotionCode.code
              ? selectedPromotionCode.code
              : t("usePromotionCode")}
          </h1>
        </div>

        {selectedPromotionCode.code ? (
          <X
            className="w-6 h-6 text-[#FF66CC]"
            onClick={() => {
              if (selectedPromotionCode) {
                setSelectedPromotionCode({
                  code: "",
                  id: -1,
                  discoundAmount: 0,
                });
              }
            }}
          />
        ) : (
          <ChevronRight className="text-[#FF66CC]" />
        )}
      </button>

      <DialogContent className="max-w-[800px] px-5 h-full lg:h-auto rounded-none lg:rounded-2xl overflow-y-auto hide-scroll">
        <DialogHeader className="hidden">
          <DialogTitle>{t("promotionCode")}</DialogTitle>
          <DialogDescription>use promo code</DialogDescription>
        </DialogHeader>
        <div>
          <div className=" border-b flex items-center pb-6">
            {/* <ChevronLeft /> */}
            <h1 className=" font-bold text-2xl flex-1 text-left">
              {t("promotionCode")}
            </h1>
            <div
              className="h-8 w-8 bg-[#BDC5DB] text-white rounded-full grid place-content-center cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <X className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="space-y-3 mt-3">
              {promotionCodes?.data.map((item) => {
                return (
                  <div
                    className={cn(
                      "flex items-center flex-col lg:flex-row gap-4"
                    )}
                    key={item.id}
                  >
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <AsyncImage
                        src={getImageUrl(item.image_name)}
                        Transition={Blur}
                        style={{
                          width: "84px",
                          height: "84px",
                        }}
                        className="object-center object-cover rounded-md"
                        loader={<div className="bg-gray-300" />}
                        alt={item.name}
                      />
                      <div className="space-y-1 ">
                        <h1 className="font-semibold text-[#161F2F]">
                          {item.name}
                        </h1>
                        <p className="bg-gradient-to-r from-[#0055DD] to-[#FF66CC] text-sm font-medium px-2 py-1 text-white inline-block">
                          {item.code}
                        </p>
                        <p className="text-[#161F2F] text-xs font-semibold">
                          {t("expireOn")}{" "}
                          {item.valid_to
                            ? new Date(item.valid_to).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <button
                      className="text-primary text-sm font-semibold bg-[#0055DD1A] px-4 py-2 rounded-full cursor-pointer hover:scale-95 transition-all w-full lg:w-auto"
                      onClick={() => handleApplyCode(item.code, item.id)}
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        t("use")
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
