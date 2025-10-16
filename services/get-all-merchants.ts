import { PHNOM_PENH } from "@/constants";
import { MerchantsListingResponse } from "@/types-v2";

import { getImageUrl } from "@/lib/utils";

export const getAllMerchants = async (
  searchParams: string = "",
  provinceId: number = PHNOM_PENH,
  lastId?: number,
  limit: number = 10
) => {
  const lastIdParam = lastId ? `&last_id=${lastId}` : "";
  const provinceParam = provinceId ? `&province_id=${provinceId}` : "";
  const limitParam = limit ? `&limit=${limit}` : "";
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      "/api/web/consumer/giaodoan/joined-merchants" +
      `?${provinceParam}${limitParam}${lastIdParam}${searchParams}`
  );
  const data = (await response.json()) as MerchantsListingResponse;
  if (data.status === false) {
    return {
      collections: [],
      merchants: [],
      hasMore: false,
      nextLastId: undefined,
    };
  }

  const merchants = data.data.merchants.results.map((merchant) => ({
    id: merchant.id,
    name: merchant.name,
    image: merchant.image ? getImageUrl(merchant.image) : "",
    districtEn: merchant.address.district_en ?? merchant.address.district,
    districtKh: merchant.address.district,
    category: merchant.hierarchical_categories?.length
      ? merchant.hierarchical_categories[0].name
      : "",
    hasOutlet: merchant.outlets.length ? true : false,
    tag: merchant.tags?.length ? merchant.tags[0].name : "",
    href:
      merchant.outlets.length === 1
        ? `/${merchant.sub_domain}/${merchant.outlets[0].short_name}`
        : `/${merchant.sub_domain}`,
  }));

  const lastMerchantId =
    merchants.length > 0 ? merchants[merchants.length - 1].id : undefined;

  return {
    collections: data?.data?.collections,
    merchants,
    hasMore: data?.data?.merchants?.pagination?.load_more,
    nextLastId: data?.data?.merchants?.pagination?.load_more
      ? lastMerchantId
      : undefined,
  };
};
