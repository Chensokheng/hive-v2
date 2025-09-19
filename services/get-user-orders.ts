
export const getUserOrders = async (userId: number, token: string) => {
  console.log(userId);

  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      "/api/web/consumer/giaodoan/order/processing/" +
      userId,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );
  const data = (await response.json()) as {
    status: boolean;
    data: {
      total: number;
      orders: {
        id: number;
        status: string;
        type: string;
        outletShortName: string;
        merchantSubDomain: string;
      }[];
    };
  };
  return data;
};
