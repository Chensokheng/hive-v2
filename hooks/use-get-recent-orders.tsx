import { getRecentOrder } from "@/services/get-recent-order";
import { useQuery } from "@tanstack/react-query";

export default function useGetRecentOrders(token: string) {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: () => getRecentOrder(token),
    enabled: !!token,
  });
}
