import getOutletUnpaidItem from "@/services/get-outlet-unpaid-item";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletUnpaidItem(
  userId: number,
  outletId: number
) {
  return useQuery({
    queryKey: ["outlet-unpaid-item", userId, outletId],
    queryFn: () => getOutletUnpaidItem(userId, outletId),
    enabled: !!outletId && !!userId,
  });
}
