import { getHomePageSectins } from "@/services/get-home-page-sections";
import { useQuery } from "@tanstack/react-query";

export default function useGetHomePageSection() {
  return useQuery({
    queryKey: ["homepage-section"],
    queryFn: () => getHomePageSectins(),
  });
}
