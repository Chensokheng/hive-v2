import { getOutletPromotion } from "@/services/get-outlet-promotions";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletPromotions(outletId: number) {
  return useQuery({
    queryKey: ["outlet-promotions", outletId],
    queryFn: () => getOutletPromotion(outletId),
    enabled: !!outletId,
  });
}
