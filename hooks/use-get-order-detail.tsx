import { getOrderDetail } from "@/services/get-order-detail";
import { useQuery } from "@tanstack/react-query";

export default function useGetOrderDetail(
  orderId: string,
  outlet: string,
  merchant: string
) {
  return useQuery({
    queryKey: ["order", orderId, outlet, merchant],
    queryFn: () => getOrderDetail({ orderId, outlet, merchant }),
    enabled: !!orderId && !!outlet && !!merchant,
    refetchInterval: 5000,
  });
}
