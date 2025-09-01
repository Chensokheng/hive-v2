"use server";

import { cookies } from "next/headers";

export default async function placeOrder(params: {
  cartId: number;
  userId: number;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  note?: string;
  addressNote?: string;
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      status: false,
      error: "Unauthorize",
    };
  }

  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/delivery/carts/${params.cartId}/order?isCircleKWebView=false`;

  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: params.userId,
      bank_code: "",
      vnpt_pay_type: "",
      // change later
      payment_gateway: "true-money",
      language: "en",
      receiver_name: params.receiverName,
      receiver_phone: params.receiverPhone,
      receiver_email: params.receiverEmail,
      note: params.note || "",
      address_note: params.addressNote || "",
      // change later
      payment_key: "payment_truemoney",
      password: "",
    }),
  });

  const data = await res.json();
  return data;
}
