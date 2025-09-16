import { getOuletBanner } from "@/services/outlet/get-outlet-banner";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletNanner(outletId: number) {
  return useQuery({
    queryKey: ["outlet-banner", outletId],
    queryFn: () => getOuletBanner(outletId),
    enabled: !!outletId,
  });
}
