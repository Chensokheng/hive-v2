export const miniAppCheckout = async (params: {
  token: string;
  userId: number;
  cartId: number;
  receiverName: string;
  receiverPhone: string;
  note?: string;
  addressNote?: string;
  promotionCode?: string;
  promotionId?: number;
  isSelfPickup?: boolean;
  pickupTime?: number | null;
}) => {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/delivery/carts/${params.cartId}/order`;

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
      payment_gateway: "true-money",
      language: "en",
      receiver_name: params.receiverName,
      receiver_phone: params.receiverPhone,
      receiver_email: null,
      note: params.note,
      address_note: params.addressNote,
      payment_key: "payment_truemoney",
      isTrueMoneyMiniApp: true,
      code: params.promotionCode || null,
      promotion_code_id: params.promotionId !== -1 ? params.promotionId : null,
      is_self_pickup: params.isSelfPickup || false,
      pickup_time: params.pickupTime || null,
    }),
  });
  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data: {
      externalRefId: string;
      id: string;
      amount: string;
    };
  };
  return data;
};
