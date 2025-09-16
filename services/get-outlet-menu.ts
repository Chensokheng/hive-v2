import { OutletMenuResponse } from "@/types-v2";

import { getImageUrl } from "@/lib/utils";

export const getOutletMenu = async (
  outletId: number,
  categoryId: number | null
) => {
  const response = await fetch(
    `https://api-truemoney-stg.savyu.com/api/web/menu?outlet_id=${outletId}&type=delivery&limit=70${categoryId ? `&category_id=${categoryId}` : ""}`
  );
  const data = (await response.json()) as OutletMenuResponse;

  if (data.status === false) {
    return [];
  }

  return data.data.items.map((menu) => {
    return {
      id: menu.id,
      name: menu.name,
      items: menu.menu_items.map((item) => {
        return {
          id: item.id,
          image: item.thumbnail_image_name
            ? getImageUrl(item.thumbnail_image_name)
            : "",
          name: item.name,
          hasAddOn: item.hasAddon,
          price: item.base_price,
          promotionPrice: item.promotion_price,
        };
      }),
    };
  });
};
