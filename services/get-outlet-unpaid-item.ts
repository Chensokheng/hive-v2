"use server";

import { cookies } from "next/headers";
import { UnpaidOutletItems } from "@/types-v2";

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

  return {
    cartId: cartOutlet.data.id,
    totalQuantity: cartOutlet.data.qty,
    items: cartOutlet.data.items.map((item) => {
      return {
        id: item.id,
        menuItemId: item.menu_item_id,
        quantity: item.qty,
        basePrice: item.base_price,
        promotionPrice: item.promotion_price,
      };
    }),
  };
}
