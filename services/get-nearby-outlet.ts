import { OutletsNearByResponse } from "@/types-v2";

export const getNearbyOutlet = async (
  latitude: number,
  longitude: number,
  keyword: string
) => {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/consumer/giaodoan/nearby-outlets?latitude=${latitude}&longitude=${longitude}${keyword ? `&keyword=${keyword}` : ""}`;
  const response = await fetch(api);
  const data = (await response.json()) as OutletsNearByResponse;
  return data;
};
