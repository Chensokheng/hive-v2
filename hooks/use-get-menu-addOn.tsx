import getOutletMenuAddon from "@/services/get-outlet-menu-addon";
import { useQuery } from "@tanstack/react-query";

export default function useGetMenuAddOn(outletId: number, menuItemId: number) {
  return useQuery({
    queryKey: ["ouletmenu-addon", outletId, menuItemId],
    queryFn: () => getOutletMenuAddon(outletId, menuItemId),
    enabled: !!menuItemId && !!outletId,
  });
}
