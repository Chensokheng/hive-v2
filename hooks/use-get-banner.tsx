import { getBanner } from "@/services/get-banner";
import { useQuery } from "@tanstack/react-query";

export default function useGetBanner() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => getBanner(),
  });
}
