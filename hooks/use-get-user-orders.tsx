import { getUserOrders } from "@/services/get-user-orders";
import { useQuery } from "@tanstack/react-query";


export default function useGetUserOrders(userId: number, token: string) {
  return useQuery({
    queryKey: ["user-order"],
    queryFn: () => getUserOrders(userId, token),
    enabled: !!userId && !!token,
  });
}
