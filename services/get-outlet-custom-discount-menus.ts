import { FlashSaleItemResponse } from "@/types-v2";

export const getOutletCustomDiscountMenus = async ({
  userId,
  outletId,
}: {
  userId: number;
  outletId: number;
}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_HIVE_BASE_API}/api/web/menu/custom-discounted?outlet_id=${outletId}&type=delivery` +
      (userId ? `&user_id=${userId}` : "")
  );
  const data = (await response.json()) as FlashSaleItemResponse;
  return data;
};
