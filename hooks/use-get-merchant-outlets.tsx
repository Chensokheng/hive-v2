import { getMerchantOutlets } from "@/services/get-merchant-outlets";
import { useQuery } from "@tanstack/react-query";

export default function useGetMerchantOutlets(
  merchantName: string,
  latitude?: number,
  longitude?: number
) {
  return useQuery({
    queryKey: ["merchant-outlets", merchantName, latitude, longitude],
    queryFn: () => getMerchantOutlets(merchantName, latitude, longitude),
    enabled: false,
  });
}
