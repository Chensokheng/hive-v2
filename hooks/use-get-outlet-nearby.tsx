import { getNearbyOutlet } from "@/services/get-nearby-outlet";
import { useQuery } from "@tanstack/react-query";

export default function useGetOutletNearby(
  latitude: number,
  longitude: number,
  keyword: string
) {
  return useQuery({
    queryKey: ["outlet-menu-nearby", latitude, longitude, keyword],
    queryFn: () => getNearbyOutlet(latitude, longitude, keyword),
    enabled: !!latitude && !!longitude,
  });
}
