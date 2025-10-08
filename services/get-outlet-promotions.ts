import { PromotionResponse } from "@/types-v2";

export const getOutletPromotion = async (outletId: number) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/consumer/promotions?outletId=${outletId}`
  );

  const data = (await response.json()) as PromotionResponse;
  return data;
};
