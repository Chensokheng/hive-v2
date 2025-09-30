import { BannerResponse } from "@/types-v2";

export const getBanner = async () => {
  const api = process.env.NEXT_PUBLIC_HIVE_BASE_API + "/api/web/banners";

  const res = await fetch(api);
  const data = (await res.json()) as BannerResponse;

  return data;
};
