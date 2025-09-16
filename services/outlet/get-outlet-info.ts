export const getOutletInfo = async ({
  merchantName,
  outletName,
  latitude,
  longitude,
}: {
  merchantName: string;
  outletName: string;
  latitude: number;
  longitude: number;
}) => {
  const searchParams =
    latitude && longitude ? `&latitude=${latitude}&longitude=${longitude}` : "";

  const api =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/outlet/detail/alias_name?sub_domain=${merchantName}&short_name=${outletName}${searchParams}`;

  const response = await fetch(api);
  const data = (await response.json()) as OutletInfoResponse;

  return data;
};
