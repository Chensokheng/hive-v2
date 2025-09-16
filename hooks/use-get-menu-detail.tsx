import getOutletMenuDetail from "@/services/get-outlet-menu-detail";
import { useQuery } from "@tanstack/react-query";

export default function useGetMenuDetail(outletId: number, menuItemId: number) {
  return useQuery({
    queryKey: ["ouletmenu-menu-detail", outletId, menuItemId],
    queryFn: () => getOutletMenuDetail(outletId, menuItemId),
    enabled: !!menuItemId && !!outletId,
  });
}
