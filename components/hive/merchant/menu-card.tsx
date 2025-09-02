import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { addItemtoCart } from "@/services/add-item-to-cart";
import { useGlobalState } from "@/store";
import { OutletUnpaidItemsDto } from "@/types-v2/dto";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";

interface MenuCardProps {
  img: string;
  userId: number;
  outletId: number;
  name: string;
  price: number;
  rate: number;
  menuQuantity: number;
  menuItemId: number;
  hasAddOn: boolean;
  promotionPrice: number;
}

function MenuCard({
  img,
  name,
  price,
  rate,
  userId,
  outletId,
  menuQuantity,
  menuItemId,
  hasAddOn,
  promotionPrice,
}: MenuCardProps) {
  const [isPending, startTranstition] = useTransition();
  const [quantity, setQuantity] = useState(menuQuantity);
  const [isUserAction, setUserAction] = useState(false);

  const setisOrderChangeItem = useGlobalState(
    (state) => state.setisOrderChangeItem
  );
  const setAddOnMenu = useGlobalState((state) => state.setAddOnMenu);

  const queryClient = useQueryClient();
  const { data: user } = useGetUserInfo();

  const handleAddtoCart = useDebouncedCallback(() => {
    startTranstition(async () => {
      queryClient.setQueryData(
        ["outlet-unpaid-item", userId, outletId],
        (oldData: OutletUnpaidItemsDto) => {
          return {
            ...(oldData as OutletUnpaidItemsDto),
            totalQuantity: oldData.totalQuantity - menuQuantity + quantity,
          };
        }
      );

      const res = await addItemtoCart({
        userId: Number(userId),
        outletId: outletId,
        qty: quantity,
        menuItemId: menuItemId,
        addNew: false,
        type: "delivery",
        token: user?.token,
      });
      if (!res.status) {
        setQuantity(menuQuantity);
        toast.error(res.message);
      }

      queryClient.invalidateQueries({
        queryKey: ["outlet-unpaid-item", userId, outletId],
      });
      setisOrderChangeItem(false);
      setUserAction(false);
    });
  }, 500);

  const handleIncrement = () => {
    if (!userId) {
      document.getElementById("auth-trigger-dialog")?.click();
      return;
    }

    if (hasAddOn) {
      setAddOnMenu({
        outletId,
        menuItemId,
      });
      addExistMenuData();
      document.getElementById("add-menu-add-on-trigger")?.click();
      return;
    }

    if (isPending) {
      return;
    }
    if (userId) {
      setQuantity(quantity + 1);
      setUserAction(true);
    } else {
      document.getElementById("auth-trigger-dialog")?.click();
    }
  };
  const handleDecrement = () => {
    if (hasAddOn) {
      setAddOnMenu({
        outletId,
        menuItemId,
      });
      addExistMenuData();
      document.getElementById("add-menu-add-on-trigger")?.click();
      return;
    }
    if (isPending) {
      return;
    }

    setQuantity(quantity - 1);
    setUserAction(true);
  };

  const addExistMenuData = () => {
    queryClient.setQueryData(
      ["ouletmenu-addon", outletId, menuItemId],
      (oldData: any) => {
        return {
          ...oldData,
          image: img,
          name: name,
          price: price,
          rate: rate,
          menuItemId: menuItemId,
          hasAddOn: hasAddOn,
          addOn: [],
        };
      }
    );
    queryClient.invalidateQueries({
      queryKey: ["ouletmenu-addon", outletId, menuItemId],
    });
  };

  // Sync local quantity with prop changes
  useEffect(() => {
    setQuantity(menuQuantity);
  }, [menuQuantity]);

  useEffect(() => {
    if (!isUserAction) {
      return;
    }

    setisOrderChangeItem(true);
    handleAddtoCart();
  }, [quantity, isUserAction]);

  return (
    <div className=" block w-full max-w-full rounded-xl bg-white">
      <div className="h-40 w-full   sm:h-70 md:w-full relative ">
        <Image
          src={img || "/fake/promotions.png"}
          alt=""
          className="object-cover object-center rounded-t-xl"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div
          className={cn(
            " absolute top-3 right-3  rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer"
          )}
        >
          <div className="flex items-center">
            {quantity > 0 && (
              <button
                className={cn(
                  " h-9 w-9 grid place-content-center rounded-full cursor-pointer",
                  {
                    "animate-pulse": isPending,
                  }
                )}
                onClick={handleDecrement}
              >
                <Minus className="text-primary" />
              </button>
            )}

            <span
              className={cn(
                " text-center focus:outline-none font-bold w-9 mx-auto",
                quantity === 0 ? "hidden" : "block",
                {
                  "animate-pulse": isPending,
                }
              )}
            >
              {quantity}
            </span>
            <div
              className={cn(" h-9 w-9 grid place-content-center rounded-full", {
                "animate-pulse": isPending,
              })}
              onClick={handleIncrement}
            >
              <Plus className="text-primary" />
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-4 w-full">
        <h1 className="text-[#161F2F] font-semibold break-words overflow-hidden text-ellipsis">
          {name}
        </h1>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-primary">
              $ {promotionPrice !== price ? promotionPrice : price}
            </span>
            {promotionPrice !== price && (
              <span className=" line-through text-gray-400">${price}</span>
            )}
          </div>
          <span className="text-xs font-medium text-[#363F4F]/60">
            ≈{Math.round(rate ? rate * price : 0)}៛
          </span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MenuCard);
