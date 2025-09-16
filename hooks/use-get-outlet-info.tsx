import { getOutletInfo } from "@/services/outlet/get-outlet-info";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletInfo(
  merchantName: string,
  outletName: string,
  latitude: number,
  longitude: number
) {
  return useQuery({
    queryKey: ["merchant", merchantName, outletName, latitude, longitude],
    queryFn: () =>
      getOutletInfo({ merchantName, outletName, latitude, longitude }),
    enabled: !!merchantName && !!outletName,
  });
}
