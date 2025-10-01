import getOutletUnpaidItem from "@/services/get-outlet-unpaid-item";
import { useQuery } from "@tanstack/react-query";

import useGetUserInfo from "./use-get-user-info";

export default function useGetOutletUnpaidItem(
  userId: number,
  outletId: number
) {
  const { data: user } = useGetUserInfo();

  return useQuery({
    queryKey: ["outlet-unpaid-item", userId, outletId],
    queryFn: () => getOutletUnpaidItem(userId, outletId, user?.token),
    enabled: !!outletId && !!userId && !!user?.token,
  });
}
