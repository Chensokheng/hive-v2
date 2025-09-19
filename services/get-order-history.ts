import { OrdersResponse } from "@/types-v2";

export const getOrderHistory = async (
  token: string,
  phoneNumber: string,
  page: number,
  limit: number,
  filter: string
) => {
  const status =
    filter === "history"
      ? "completed,canceled"
      : "processing,new,assigning_driver,wait_for_pay,adjusting,picked_up";

  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/v2/web/consumer/orders?phoneNumber=${phoneNumber}&page=${page}&limit=${limit}&status=${status}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = (await response.json()) as OrdersResponse;

  return data;
};
