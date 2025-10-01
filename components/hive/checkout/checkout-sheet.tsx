import { useRef, useTransition } from "react";
import placeOrder from "@/services/place-order";
import { useCheckoutStore } from "@/store/checkout";
import { useOutletStore } from "@/store/outlet";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

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
  const [isPending, startTransition] = useTransition();
  const addressNoteRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);
  const { data: user } = useGetUserInfo();
  const {
    data: unpaidItem,
    isLoading,
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

  const selectedPromotionCode = useCheckoutStore(
    (state) => state.selectedPromotionCode
  );

  const setSelectedPromotionCode = useCheckoutStore(
    (state) => state.setSelectedPromotionCode
  );

  const handleCheckout = () => {
    startTransition(async () => {
      const res = await placeOrder({
        cartId: unpaidItem?.cartId!,
        userId: Number(user?.userId!),
        receiverName: checkoutUserTemInfo?.name || user?.userName || "",
        receiverPhone: checkoutUserTemInfo?.phoneNumber || user?.phone || "",
        note: noteRef.current?.value || "",
        addressNote: addressNoteRef.current?.value || "",
        token: user?.token || "",
        promotionCode: selectedPromotionCode.code,
        promotionId: selectedPromotionCode.id,
      });
      setSelectedPromotionCode({ code: "", id: -1, discoundAmount: 0 });

      if (!res.status) {
        toast.error(res.data.error_message || "Fail to checkout");
        return;
      }
      const deeplink = res.data.data.deeplink;
      const webview = res.data.data.webview;

      if (deeplink) {
        // Try to open deeplink first
        window.location.href = deeplink;

        // Wait for a short period, then fallback to webview if deeplink doesn't open
        setTimeout(() => {
          window.open(webview, "_blank");
        }, 1000); // Adjust delay if needed (2 seconds is common)
      } else {
        // If no deeplink at all, open webview immediately
        window.open(webview, "_blank");
      }

      setOpenCheckoutSheet(false);
    });
  };

  return (
    <Sheet open={openCheckoutSheet} onOpenChange={setOpenCheckoutSheet}>
      <SheetContent className="w-full sm:max-w-[800px]" showCloseBtn={false}>
        <SheetHeader className="hidden">
          <SheetTitle className="hidden" aria-readonly>
            Checkout
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
                placeholder="Note to driver"
                className="h-15 rounded-2xl placeholder:text-[#303D5599] text-normal"
                tabIndex={-1}
                ref={addressNoteRef}
              />
            </div>
          )}
          <div className=" border-t-8 mt-2 border-primary-bg  w-full px-5">
            <OrderItems outletId={outletId} />
          </div>
          <div className="px-4 py-4">
            <Input
              placeholder="Any note for this store?"
              className="h-15 rounded-2xl placeholder:text-[#303D5599] text-normal"
              tabIndex={-1}
              ref={noteRef}
            />
          </div>
          {unpaidItem?.cartId && <PromotionCode cartId={unpaidItem?.cartId} />}

          <CheckOutFee outletId={outletId} />
          <PaymentMethod />
        </div>

        <div className="sticky flex-col bottom-0 gap-4 w-auto py-4 flex items-center justify-center bg-white px-4">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-primary text-[1.375rem] font-bold">Total: </h1>
            <div className="flex flex-col justify-end">
              <h1 className=" font-bold text-right bg-gradient-to-r from-[#0055DD] to-[#FF66CC] bg-clip-text text-transparent text-[1.375rem]">
                $
                {unpaidItem?.finalTotal! - selectedPromotionCode.discoundAmount}
              </h1>
              <p className=" text-[#161F2F]">
                {" "}
                ≈{((unpaidItem?.finalTotal || 0) * (rate || 0)).toFixed(2)}៛
              </p>
            </div>
          </div>
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
            PLACE ORDER
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
