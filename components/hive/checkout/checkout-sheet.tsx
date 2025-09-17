import { useOutletStore } from "@/store/outlet";

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

import CheckoutHeader from "./checkout-header";
import DeliveryInfo from "./delivery-info";

export default function CheckoutSheet({ outletId }: { outletId: number }) {
  const { data: user } = useGetUserInfo();
  const {
    data: unpaidItem,
    isFetching,
    isLoading,
  } = useGetOutletUnpaidItem(Number(user?.userId!), outletId);

  const openCheckoutSheet = useOutletStore((state) => state.openCheckoutSheet);
  const setOpenCheckoutSheet = useOutletStore(
    (state) => state.setOpenCheckoutSheet
  );
  const isDelivery = useOutletStore((state) => state.isDelivery);

  return (
    <Sheet open={openCheckoutSheet} onOpenChange={setOpenCheckoutSheet}>
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
          {unpaidItem?.cartId && isDelivery && (
            <DeliveryInfo cartId={unpaidItem?.cartId} />
          )}
          {isDelivery && (
            <div className="px-4">
              <Input
                placeholder="Note to driver"
                className="h-15 rounded-xl placeholder:text-[#303D5599] text-normal"
                tabIndex={-1}
              />
            </div>
          )}
          <div className=" border-t-8 mt-2 border-primary-bg h-96 w-full">
            <h1>hllo</h1>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
