import { MerchantInfoResponse } from "@/types-v2";

import { getImageUrl } from "@/lib/utils";

export const getMerchantInfo = async (merchantName: string) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BASE_API + "/merchants/sub-domain/" + merchantName
  );

  const merchant = (await res.json()) as MerchantInfoResponse;

  if (merchant.status === false) {
    return [];
  }

  return merchant.data.data.outlets.map((outlet) => {
    return {
      id: outlet.id,
      name: outlet.name,
      shortName: outlet.short_name,
      addressEn: outlet.address_en,
      addressKh: outlet.address,
      category: "",
      image: outlet.image ? getImageUrl(outlet.image) : "1111",
      banner: merchant.data.data.bannerDeal
        ? getImageUrl(merchant.data.data.bannerDeal)
        : "",
    };
  });
};
