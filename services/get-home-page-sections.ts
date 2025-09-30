import { HomepageResponse } from "@/types-v2";

export const getHomePageSectins = async () => {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API + "/api/web/homepage-sections";
  const response = await fetch(api);
  const data = (await response.json()) as HomepageResponse;
  return data;
};
