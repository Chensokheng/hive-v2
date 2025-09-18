import React, { useTransition } from "react";
import { addItemtoCart } from "@/services/add-item-to-cart";
import { OutletUnpaidItemsDto } from "@/types-v2/dto";
import { useQueryClient } from "@tanstack/react-query";
import { AsyncImage } from "loadable-image";
import { Minus, Plus, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import { Blur } from "transitions-kit";

import { cn } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";

import OrderAddonDetail from "./order-addon-detail";

export default function OrderItem({
  item,
}: {
  item: OutletUnpaidItemsDto["items"][0];
}) {
  const isFree = item.cartDiscountedProduct || item?.promotionCartItem;
  const [isPending, startTransition] = useTransition();

  const { data: user } = useGetUserInfo();

  const queryClient = useQueryClient();

  const handleRemoveItem = async () => {
    startTransition(async () => {
      const res = await addItemtoCart({
        cartItemId: item.id,
        token: user?.token!,
        menuItemId: item.menuItemId,
        outletId: item.outletId,
        qty: 0,
        addNew: false,
        userId: Number(user?.userId!),
      });
      if (!res.status) {
        toast.error("Fail to remove item from the cart");
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["outlet-unpaid-item", user?.userId!, item.outletId],
      });
    });
  };

  return (
    <div
      className={cn("pb-4 border-b border-[#D8DEEE]", {
        "animate-pulse opacity-50": isPending,
      })}
    >
      <div className="flex gap-3 items-start">
        <div className="flex items-center gap-4">
          {!isFree && (
            <div
              className="h-5 w-5 bg-[#FF5757] hidden place-content-center text-white rounded-full  lg:grid cursor-pointer"
              onClick={handleRemoveItem}
            >
              <X className="w-4 h-4 mx-auto" />
            </div>
          )}

          <AsyncImage
            src={item.image}
            Transition={Blur}
            style={{
              width: "56px",
              height: "56px",
            }}
            className="object-center object-cover rounded-md"
            loader={<div className="bg-gray-300" />}
            alt={item.name}
          />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-[#161F2F] ">{item.name}</h1>
          {isFree && (
            <p className="text-sm text-[#303D55]/60">{item.quantity} Free</p>
          )}
          <OrderAddonDetail text={item.formatedAddonItems} />
        </div>
        {!isFree && (
          <div>
            <h1 className="font-bold text-[#161F2F] text-right">
              ${Math.round(item.promotionPrice * item.quantity)}
            </h1>
            <p className="text-sm text-[#303D55]/60">
              ≈ ៛{Math.round(item.promotionPrice * item.quantity * 4000)}
            </p>
          </div>
        )}
      </div>
      {!isFree && (
        <div className="w-full flex justify-between items-end pl-[68px]">
          <div className="flex flex-col items-start gap-2">
            {item.note && (
              <button className="text-primary font-semibold text-sm">
                Edit
              </button>
            )}

            {item.note && (
              <span className="border-l-4 pl-2.5 py-1 border-[#FF66CC] text-[#161F2F] text-sm">
                Note: {item.note} asdfasdfasfds
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center justify-end">
            {item.quantity === 1 ? (
              <button
                className="h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer"
                onClick={handleRemoveItem}
              >
                <Trash className="w-5 h-5" />
              </button>
            ) : (
              <button className="h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer">
                <Minus className="w-5 h-5" />
              </button>
            )}
            <span className="font-bold text-[#161F2F]">{item.quantity}</span>
            <button className="h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
