import { getOrderHistory } from "@/services/get-order-history";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserOrderHistory(
  token: string,
  phoneNumber: string,
  filter: string
) {
  return useQuery({
    queryKey: ["user-order-histroy", filter],
    queryFn: () => getOrderHistory(token, phoneNumber, 1, 6, filter),
    enabled: !!token && !!phoneNumber,
    staleTime: 0,
  });
}
