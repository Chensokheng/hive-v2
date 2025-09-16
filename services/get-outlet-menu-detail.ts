import { MenuAddOnItemResponse } from "@/types-v2";

import { getImageUrl } from "@/lib/utils";

export default async function getOutletMenuDetail(
  outletId: number,
  menuItemId: number
) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/web/menu/item/${menuItemId}?outlet_id=${outletId}`
  );
  const data = (await response.json()) as MenuAddOnItemResponse;

  return {
    image: data.data.thumbnail_image_name
      ? getImageUrl(data.data.thumbnail_image_name)
      : "",
    name: data.data.name,
    price: data.data.base_price,
    menuItemId: menuItemId,
    addOn: data.data.addon_categories,
    description: data.data.description,
  };
}
