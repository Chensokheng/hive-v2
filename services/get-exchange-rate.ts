export const getExchangeRate = async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/app-config/usd-khr-exchange-rate`
  );
  const data = (await response.json()) as {
    status: boolean;
    data: { exchangeRate: number };
  };

  if (data.status === false) {
    return 0;
  }

  return data.data.exchangeRate;
};
