import { getCategories } from "@/services/get-categories";
import { useQuery } from "@tanstack/react-query";

export default function useFoodCategories() {
  return useQuery({
    queryKey: ["food-categories"],
    queryFn: () => getCategories(),
    select: (data) => data?.data || [],
  });
}
