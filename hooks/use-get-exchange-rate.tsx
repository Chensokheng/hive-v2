import { getExchangeRate } from "@/services/get-exchange-rate";
import { useQuery } from "@tanstack/react-query";

export default function useGetExchangeRate() {
  return useQuery({
    queryKey: ["exchange-rate"],
    queryFn: () => getExchangeRate(),
  });
}
