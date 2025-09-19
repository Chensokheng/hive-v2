import { OrderDetailResponse } from "@/types-v2";

export const getOrderDetail = async (params: {
  orderId: string;
  outlet: string;
  merchant: string;
}) => {
  const { orderId, outlet, merchant } = params;

  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/v2/web/consumer/orders/${orderId}?shortName=${outlet}&subdomain=${merchant}`
  );

  const data = (await response.json()) as OrderDetailResponse;

  return data;
};
