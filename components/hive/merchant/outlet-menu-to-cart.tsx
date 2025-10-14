"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useParams } from "next/navigation";
import { addItemtoCart } from "@/services/add-item-to-cart";
import { useOutletStore } from "@/store/outlet";
import { useQueryClient } from "@tanstack/react-query";
import { AsyncImage } from "loadable-image";
import { ChevronLeft, Loader, Minus, Plus, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Blur } from "transitions-kit";

import { cn } from "@/lib/utils";
import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetMenuDetail from "@/hooks/use-get-menu-detail";
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

import AddonCategoryComponent from "./addon-category";

export interface SelectedAddon {
  categoryId: number;
  itemId: number;
  name: string;
  price: number;
}

export default function OutletMenuToCart() {
  const [isPending, startTransition] = useTransition();
  const params = useParams() as {
    merchant?: string;
    outlet?: string;
  };

  const openMenuSheet = useOutletStore((state) => state.openMenuSheet);
  const noteRef = useRef<HTMLInputElement>(null);
  const setOpenMenuSheet = useOutletStore((state) => state.setOpenMenuSheet);
  const selectedOutletMenu = useOutletStore(
    (state) => state.selectedOutletMenu
  );
  const selectOutletId = useOutletStore((state) => state.selectOutletId);

  const [basePrice, setBasePrice] = useState(selectedOutletMenu?.price || 0);
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);
  const [quantity, setQuantity] = useState(1);

  const { data: user } = useGetUserInfo();

  const { data: menuDetail } = useGetMenuDetail(
    selectOutletId!,
    selectedOutletMenu?.id! || 0
  );
  const { data: unpaidItem } = useGetOutletUnpaidItem(
    Number(user?.userId!),
    Number(selectOutletId)
  );

  const { data: rate } = useGetExchangeRate();
  const queryClient = useQueryClient();

  const handleAddonChange = (
    categoryId: number,
    item: any,
    selected: boolean
  ) => {
    setSelectedAddons((prev) => {
      if (selected) {
        // Add the addon
        return [
          ...prev,
          {
            categoryId,
            itemId: item.id,
            name: item.name,
            price: item.price,
          },
        ];
      } else {
        // Remove the addon
        return prev.filter(
          (addon) =>
            !(addon.categoryId === categoryId && addon.itemId === item.id)
        );
      }
    });
  };

  const areRequiredAddonsSelected = useMemo(() => {
    if (!menuDetail?.addOn) return true;

    const requiredCategories = menuDetail.addOn.filter(
      (category) =>
        category.required === 1 || category.name.toLowerCase() === "variation"
    );

    return requiredCategories.every((requiredCategory) =>
      selectedAddons.some((addon) => addon.categoryId === requiredCategory.id)
    );
  }, [menuDetail?.addOn, selectedAddons]);

  useEffect(() => {
    const price =
      selectedOutletMenu?.promotionPrice !== selectedOutletMenu?.price
        ? selectedOutletMenu?.promotionPrice
        : selectedOutletMenu?.price || 0;
    setBasePrice(price || 0);
    setQuantity(1);
    return () => {
      setSelectedAddons([]);
    };
  }, [selectedOutletMenu]);

  useEffect(() => {
    const price =
      selectedOutletMenu?.promotionPrice !== selectedOutletMenu?.price
        ? selectedOutletMenu?.promotionPrice
        : selectedOutletMenu?.price || 0;
    setBasePrice(price || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuDetail]);

  const totalAddonPrice = useMemo(() => {
    return selectedAddons.reduce((total, addon) => total + addon.price, 0);
  }, [selectedAddons]);
  // Calculate total price with Happy Hour logic:
  // - If the item is a Happy Hour product and quantity <= happyHourMaxQtyPerOrder,
  //   use promotionPrice for those units; any units above the limit use normal price.
  // - Add-ons are charged per unit.
  const totalPrice = useMemo(() => {
    const promoPrice =
      selectedOutletMenu?.promotionPrice ?? selectedOutletMenu?.price ?? 0;
    const normalPrice = selectedOutletMenu?.price ?? 0;
    const happyMax = selectedOutletMenu?.happyHourMaxQtyPerOrder ?? 0;
    const isHappyHour =
      Boolean(selectedOutletMenu?.isHappyHourProduct) && happyMax > 0;

    const addonTotal = totalAddonPrice * quantity;

    if (isHappyHour) {
      const happyQty = Math.min(quantity, happyMax);
      const normalQty = Math.max(quantity - happyMax, 0);
      const baseTotal = happyQty * promoPrice + normalQty * normalPrice;
      return baseTotal + addonTotal;
    }

    // Fallback to using basePrice when not in Happy Hour context
    return basePrice * quantity + addonTotal;
  }, [
    basePrice,
    quantity,
    selectedOutletMenu?.happyHourMaxQtyPerOrder,
    selectedOutletMenu?.isHappyHourProduct,
    selectedOutletMenu?.price,
    selectedOutletMenu?.promotionPrice,
    totalAddonPrice,
  ]);

  const allowAddItem =
    selectedOutletMenu?.isCustomDiscounted &&
    menuDetail?.activatedCustomDiscountedProduct
      ? menuDetail?.activatedCustomDiscountedProduct?.max_usage_per_order ||
        0 -
          (menuDetail?.activatedCustomDiscountedProduct?.user_total_used || 0) >
          0
      : true;

  const handleAddtoCart = () => {
    const existingItem =
      selectedOutletMenu?.isCustomDiscounted ||
      selectedOutletMenu?.isHappyHourProduct
        ? null
        : unpaidItem?.items?.find(
            (item) =>
              item.menuItemId === selectedOutletMenu?.id &&
              item.basePrice === selectedOutletMenu.price
          );

    const addonDetails = selectedAddons.map((addon) => ({
      qty: 1,
      addon_detail_id: addon.itemId,
    }));

    const isSameAddOn = addonDetails.every((addon) =>
      existingItem?.cartAddonItems.some(
        (item) => item.addon_detail_id === addon.addon_detail_id
      )
    );

    const cartId =
      isSameAddOn && existingItem?.note === noteRef.current?.value
        ? existingItem?.id
        : null;

    startTransition(async () => {
      const res = await addItemtoCart({
        cartItemId: cartId,
        userId: Number(user?.userId),
        outletId: selectOutletId!,
        qty: cartId ? quantity + (existingItem?.quantity || 0) : quantity,
        menuItemId: selectedOutletMenu?.id!,
        addNew: true,
        addonDetails: addonDetails,
        note: noteRef.current?.value || "",
        token: user?.token,
        isCustomDiscounted: selectedOutletMenu?.isCustomDiscounted || false,
        happyHourAvailableTimeId:
          selectedOutletMenu?.happyHourAvailableTimeId || null,
      });
      if (!res.status) {
        toast.error(res.message || "Faild to add this item to cart");
        return;
      }

      // Save last selected outlet and merchant info to localStorage
      if (selectOutletId) {
        localStorage.setItem("lastSelectedOutlet", String(selectOutletId));
      }
      if (params.merchant) {
        localStorage.setItem("lastSelectedMerchant", params.merchant);
      }
      if (params.outlet) {
        localStorage.setItem("lastSelectedOutletName", params.outlet);
      }

      queryClient.invalidateQueries({
        queryKey: ["outlet-unpaid-item", user?.userId, selectOutletId],
      });
      setOpenMenuSheet(false);
    });
  };

  return (
    <Sheet open={openMenuSheet} onOpenChange={setOpenMenuSheet}>
      <SheetContent
        showCloseBtn={false}
        className="max-w-full sm:max-w-[400px] w-full  border-0"
      >
        <SheetHeader className="hidden">
          <SheetTitle>Menu Item</SheetTitle>
          <SheetDescription>Menu drawer to add menu to cart</SheetDescription>
        </SheetHeader>

        <div
          className=" overflow-y-auto relative hide-scroll"
          id="container-menu"
        >
          <div className="sm:hidden top-0 left-0 z-50  backdrop-blur-2xl w-full p-2 sticky">
            <div
              className="  bg-[#F7F7F7]/75 w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300 "
              onClick={() => setOpenMenuSheet(false)}
            >
              <ChevronLeft />
            </div>
          </div>

          <div className=" hidden sm:block absolute top-0 right-0 z-50  p-2">
            <div
              className="  bg-[#F7F7F7]/75 w-8 h-8 grid place-content-center rounded-full cursor-pointer hover:scale-105 transition-all duration-300 "
              onClick={() => setOpenMenuSheet(false)}
            >
              <XIcon />
            </div>
          </div>

          <div className="relative aspect-square  w-full">
            <AsyncImage
              src={selectedOutletMenu?.image || ""}
              Transition={Blur}
              style={{
                width: "100%",
                height: "100%",
              }}
              className="object-center lg:object-cover"
              loader={<div className="bg-gray-300" />}
              alt={selectedOutletMenu?.name || ""}
            />
          </div>

          <div className="pt-4 px-5">
            <h1 className=" font-semibold text-[#161F2F]">
              {selectedOutletMenu?.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg">
                {selectedOutletMenu?.promotionPrice !==
                selectedOutletMenu?.price
                  ? selectedOutletMenu?.promotionPrice
                  : selectedOutletMenu?.price}
              </span>
              {selectedOutletMenu?.promotionPrice !==
                selectedOutletMenu?.price && (
                <span className="text-[#303D55]/60 line-through">
                  ${selectedOutletMenu?.price}
                </span>
              )}
              <span className="text-xs font-medium text-[#363F4F]/60">
                ≈
                {(selectedOutletMenu?.promotionPrice
                  ? selectedOutletMenu?.promotionPrice
                  : selectedOutletMenu?.price || 0) * (rate || 0)}
                ៛
              </span>
            </div>
            <p className="text-sm text-[#303D55]/60">
              {menuDetail?.description}
            </p>{" "}
            {((menuDetail?.activatedCustomDiscountedProduct &&
              selectedOutletMenu?.isCustomDiscounted) ||
              (selectedOutletMenu?.happyHourMaxQtyPerOrder &&
                selectedOutletMenu?.happyHourMaxQtyPerOrder > 0)) && (
              <p className="text-sm text-red-500 font-medium">
                Maximum per order:{" "}
                {menuDetail?.activatedCustomDiscountedProduct
                  ?.max_usage_per_order ||
                  selectedOutletMenu?.happyHourMaxQtyPerOrder}
              </p>
            )}
            {selectedOutletMenu?.hasAddOn && (
              <div className="py-6 space-y-6">
                {menuDetail?.addOn.map((category) => (
                  <AddonCategoryComponent
                    key={category.id}
                    category={category}
                    selectedAddons={selectedAddons}
                    onAddonChange={handleAddonChange}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="px-5 py-4 space-y-3 pb-48">
            <h1 className="text-sm font-semibold text-[#161F2F]">
              Note to merchant
            </h1>
            <Input
              id="input-note"
              className="rounded-2xl h-14"
              placeholder="e.g No onions, extra sauce, etc."
              autoFocus={false}
              tabIndex={-1}
              ref={noteRef}
            />
          </div>
        </div>

        {/* Add to cart button */}
        <div className="fixed flex-col bottom-0 gap-4 w-full sm:w-[400px] py-5 flex items-center justify-center bg-white px-5">
          <div className="flex items-center gap-4">
            <button
              className="rounded-full bg-primary/10 h-8 w-8 grid place-content-center cursor-pointer text-primary disabled:text-primary/50"
              onClick={() => setQuantity(quantity - 1)}
              disabled={quantity <= 1 || !allowAddItem}
            >
              <Minus />
            </button>

            <span className="text-[#161F2F] font-bold">{quantity}</span>
            <button
              className="rounded-full bg-primary/10 h-8 w-8 grid place-content-center cursor-pointer disabled:opacity-50"
              onClick={() => setQuantity(quantity + 1)}
              disabled={
                !allowAddItem ||
                (selectedOutletMenu?.happyHourMaxQtyPerOrder
                  ? quantity >= selectedOutletMenu.happyHourMaxQtyPerOrder
                  : false) ||
                quantity >=
                  (selectedOutletMenu?.isCustomDiscounted &&
                  menuDetail?.activatedCustomDiscountedProduct
                    ?.max_usage_per_order
                    ? menuDetail?.activatedCustomDiscountedProduct
                        ?.max_usage_per_order
                    : Infinity)
              }
            >
              <Plus className="text-primary" />
            </button>
          </div>
          <button
            className={cn(
              "font-bold text-lg rounded-full py-3 w-full text-white transition-all duration-200 bg-primary flex items-center justify-center disabled:bg-gray-300 cursor-pointer",
              {}
            )}
            disabled={!areRequiredAddonsSelected || isPending}
            onClick={() => handleAddtoCart()}
          >
            {isPending && <Loader className=" animate-spin" />}
            <span> {`Add to Cart - $${totalPrice}`}</span>
            <span className="text-xs font-medium">
              ≈{Math.round(totalPrice * (rate || 0))}៛
            </span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
