import { getHappyHourAvailable } from "@/services/get-happy-hour-available";
import { useQuery } from "@tanstack/react-query";

export default function useGetHappyHourAvailableTimes(outletId: number) {
  return useQuery({
    queryKey: ["happy-hours-available-times", outletId],
    queryFn: () => getHappyHourAvailable({ outletId }),
    enabled: !!outletId,
  });
}
