import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { addItemtoCart } from "@/services/add-item-to-cart";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";

export default function MenuCard({
  img,
  name,
  price,
  rate,
  userId,
  outletId,
  menuQuantity,
  menuItemId,
}: {
  img: string;
  userId: number;
  outletId: number;
  name: string;
  price: number;
  rate: number;
  menuQuantity: number;
  menuItemId: number;
}) {
  const [isPending, startTranstition] = useTransition();
  const [isInitialRender, setIsInitialRender] = useState(true);

  const [quantity, setQuantity] = useState(menuQuantity);

  const queryClient = useQueryClient();

  const handleAddtoCart = useDebouncedCallback(() => {
    startTranstition(async () => {
      const res = await addItemtoCart({
        userId: Number(userId),
        outletId: outletId,
        qty: quantity,
        menuItemId: menuItemId,
        addNew: false,
        type: "delivery",
      });
      if (!res.status) {
        setQuantity(menuQuantity);
        toast.error(res.error_message);
        return;
      }
      queryClient.invalidateQueries({
        queryKey: ["outlet-unpaid-item", userId, outletId],
      });
    });
  }, 500);

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    handleAddtoCart();
  }, [quantity]);

  return (
    <div className=" block w-full max-w-full rounded-xl bg-white">
      <div className="h-40 w-full   sm:h-70 md:w-full relative ">
        <Image
          src={img || "/fake/promotions.png"}
          alt=""
          className="object-cover object-center rounded-t-xl"
          fill
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
                  " h-9 w-9 grid place-content-center rounded-full cursor-pointer"
                )}
                onClick={() => setQuantity(quantity - 1)}
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
              className=" h-9 w-9 grid place-content-center rounded-full"
              onClick={() => setQuantity(quantity + 1)}
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
            <span className="text-lg font-bold text-primary">${price}</span>
          </div>
          <span className="text-xs font-medium text-[#363F4F]/60">
            ≈{rate ? rate * price : 0}៛
          </span>
        </div>
      </div>
    </div>
  );
}
