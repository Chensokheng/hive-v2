export default async function placeOrder(params: {
  cartId: number;
  userId: number;
  receiverName: string;
  receiverPhone: string;
  receiverEmail?: string;
  note?: string;
  addressNote?: string;
  token: string;
  promotionCode?: string;
  promotionId?: number;
}) {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/delivery/carts/${params.cartId}/order?isCircleKWebView=false`;

  const res = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      user_id: params.userId,
      bank_code: "",
      vnpt_pay_type: "",
      // TODO: change later
      payment_gateway: "true-money",
      language: "en",
      receiver_name: params.receiverName,
      receiver_phone: params.receiverPhone,
      receiver_email: params.receiverEmail,
      note: params.note || "",
      address_note: params.addressNote || "",
      // TODO: change later
      payment_key: "payment_truemoney",
      password: "",
      code: params.promotionCode || null,
      promotion_code_id: params.promotionId !== -1 ? params.promotionId : null,
    }),
  });

  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data: {
      error_message?: string;
      status: {
        code: string;
        message: string;
        messageKh: string;
      };
      traceId: string;
      data: {
        webview: string;
        androidPackageName: string;
        deeplink: string;
        iosBundleId: string;
      };
    };
  };
  console.log(data);

  return data;
}
