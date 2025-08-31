"use server";

import { cookies } from "next/headers";
import { AddtoCartResponse } from "@/types-v2";

export const addItemtoCart = async (params: {
  userId: number;
  outletId: number;
  qty: number;
  menuItemId: number;
  addNew: boolean;
  note?: string;
  type?: string;
}) => {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
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
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      user_id: params.userId,
      menu_item_id: params.menuItemId,
      cart_item_id: null,
      qty: params.qty,
      add_new: params.addNew,
      note: params.note || "",
      is_web: 1,
      type: "delivery",
    }),
  });

  const data = (await res.json()) as AddtoCartResponse;

  console.log(data, "---");

  return {
    status: data.status,
    totalQuantity: data.data?.qty || 0,
    subtotal: data.data?.subtotal || 0,
    finalTotal: data.data?.final_total || 0,
  };
};
