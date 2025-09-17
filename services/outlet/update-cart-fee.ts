export const updateCartFee = async (params: {
  cartId: number;
  userId: number;
  token: string;
}) => {
  try {
    const api =
      process.env.NEXT_PUBLIC_HIVE_BASE_API +
      "/api/web/delivery/carts/fees?isCircleKWebView=false";

    const res = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      body: JSON.stringify({
        user_id: params.userId,
        cart_id: params.cartId,
        is_COD: false,
      }),
    });
    const data = await res.json();
    return { status: data.status };
  } catch {
    return {
      status: false,
    };
  }
};
