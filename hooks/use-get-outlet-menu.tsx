import { getOutletMenu } from "@/services/get-outlet-menu";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletMenu(
  outletId: number,
  categoryId: number | null
) {
  return useQuery({
    queryKey: ["outlet-menu", outletId, categoryId],
    queryFn: () => getOutletMenu(outletId, categoryId),
    enabled: !!outletId,
  });
}
