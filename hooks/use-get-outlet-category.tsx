import { getOutletCategory } from "@/services/get-outlet-category";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletCategory(outletId: number) {
  return useQuery({
    queryKey: ["outlet-category", outletId],
    queryFn: () => getOutletCategory(outletId),
    enabled: !!outletId,
  });
}
