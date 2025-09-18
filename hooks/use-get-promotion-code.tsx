import { getPromotionCode } from "@/services/get-promotion-code";
import { useQuery } from "@tanstack/react-query";

export default function useGetPromotionCode(
  outletId: number,
  merchantId: number
) {
  return useQuery({
    queryKey: ["promotion-code", outletId, merchantId],
    queryFn: () => getPromotionCode(outletId, merchantId),
    enabled: !!outletId && !!merchantId,
  });
}
