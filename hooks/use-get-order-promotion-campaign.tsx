import { getOrderPromotionCampaign } from "@/services/get-order-promotion-campaign";
import { useQuery } from "@tanstack/react-query";

export default function useGetOrderPromotionCampaign(outletId: number) {
  return useQuery({
    queryKey: ["order-promotion-campaign", outletId],
    queryFn: () => getOrderPromotionCampaign(outletId),
    enabled: !!outletId,
  });
}
