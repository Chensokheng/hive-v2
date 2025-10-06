import { getHappyHour } from "@/services/get-happy-hour";
import { useQuery } from "@tanstack/react-query";

export default function useGetHappyHours(
  outletId: number,
  availableTimeId: number
) {
  return useQuery({
    queryKey: ["happy-hours", outletId, availableTimeId],
    queryFn: () => getHappyHour({ outletId, availableTimeId }),
    enabled: !!outletId && !!availableTimeId,
  });
}
