import { getOutletMenu } from "@/services/get-outlet-menu";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletMenu(
  outletId: number,
  categoryId: number | null,
  searchMenu: string
) {
  return useQuery({
    queryKey: ["outlet-menu", outletId, categoryId, searchMenu],
    queryFn: () => getOutletMenu(outletId, categoryId, searchMenu),
    enabled: !!outletId,
  });
}
