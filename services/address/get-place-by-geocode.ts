export const getPlaceByGeocode = async (params: {
  lat: number;
  lng: number;
  token: string;
}) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/web/consumer/address/place-by-geocode?latlng=${params.lat},${params.lng}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      method: "GET",
    }
  );

  const data = (await response.json()) as {
    status: boolean;
    data: {
      id: string;
      lat: number;
      lng: number;
      address: string;
    };
  };

  return data;
};
