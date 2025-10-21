export const verifyPamyent = async (merchantRef: string, token: string) => {
  const url =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/payment/truemoney/transactions/${merchantRef}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "GET",
  });

  const data = (await res.json()) as {
    externalRefId: string;
    status: 1 | 2 | 3;
    amount: string;
    type: string;
    orderId: number;
  };
  console.log(data);
  return data;
};
