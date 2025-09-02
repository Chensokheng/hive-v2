import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { addItemtoCart } from "@/services/add-item-to-cart";
import { useGlobalState } from "@/store";
import { OutletUnpaidItemsDto } from "@/types-v2/dto";
import autoAnimate from "@formkit/auto-animate";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Input } from "@/components/ui/input";

import EditMenuCartItem from "../merchant/edit-menu-cart-item";

export default function OrderItems({
  unpaidItem,
  isFetching,
}: {
  unpaidItem: OutletUnpaidItemsDto;
  isFetching: boolean;
}) {
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div className="px-4  bg-white border-t-4 border-primary-bg">
      <div className="divide-y" ref={parent}>
        {unpaidItem?.items.map((item) => {
          return (
            <OrderItem key={item.id} item={item} isFetching={isFetching} />
          );
        })}
      </div>

      {/* Edit Menu Cart Item Component */}
      <EditMenuCartItem />
      {/* summary */}
      <div className="py-6 space-y-4 border-t">
        <h2 className="font-bold text-[#161F2F]">Summary</h2>

        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-[#303D55]/60">
              Subtotal:{" "}
              <span className="font-semibold text-[#161F2F]">
                {unpaidItem.totalQuantity} items
              </span>
            </span>
            <span className="font-semibold text-[#161F2F]">
              ${unpaidItem.subtotal}
            </span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between items-center">
            <span className="text-[#303D55]/60">
              Delivery Fee:{" "}
              <span className="font-semibold text-[#161F2F]">
                {unpaidItem.distance || 0} km
              </span>
            </span>
            <span className="font-semibold text-[#161F2F]">
              ${unpaidItem.shippingFee}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#303D55]/60">Vat:</span>
            <span className="font-semibold text-[#161F2F]">
              ${unpaidItem.totalVat}
            </span>
          </div>

          {/* Promotion */}
          {/* <div className="flex justify-between items-center">
            <span className="text-[#303D55]/60">Promotion:</span>
            <span className="font-semibold text-[#161F2F]">$6</span>
          </div> */}
        </div>

        {/* Note textarea */}
        <div className="mt-6">
          <Input
            className="rounded-2xl h-14"
            placeholder="Any note for this store?"
            autoFocus={false}
            tabIndex={-1}
          />
        </div>
      </div>
    </div>
  );
}

const OrderItem = ({
  item,
  isFetching,
}: {
  item: OutletUnpaidItemsDto["items"][number];
  isFetching: boolean;
}) => {
  const { data: rate } = useGetExchangeRate();
  const { data: user } = useGetUserInfo();

  const [isPending, startTranstition] = useTransition();
  const [isUserAction, setIsUserAction] = useState(false);

  const [quantity, setQuantity] = useState(item.quantity);

  const queryClient = useQueryClient();

  const setisOrderChangeItem = useGlobalState(
    (state) => state.setisOrderChangeItem
  );

  const setEditCartItemData = useGlobalState(
    (state) => state.setEditCartItemData
  );

  const handleEditItem = () => {
    // Set the edit cart item data to open the edit sheet
    setEditCartItemData({
      cartItemId: item.id,
      outletId: item.outletId,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      note: item.note || "",
      selectedAddons: item.cartAddonItems || [],
    });
  };

  const handleAddtoCart = useDebouncedCallback(() => {
    startTranstition(async () => {
      const res = await addItemtoCart({
        userId: Number(user?.userId),
        outletId: item.outletId,
        qty: quantity,
        menuItemId: item.menuItemId,
        addNew: false,
        type: "delivery",
        addonDetails: item.cartAddonItems,
        token: user?.token,
      });

      if (!res.status) {
        setQuantity(item.quantity);
        toast.error(res.message);
        return;
      }
      setIsUserAction(false);

      queryClient.setQueryData(
        ["outlet-unpaid-item", user?.userId, item.outletId],
        (oldData: OutletUnpaidItemsDto) => {
          return {
            ...(oldData as OutletUnpaidItemsDto),
            totalQuantity: res.totalQuantity,
            subtotal: res.subtotal,
            finalTotal: res.finalTotal,
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["outlet-unpaid-item", user?.userId, item.outletId],
      });
      setisOrderChangeItem(false);
    });
  }, 500);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  useEffect(() => {
    if (!isUserAction) {
      return;
    }
    setisOrderChangeItem(true);
    handleAddtoCart();
  }, [quantity, isUserAction]);

  return (
    <div
      className={cn("w-full flex items-center gap-4 pt-4 pb-4", {
        " animate-pulse": isFetching,
      })}
    >
      <div
        className="relative aspect-square w-14 cursor-pointer "
        onClick={handleEditItem}
      >
        <Image
          src={item?.image || "/fake/menu-popup.png"}
          alt="Example"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className=" flex items-start sm:items-center justify-between flex-1 flex-col sm:flex-row gap-2">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-semibold text-[#161F2F]">{item?.name}</h1>
              <p className="text-sm text-[#303D55]/60">
                {item?.formatedAddonItems}
              </p>
              <p className="text-sm text-[#303D55]/60">{item?.note}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {quantity !== 0 && (
            <button
              className={cn(
                "rounded-full bg-primary/10 h-7 w-7 grid place-content-center cursor-pointer text-primary disabled:text-primary/50 ",
                {
                  "animate-pulse": isPending,
                }
              )}
              disabled={item.cartDiscountedProduct ? true : false}
              onClick={() => {
                if (isPending) {
                  return;
                }

                setQuantity(quantity - 1);
                setIsUserAction(true);
              }}
            >
              <Minus className="h-5 w-5" />
            </button>
          )}
          <span className="text-[#161F2F] font-bold">{quantity}</span>
          <button
            className={cn(
              "rounded-full bg-primary/10 h-7 w-7 grid place-content-center cursor-pointe text-primary disabled:text-primary/50 cursor-pointer",
              {
                "animate-pulse": isPending,
              }
            )}
            onClick={() => {
              if (isPending) {
                return;
              }

              setQuantity(quantity + 1);
              setIsUserAction(true);
            }}
            disabled={item.cartDiscountedProduct ? true : false}
          >
            <Plus className=" h-5 w-5" />
          </button>
        </div>
      </div>
      <div>
        <h1 className=" font-semibold text-[#161F2F] text-right flex items-center justify-center">
          ${" "}
          {item.cartDiscountedProduct
            ? item.cartDiscountedProduct.sellingPrice === 0
              ? "Free"
              : item.cartDiscountedProduct.sellingPrice
            : (item?.basePrice * quantity).toFixed(2)}
        </h1>
        <p className="text-sm text-[#303D55]/60">
          {" "}
          ≈
          {item.cartDiscountedProduct
            ? item.cartDiscountedProduct.sellingPrice === 0
              ? "Free"
              : item.cartDiscountedProduct.sellingPrice
            : (item?.basePrice * (rate || 0) * quantity).toFixed(2)}
          ៛
        </p>
      </div>
    </div>
  );
};
