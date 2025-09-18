import React, { useEffect } from "react";
import { useOutletStore } from "@/store/outlet";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Plus } from "lucide-react";

import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Button } from "@/components/ui/button";

import OrderItem from "./order-item";

export default function OrderItems({ outletId }: { outletId: number }) {
  const setOpenCheckoutSheet = useOutletStore(
    (state) => state.setOpenCheckoutSheet
  );

  const { data: user } = useGetUserInfo();
  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    outletId
  );

  const [animateParent] = useAutoAnimate();

  useEffect(() => {
    if (unpaidItem?.items?.length === 0 || !unpaidItem?.items) {
      setOpenCheckoutSheet(false);
    }
  }, [unpaidItem?.items?.length]);

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[#161F2F] font-bold">Your order:</h1>
        <Button
          variant={"ghost"}
          className="font-medium text-primary cursor-pointer"
          onClick={() => setOpenCheckoutSheet(false)}
        >
          <span className="w-5 h-5 rounded-full bg-primary grid place-content-center text-white">
            <Plus />
          </span>
          Add More Items
        </Button>
      </div>
      <div>
        <div className="space-y-3" ref={animateParent}>
          {unpaidItem?.items?.map((item) => {
            return <OrderItem item={item} key={item.id} />;
          })}
        </div>
      </div>
    </div>
  );
}
