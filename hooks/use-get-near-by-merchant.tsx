import { getNearByMerchants } from "@/services/landing/get-nearby-merchant";
import { useQuery } from "@tanstack/react-query";

export default function useGetNearByMerchant() {
  return useQuery({
    queryKey: ["nearby-merchants"],
    queryFn: () => getNearByMerchants(),
  });
}
