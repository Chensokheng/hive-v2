import React, { useEffect, useMemo, useState, useTransition } from "react";
import { addItemtoCart } from "@/services/add-item-to-cart";
import { useOutletStore } from "@/store/outlet";
import { OutletUnpaidItemsDto } from "@/types-v2/dto";
import { useQueryClient } from "@tanstack/react-query";
import { AsyncImage } from "loadable-image";
import { Minus, Plus, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import { Blur } from "transitions-kit";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetHappyHourAvailableTimes from "@/hooks/use-get-happy-hour-available-times";
import useGetHappyHours from "@/hooks/use-get-happy-hours";
import useGetUserInfo from "@/hooks/use-get-user-info";

import OrderAddonDetail from "./order-addon-detail";

export default function OrderItem({
  item,
}: {
  item: OutletUnpaidItemsDto["items"][0];
}) {
  const isFree = item.cartDiscountedProduct || item?.promotionCartItem;
  const [isPending, startTransition] = useTransition();
  const [isUserAction, setIsUserAction] = useState(false);

  const [quantity, setQuantity] = useState(item.quantity);

  const { data: user } = useGetUserInfo();
  const setEditCartItemData = useOutletStore(
    (state) => state.setEditCartItemData
  );

  const { data: happyHourAvailableTimes, isLoading } =
    useGetHappyHourAvailableTimes(Number(item.outletId));

  const {
    data: happyHour,
    isLoading: isHappyHourLoading,
    isRefetching,
  } = useGetHappyHours(
    Number(item.outletId),
    happyHourAvailableTimes?.data[0].id!
  );

  const queryClient = useQueryClient();
  const { data: rate } = useGetExchangeRate();

  const handleItemToCart = async (qty: number) => {
    let happyHourAvailableTimeId = null;
    let addNew = false;
    let cartItemId = null;

    if (isDisableHappyHour) {
      happyHourAvailableTimeId = happyHourAvailableTimes?.data[0]?.id || null;
      addNew = true;
      qty = qty - item.quantity;
    } else {
      cartItemId = item.id;
    }

    setIsUserAction(true);
    startTransition(async () => {
      const res = await addItemtoCart({
        cartItemId,
        token: user?.token!,
        menuItemId: item.menuItemId,
        outletId: item.outletId,
        qty,
        addNew,
        userId: Number(user?.userId!),
        note: item.note,
        addonDetails: item.cartAddonItems,
        isCustomDiscounted: item.cartCustomDiscountedProduct ? true : false,
        happyHourAvailableTimeId: happyHourAvailableTimeId,
      });

      if (isDisableHappyHour) {
        setIsUserAction(false);
        setQuantity((prev) => prev - 1);
      }

      if (!res.status) {
        toast.error(res.message || "Fail to remove item from the cart");
        if (qty !== 0) {
          setIsUserAction(false);
          setQuantity((prev) => prev - 1);
        }
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["outlet-unpaid-item", user?.userId!, item.outletId],
      });
      setIsUserAction(false);
    });
  };

  const handleUpdateCartItem = useDebouncedCallback(() => {
    handleItemToCart(quantity);
  }, 500);

  const handleEditItem = () => {
    if (item.isHappyHourProduct) {
      return;
    }
    setEditCartItemData({
      cartItemId: item.id,
      outletId: item.outletId,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      note: item.note || "",
      selectedAddons: item.cartAddonItems || [],
      isCustomDiscounted: item.cartCustomDiscountedProduct ? true : false,
      isHappyHourProduct: item.isHappyHourProduct,
    });
  };

  useEffect(() => {
    if (!isUserAction) {
      return;
    }
    handleUpdateCartItem();
  }, [quantity]);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const happyHourItem = happyHour?.data.find(
    (value) =>
      value.id === item.menuItemId &&
      value.happyHoursPrice === item.basePrice &&
      item.isHappyHourProduct
  );

  const isDisableHappyHour = useMemo(() => {
    return happyHourItem && item.isHappyHourProduct
      ? happyHourItem?.totalQty === happyHourItem?.usedQty ||
          quantity >= happyHourItem?.maxQtyPerOrder!
      : false;
  }, [happyHourItem, item.isHappyHourProduct, quantity]);

  return (
    <>
      {/* {JSON.stringify(happyHourItem, null, 2)} */}
      <div
        className={cn("pb-4 border-b border-[#D8DEEE]", {
          "animate-pulse opacity-50": isPending,
        })}
      >
        <div
          className="flex gap-3 items-start  cursor-pointer"
          onClick={handleEditItem}
        >
          <div className="flex items-center gap-4 ">
            {!isFree && (
              <div className="h-5 w-5 bg-[#FF5757] hidden place-content-center text-white rounded-full  lg:grid cursor-pointer">
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
              onClick={handleEditItem}
            />
          </div>
          <div className="flex-1" onClick={handleEditItem}>
            <h1 className="font-semibold text-[#161F2F] ">{item.name}</h1>
            {isFree && (
              <p className="text-sm text-[#303D55]/60">{item.quantity} Free</p>
            )}
            {item.isHappyHourProduct && (
              <>
                <p className="text-sm text-primary font-medium">
                  Happy hour product 🤣
                </p>
              </>
            )}

            {item.cartCustomDiscountedProduct && (
              <>
                <p className="text-sm text-primary font-medium">
                  Flash Sale ⚡️
                </p>
              </>
            )}
            <OrderAddonDetail text={item.formatedAddonItems} />
          </div>
          {!isFree && (
            <div>
              <h1 className="font-bold text-[#161F2F] text-right">
                ${(item.promotionPrice * item.quantity).toFixed(2)}
              </h1>
              <p className="text-sm text-[#303D55]/60">
                ≈ ៛
                {(item.promotionPrice * item.quantity * (rate || 0)).toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {!isFree && (
          <div className="w-full flex justify-between items-end pl-[68px] lg:pl-[108px]">
            <div className="flex flex-col items-start gap-2 cursor-pointer">
              {item.note && (
                <button
                  className="text-primary font-semibold text-sm cursor-pointer"
                  onClick={handleEditItem}
                >
                  Edit
                </button>
              )}

              {item.note && (
                <span className="border-l-4 pl-2.5 py-1 border-[#FF66CC] text-[#161F2F] text-sm">
                  Note: {item.note}
                </span>
              )}
            </div>
            <div className="flex gap-2 items-center justify-end">
              {quantity === 1 ? (
                <button
                  className={cn(
                    "h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer"
                  )}
                  onClick={() => handleItemToCart(0)}
                >
                  <Trash className="w-5 h-5" />
                </button>
              ) : (
                <button
                  className="h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer"
                  disabled={quantity === 0}
                  onClick={() => {
                    setIsUserAction(true);
                    setQuantity(quantity - 1);
                  }}
                >
                  <Minus className="w-5 h-5" />
                </button>
              )}
              <span className="font-bold text-[#161F2F] w-5 text-center">
                {quantity}
              </span>
              <button
                className="h-7 w-7 bg-[#0055DD1A] text-primary rounded-full grid place-content-center cursor-pointer disabled:opacity-50"
                onClick={() => {
                  setIsUserAction(true);
                  setQuantity(quantity + 1);
                }}
                disabled={quantity === 0}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
