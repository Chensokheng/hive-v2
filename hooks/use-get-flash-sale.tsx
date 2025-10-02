import { getOutletCustomDiscountMenus } from "@/services/get-outlet-custom-discount-menus";
import { useQuery } from "@tanstack/react-query";

export default function useGetGlashSale(userId: number, outletId: number) {
  return useQuery({
    queryKey: ["flash-sale", outletId, userId],
    queryFn: () => getOutletCustomDiscountMenus({ userId, outletId }),
    enabled: !!outletId,
  });
}
