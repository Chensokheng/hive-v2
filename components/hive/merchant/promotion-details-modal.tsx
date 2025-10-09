"use client";

import React, { useState } from "react";
import { addMultipleItemsToCart } from "@/services/add-multiple-items-to-cart";
import { useQueryClient } from "@tanstack/react-query";
import { AsyncImage } from "loadable-image";
import { toast } from "sonner";
import { Blur } from "transitions-kit";

import { getImageUrl } from "@/lib/utils";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Product {
  id: number;
  name_en: string;
  image_name: string;
  base_price: number;
  promotion_price: number;
}

interface PromotionProduct {
  id: number;
  itemCd: string;
  qty: number | null;
  type: string;
  product: Product;
  discountAmount?: number | null;
}

interface Level {
  id: number;
  products: {
    qty: number;
    itemCd: string;
    discountAmount: number | null;
    discountedPrice: number | null;
    discountPercentage: number | null;
  }[];
}

interface PromotionDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotionType: "BUY_GET_FREE" | "COMBO";
  title: string;
  image: string;
  requiredProducts?: PromotionProduct[];
  freeProducts?: PromotionProduct[];
  levels?: Level[];
  promotionProducts?: PromotionProduct[];
  outletId: number;
}

export default function PromotionDetailsSheet({
  open,
  onOpenChange,
  promotionType,
  title,
  image,
  requiredProducts = [],
  freeProducts = [],
  levels = [],
  promotionProducts = [],
  outletId,
}: PromotionDetailsSheetProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { data: user } = useGetUserInfo();

  const queryClient = useQueryClient();

  // Get discount information based on promotion type
  const getDiscountInfo = () => {
    if (promotionType === "COMBO" && levels.length > 0) {
      const totalDiscount = levels[0].products.reduce(
        (sum, p) => sum + (p.discountAmount || 0),
        0
      );
      return {
        totalDiscount,
        products: levels[0].products,
      };
    }
    return { totalDiscount: 0, products: [] };
  };

  const discountInfo = getDiscountInfo();

  // Get products to display based on type
  const getProductsToDisplay = () => {
    if (promotionType === "BUY_GET_FREE") {
      return {
        required: requiredProducts,
        free: freeProducts,
      };
    } else {
      // COMBO
      return {
        required: promotionProducts.filter(
          (p) => p.type === "REQUIRED_COMBO_PRODUCT"
        ),
        free: [],
      };
    }
  };

  const productsToDisplay = getProductsToDisplay();

  const handleAddToCart = async () => {
    if (!user?.userId) {
      document.getElementById("auth-trigger-dialog")?.click();
      return;
    }

    setIsAdding(true);

    try {
      const items = productsToDisplay.required.map((p) => ({
        menu_item_id: p.product.id,
        qty: promotionType === "COMBO" ? 1 : p.qty || 1,
        note: "",
        addon_items: [],
        name: p.product.name_en,
        price: p.product.promotion_price || p.product.base_price,
      }));

      const result = await addMultipleItemsToCart({
        userId: Number(user.userId),
        outletId: outletId,
        items: items,
        token: user.token,
      });

      if (result.status) {
        onOpenChange(false);
        queryClient.invalidateQueries({
          queryKey: ["outlet-unpaid-item", user?.userId, outletId],
        });
      } else {
        toast.error(result.message || "Failed to add items to cart", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("An error occurred while adding items to cart");
    } finally {
      setIsAdding(false);
    }
  };

  // Calculate total price and savings
  const calculatePricing = () => {
    let originalTotal = 0;
    let discountedTotal = 0;

    productsToDisplay.required.forEach((p) => {
      const qty = promotionType === "COMBO" ? 1 : p.qty || 1;
      const basePrice = p.product.base_price || p.product.promotion_price;
      originalTotal += basePrice * qty;

      if (promotionType === "COMBO") {
        // Find discount for this product
        const productDiscount = discountInfo.products.find(
          (dp) => dp.itemCd === p.itemCd
        );
        const discount = productDiscount?.discountAmount || 0;
        discountedTotal += (basePrice - discount) * qty;
      } else {
        discountedTotal += (p.product.promotion_price || basePrice) * qty;
      }
    });

    return {
      originalTotal,
      discountedTotal,
      savings: originalTotal - discountedTotal,
    };
  };

  const pricing = calculatePricing();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="h-screen overflow-y-auto px-4 w-full max-w-md pb-14"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF0080] bg-clip-text text-transparent">
              {title}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Promotion Image */}

          <div className="w-full rounded-xl overflow-hidden">
            <AsyncImage
              src={getImageUrl(image)}
              alt={title}
              className="w-full h-70 object-contain"
              Transition={Blur}
              loader={<div className="bg-gray-300 w-full h-48" />}
            />
          </div>

          {/* Discount Information */}
          {promotionType === "COMBO" && discountInfo.totalDiscount > 0 && (
            <div className="bg-gradient-to-r from-[#FF6B00]/10 to-[#FF0080]/10 p-4 rounded-lg">
              <p className="text-sm font-semibold text-[#FF6B00]">
                Total Discount: ${discountInfo.totalDiscount.toFixed(0)}
              </p>
            </div>
          )}

          {/* Required Products */}
          {productsToDisplay.required.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">
                {promotionType === "COMBO" ? "Combo Includes:" : "Buy:"}
              </h3>
              <div className="space-y-3">
                {productsToDisplay.required.map((item) => {
                  const productDiscount =
                    promotionType === "COMBO"
                      ? discountInfo.products.find(
                          (dp) => dp.itemCd === item.itemCd
                        )
                      : null;
                  const discount = productDiscount?.discountAmount || 0;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <AsyncImage
                          src={getImageUrl(item.product.image_name)}
                          alt={item.product.name_en}
                          className="w-full h-full object-cover"
                          Transition={Blur}
                          loader={<div className="bg-gray-300 w-full h-full" />}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product.name_en}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            $
                            {item.product.promotion_price ||
                              item.product.base_price}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs text-[#FF6B00] font-semibold">
                              -${discount.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700">
                        x{promotionType === "COMBO" ? 1 : item.qty || 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Free Products */}
          {promotionType === "BUY_GET_FREE" &&
            productsToDisplay.free.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3 text-[#FF6B00]">
                  Get Free:
                </h3>
                <div className="space-y-3">
                  {productsToDisplay.free.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 bg-gradient-to-r from-[#FF6B00]/10 to-[#FF0080]/10 rounded-lg"
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <AsyncImage
                          src={getImageUrl(item.product.image_name)}
                          alt={item.product.name_en}
                          className="w-full h-full object-cover"
                          Transition={Blur}
                          loader={<div className="bg-gray-300 w-full h-full" />}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.product.name_en}
                        </p>
                        <span className="text-xs text-[#FF6B00] font-semibold">
                          FREE
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-[#FF6B00]">
                        x{item.qty || 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Price Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Original Price:</span>
              <span className="line-through text-gray-500">
                ${pricing.originalTotal.toFixed(0)}
              </span>
            </div>
            {pricing.savings > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-[#FF6B00] font-semibold">You Save:</span>
                <span className="text-[#FF6B00] font-semibold">
                  ${pricing.savings.toFixed(0)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">
                ${pricing.discountedTotal.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-fullbg-primary w-full rounded-full text-white"
          >
            {isAdding ? "Adding..." : "Add All to Cart"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
