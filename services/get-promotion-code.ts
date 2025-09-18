import { PromotionCodeResponse } from "@/types-v2";

export const getPromotionCode = async (
  outletId: number,
  merchantId: number
) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/web/app/promotion-codes?outletId=${outletId}&merchant_id=${merchantId}&savyu_service=delivery`
  );
  const data = (await response.json()) as PromotionCodeResponse;
  return data;
};
