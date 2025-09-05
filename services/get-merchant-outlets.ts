import { MerchantOutletsResponse } from "@/types-v2";

import { getImageUrl } from "@/lib/utils";

export async function getMerchantOutlets(
  merchantName: string,
  latitude: number | undefined,
  longitude: number | undefined
) {
  let api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/consumer/giaodoan/merchants/sub-domain/${merchantName}`;

  if (latitude && longitude) {
    api += `?latitude=${latitude}&longitude=${longitude}`;
  }

  const response = await fetch(api);
  const data = (await response.json()) as MerchantOutletsResponse;

  if (data.status === false) {
    return { marchantName: merchantName, outlets: [] };
  }

  return {
    marchantName: data.data.data.name,
    outlets: data.data.data?.outlets.map((outlet) => {
      return {
        id: outlet.id,
        name: outlet.name,
        shortName: outlet.short_name,
        address: outlet.address,
        addressEn: outlet.address_en,
        image: outlet.image ? getImageUrl(outlet.image) : "",
        joinedDeliveryProgram: outlet.joinedDeliveryProgram,
        joinedContactlessProgram: outlet.joinedContactlessProgram,
        enableTableBooking: outlet.enableTableBooking,
        distance: outlet.distance,
      };
    }),
  };
}
