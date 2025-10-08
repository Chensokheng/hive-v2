import { AddtoCartResponse } from "@/types-v2";

export interface MultipleCartItem {
  menu_item_id: number;
  qty: number;
  note: string;
  addon_items: { qty: number; addon_detail_id: number }[];
  name: string;
  price: number;
}

export const addMultipleItemsToCart = async (params: {
  userId: number;
  outletId: number;
  items: MultipleCartItem[];
  token: string | undefined;
}) => {
  if (!params.token) {
    return {
      status: false,
      message: "Unauthorized",
    };
  }

  const apiPath =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/delivery/carts/multiple-items?isCircleKWebView=false`;

  try {
    const res = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        outlet_id: params.outletId,
        user_id: params.userId,
        items: params.items,
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
  } catch (error) {
    return {
      status: false,
      message: "Failed to add items to cart",
      totalQuantity: 0,
      subtotal: 0,
      finalTotal: 0,
    };
  }
};
