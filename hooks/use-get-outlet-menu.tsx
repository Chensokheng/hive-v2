import { getOutletMenu } from "@/services/get-outlet-menu";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletMenu(outletId: number) {
  return useQuery({
    queryKey: ["outlet-menu", outletId],
    queryFn: () => getOutletMenu(outletId),
    enabled: !!outletId,
  });
}
