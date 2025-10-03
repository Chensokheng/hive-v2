import { RecendOrders } from "@/types-v2";

export const getRecentOrder = async (token: string) => {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    "/api/web/hive-homepage/recent-ordered-merchants";

  const res = await fetch(api, {
    headers: {
      Authorization: "Bearer " + token,
    },
    method: "GET",
  });
  const data = (await res.json()) as RecendOrders;
  return data;
};
