import { getMerchantInfo } from "@/services/get-merchant-info";
import { useQuery } from "@tanstack/react-query";

export default function useGetMerchantInfo(merchantName: string) {
  return useQuery({
    queryKey: ["merchant", merchantName],
    queryFn: () => getMerchantInfo(merchantName),
    enabled: !!merchantName,
  });
}
