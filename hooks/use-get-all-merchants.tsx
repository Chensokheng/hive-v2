import { PHNOM_PENH } from "@/constants";
import { getAllMerchants } from "@/services/get-all-merchants";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useGetAllMerchants(
  searchParams: string = "",
  provinceId: number = PHNOM_PENH
) {
  return useInfiniteQuery({
    queryKey: ["all-merchants", provinceId, searchParams],
    queryFn: ({ pageParam }: { pageParam: number | undefined }) =>
      getAllMerchants(searchParams, provinceId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextLastId,
    initialPageParam: undefined as number | undefined,
  });
}
