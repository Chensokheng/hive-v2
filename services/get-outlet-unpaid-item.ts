"use server";

import { cookies } from "next/headers";
import { UnpaidOutletItems } from "@/types-v2";

import { getImageUrl } from "@/lib/utils";

export default async function getOutletUnpaidItem(
  userId: number,
  outletId: number
) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      status: false,
    };
  }

  const res = await fetch(
    `https://api-truemoney-stg.savyu.com/api/web/delivery/unpaid-carts?user_id=${userId}&outlet_id=${outletId}`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "GET",
    }
  );
  const cartOutlet = (await res.json()) as UnpaidOutletItems;

  if (cartOutlet.data) {
    return {
      cartId: cartOutlet.data.id,
      totalQuantity: cartOutlet.data.qty,
      subtotal: cartOutlet.data.subtotal,
      finalTotal: cartOutlet.data.final_total,
      otherFee: cartOutlet.data.other_fee,
      shippingFee: cartOutlet.data.shipping_fee,
      distance: cartOutlet.data.distance,
      totalVat: cartOutlet.data.total_custom_vat,
      userInfo: {
        userId: cartOutlet.data.user.id,
        name: cartOutlet.data.user.fullName,
        phone: cartOutlet.data.user.phone,
      },
      items: cartOutlet.data.items.map((item) => {
        return {
          id: item.id,
          outletId: item.menuItem.outlet_id,
          menuItemId: item.menu_item_id,
          quantity: item.qty,
          basePrice: item.base_price,
          promotionPrice: item.promotion_price,
          note: item.note,
          formatedAddonItems: item.formated_addon_items,
          image: item.menuItem.thumbnail_image_name
            ? getImageUrl(item.menuItem.thumbnail_image_name)
            : "",
          nameEn: item.menuItem.name_en,
          name: item.menuItem.name,
          cartAddonItems: item.cart_addon_items,
        };
      }),
    };
  }
  return {
    status: false,
  };
}
