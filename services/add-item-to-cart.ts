import { AddtoCartResponse } from "@/types-v2";

export const addItemtoCart = async (params: {
  userId: number;
  outletId: number;
  qty: number;
  menuItemId: number;
  addNew: boolean;
  note?: string;
  type?: string;
  addonDetails?: { qty: number; addon_detail_id: number }[];
  cartItemId?: number | null;
  token: string | undefined;
  isCustomDiscounted: boolean;
  happyHourAvailableTimeId: number | null;
}) => {
  if (!params.token) {
    return {
      status: false,
      message: "Unauthorize",
    };
  }
  const apiPath =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/delivery/carts?outlet_id=${params.outletId}`;

  const res = await fetch(apiPath, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },

    body: JSON.stringify({
      user_id: params.userId,
      menu_item_id: params.menuItemId,
      cart_item_id: params.cartItemId ? params.cartItemId : null,
      qty: params.qty,
      add_new: params.addNew,
      isCustomDiscounted: params.isCustomDiscounted,
      note: params.note || "",
      is_web: 1,
      type: "delivery",
      addon_items: params.addonDetails || [],
      happy_hour_available_time_id: params.happyHourAvailableTimeId || null,
    }),
  });

  const data = (await res.json()) as AddtoCartResponse;

  return {
    status: data.status,
    totalQuantity: data.data?.qty || 0,
    subtotal: data.data?.subtotal || 0,
    finalTotal: data.data?.final_total || 0,
    message: data.message || "",
  };
};
