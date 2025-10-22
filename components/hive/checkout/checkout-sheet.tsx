import { useRef, useTransition } from "react";
import { miniAppCheckout } from "@/services/mini-app/mini-app-checkout";
import placeOrder from "@/services/place-order";
import { generateMmsToken } from "@/services/tm/generate-mms-token";
import { useGlobalState } from "@/store";
import { useAddresStore } from "@/store/address";
import { useCheckoutStore } from "@/store/checkout";
import { useOutletStore } from "@/store/outlet";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { JSBridge } from "@/lib/js-bridge";
import { generatePayload } from "@/lib/tm/generate-mini-app-payload";
import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import CheckOutFee from "./check-out-fee";
import CheckoutHeader from "./checkout-header";
import DeliveryInfo from "./delivery-info";
import OrderItems from "./order-items";
import PaymentMethod from "./payment-method";
import PromotionCode from "./promotion-code";

export default function CheckoutSheet({ outletId }: { outletId: number }) {
  const t = useTranslations("checkout");
  const [isPending, startTransition] = useTransition();
  const addressNoteRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const { data: user } = useGetUserInfo();
  const {
    data: unpaidItem,
    isFetching,
    isRefetching,
  } = useGetOutletUnpaidItem(Number(user?.userId!), outletId);
  const { data: rate } = useGetExchangeRate();
  const openCheckoutSheet = useOutletStore((state) => state.openCheckoutSheet);
  const setOpenCheckoutSheet = useOutletStore(
    (state) => state.setOpenCheckoutSheet
  );
  const isDelivery = useOutletStore((state) => state.isDelivery);
  const checkoutUserTemInfo = useOutletStore(
    (state) => state.checkoutUserTemInfo
  );
  const checkoutNotes = useOutletStore((state) => state.checkoutNotes);
  const setCheckoutNotes = useOutletStore((state) => state.setCheckoutNotes);

  const selectedPromotionCode = useCheckoutStore(
    (state) => state.selectedPromotionCode
  );

  const setSelectedPromotionCode = useCheckoutStore(
    (state) => state.setSelectedPromotionCode
  );
  const updateFeeError = useOutletStore((state) => state.updateFeeError);

  const pickupTime = useOutletStore((state) => state.pickupTime);

  const setOpenAddresSheet = useAddresStore(
    (state) => state.setOpenAddressSheet
  );

  const jsBridgeStatus = useGlobalState((state) => state.jsBridgeStatus);

  const handleMiniAppCheckout = async () => {
    const validatedPickupTime =
      pickupTime && new Date(pickupTime) < new Date() ? null : pickupTime;

    const res = await miniAppCheckout({
      token: user?.token || "",
      userId: Number(user?.userId!),
      cartId: unpaidItem?.cartId!,
      receiverName: checkoutUserTemInfo?.name || user?.userName || "",
      receiverPhone: checkoutUserTemInfo?.phoneNumber || user?.phone || "",
      note: checkoutNotes.storeNote || "",
      addressNote: checkoutNotes.addressNote || "",
      promotionCode: selectedPromotionCode.code,
      promotionId: selectedPromotionCode.id,
      isSelfPickup: !isDelivery,
      pickupTime: validatedPickupTime,
    });

    if (!res.status) {
      toast.error(res?.message || "Fail to checkout");
      return;
    }

    const { token, client_id, secret } = await generateMmsToken();
    const payload = await generatePayload(
      res.data.amount,
      "USD",
      res.data.externalRefId,
      secret
    );

    const params = {
      amount: res.data.amount,
      currency: "USD",
      miniAppClientId: client_id,
      miniAppAccessToken: token.access_token,
      merchantRef: res.data.externalRefId,
      remark: "powered by Hive Mini App",
      paymentRef: "Hive Payment mini app",
      payload,
    };
    JSBridge.call("checkout", JSON.stringify(params));
  };

  const handleCheckout = async () => {
    startTransition(async () => {
      if (jsBridgeStatus === "success") {
        await handleMiniAppCheckout();
        return;
      }

      const validatedPickupTime =
        pickupTime && new Date(pickupTime) < new Date() ? null : pickupTime;

      const res = await placeOrder({
        cartId: unpaidItem?.cartId!,
        userId: Number(user?.userId!),
        receiverName: checkoutUserTemInfo?.name || user?.userName || "",
        receiverPhone: checkoutUserTemInfo?.phoneNumber || user?.phone || "",
        note: checkoutNotes.storeNote || "",
        addressNote: checkoutNotes.addressNote || "",
        token: user?.token || "",
        promotionCode: selectedPromotionCode.code,
        promotionId: selectedPromotionCode.id,
        isSelfPickup: !isDelivery,
        pickupTime: validatedPickupTime,
      });
      setSelectedPromotionCode({ code: "", id: -1, discoundAmount: 0 });
      // Clear notes after successful order
      setCheckoutNotes({ addressNote: "", storeNote: "" });

      if (!res.status) {
        toast.error(res.data.error_message || t("toast.failToCheckout"));
        return;
      }
      const deeplink = res.data.data.deeplink;
      const webview = res.data.data.webview;

      if (deeplink) {
        // Try to open deeplink first
        window.location.href = deeplink;

        // Wait for a short period, then fallback to webview if deeplink doesn't open
        setTimeout(() => {
          window.open(webview, "_self");
        }, 1000); // Adjust delay if needed (2 seconds is common)
      } else {
        // If no deeplink at all, open webview immediately
        window.open(webview, "_blank");
      }

      setOpenCheckoutSheet(false);
    });
  };

  const renderFinalPrice = () => {
    let finalPrice =
      unpaidItem?.finalTotal! - selectedPromotionCode.discoundAmount;

    if (!isDelivery && unpaidItem?.shippingFee) {
      finalPrice -= unpaidItem?.shippingFee;
    }
    return finalPrice;
  };

  return (
    <Sheet
      open={openCheckoutSheet}
      onOpenChange={(value) => {
        setOpenCheckoutSheet(value);
      }}
    >
      <SheetContent className="w-full sm:max-w-[800px]" showCloseBtn={false}>
        <SheetHeader className="hidden">
          <SheetTitle className="hidden" aria-readonly>
            {t("title")}
          </SheetTitle>
          <SheetDescription className="hidden" aria-readonly>
            This is checkout
          </SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto relative hide-scroll flex flex-col ">
          <CheckoutHeader />
          {unpaidItem?.cartId && isDelivery && (
            <DeliveryInfo cartId={unpaidItem?.cartId} outletId={outletId} />
          )}
          {isDelivery && (
            <div className="px-4">
              <Input
                placeholder={t("noteToDriver")}
                className="h-15 rounded-2xl placeholder:text-[#303D5599] text-normal"
                tabIndex={-1}
                ref={addressNoteRef}
                value={checkoutNotes.addressNote}
                onChange={(e) =>
                  setCheckoutNotes({
                    ...checkoutNotes,
                    addressNote: e.target.value,
                  })
                }
              />
            </div>
          )}
          <div className=" border-t-8 mt-2 border-primary-bg  w-full px-5">
            <OrderItems outletId={outletId} />
          </div>
          <div className="px-4 py-4">
            <Input
              placeholder={t("noteToStore")}
              className="h-15 rounded-2xl placeholder:text-[#303D5599] text-normal"
              tabIndex={-1}
              ref={noteRef}
              value={checkoutNotes.storeNote}
              onChange={(e) =>
                setCheckoutNotes({
                  ...checkoutNotes,
                  storeNote: e.target.value,
                })
              }
            />
          </div>
          {unpaidItem?.cartId && <PromotionCode cartId={unpaidItem?.cartId} />}

          <CheckOutFee outletId={outletId} />
          <PaymentMethod />
        </div>

        <div className="sticky flex-col bottom-0 gap-4 w-auto py-4 flex items-center justify-center bg-white px-4">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-primary text-[1.375rem] font-bold">
              {t("total")}:{" "}
            </h1>
            <div className="flex flex-col justify-end">
              <h1 className=" font-bold text-right bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent text-[1.375rem]">
                ${renderFinalPrice().toFixed(2)}
              </h1>
              <p className=" text-[#161F2F]">
                {" "}
                ≈{(renderFinalPrice() * (rate || 0)).toFixed(0)}៛
              </p>
            </div>
          </div>
          {!updateFeeError && user?.latitude && user?.longtitude ? (
            <button
              className={cn(
                "font-bold text-lg rounded-full bg-gradient-to-r from-[#0055DD] to-[#FF66CC] py-3 w-full text-white flex items-center justify-center gap-2",
                {
                  "animate-pulse": isFetching || isPending,
                }
              )}
              disabled={isRefetching}
              onClick={handleCheckout}
            >
              {isPending && <Loader className=" animate-spin" />}
              {t("placeOrder")}
            </button>
          ) : (
            <>
              <p className="text-sm text-red-500">{updateFeeError}</p>
              <button
                className="bg-primary w-full text-white rounded-full py-3 font-medium"
                onClick={() => {
                  setOpenAddresSheet(true);
                }}
              >
                {t("changeAddress")}
              </button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
