import { seachAddressKeyword } from "@/services/address/search-address-keyword";
import { useQuery } from "@tanstack/react-query";

export default function useGetAddressByKeyword(searchParam: string) {
  return useQuery({
    queryKey: ["address-by-keyword", searchParam],
    queryFn: () => seachAddressKeyword(searchParam),
    enabled: !!searchParam,
  });
}
