import { ApplyPromotionCodeResponse } from "@/types-v2";

export const applyPromoCode = async (
  promoCode: string,
  cartId: number,
  isSelfPickup: boolean,
  token: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HIVE_BASE_API}/api/web/app/promotion-codes/check-apply?cart_id=${cartId}&code=${promoCode}&is_self_pickup=${isSelfPickup}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = (await res.json()) as ApplyPromotionCodeResponse;
  return data;
};
