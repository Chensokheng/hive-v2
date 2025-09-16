export const getOuletBanner = async (outletId: number) => {
  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/web/consumer/banner-config?platform=web&type=banner&outlet_id=${outletId}`;
  const response = await fetch(api);
  const data = (await response.json()) as OutletBannerResponse;

  return data;
};
