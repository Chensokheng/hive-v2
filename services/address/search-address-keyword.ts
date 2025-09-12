export const seachAddressKeyword = async (searchParam: string) => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      "/api/web/delivery/places" +
      `${searchParam}`
  );
  const data = (await response.json()) as {
    status: boolean;
    message: string;
    data: [
      {
        id: string;
        address: string;
        lat?: number;
        lng?: number;
      },
    ];
  };
  return data;
};
