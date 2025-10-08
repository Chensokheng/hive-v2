import { OrderPromotionCampaign } from "@/types-v2";

export const getOrderPromotionCampaign = async (outletId: number) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/web/consumer/order-promotion-campaign?outletId=${outletId}`
  );

  const data = (await response.json()) as OrderPromotionCampaign;
  return data;
};
