export const updateDeliveryAddress = async (params: {
  userId: number;
  placeId: string;
  token: string;
}) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API + "/api/web/delivery/places",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${params.token}`,
      },
      method: "POST",
      body: JSON.stringify({
        user_id: params.userId,
        place_id: params.placeId,
      }),
    }
  );
  const data = (await response.json()) as {
    status: boolean;
    message: string;
    data: {
      place_id: string;
      lat: number;
      lng: number;
      long: number;
      address: string;
    };
  };

  return data;
};
