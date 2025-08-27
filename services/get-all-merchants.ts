import { PHNOM_PENH } from "@/constants";
import { MerchantsListingResponse } from "@/types-v2";

import { getImageUrl } from "@/lib/utils";

export const getAllMerchants = async (
  searchParams: string = "",
  provinceId: number = PHNOM_PENH,
  lastId?: number
) => {
  const lastIdParam = lastId ? `&last_id=${lastId}` : "";
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API +
      "/joined-merchants" +
      `?province_id=${provinceId}&limit=10${lastIdParam}${searchParams}`
  );
  const data = (await response.json()) as MerchantsListingResponse;
  if (data.status === false) {
    return {
      merchants: [],
      hasMore: false,
      nextLastId: undefined,
    };
  }

  const merchants = data.data.merchants.results.map((merchant) => ({
    id: merchant.id,
    name: merchant.name,
    image: merchant.image ? getImageUrl(merchant.image) : "",
    districtEn: merchant.address.district_en,
    districtKh: merchant.address.district,
    category: merchant.hierarchical_categories?.length
      ? merchant.hierarchical_categories[0].name
      : "",
    hasOutlet: merchant.outlets.length ? true : false,
    tag: merchant.tags?.length ? merchant.tags[0].name : "",
  }));

  const lastMerchantId =
    merchants.length > 0 ? merchants[merchants.length - 1].id : undefined;

  return {
    merchants,
    hasMore: data.data.merchants.pagination.load_more,
    nextLastId: data.data.merchants.pagination.load_more
      ? lastMerchantId
      : undefined,
  };
};
