export const getExchangeRate = async () => {
  const response = await fetch(
    `https://api-truemoney-stg.savyu.com/api/app-config/usd-khr-exchange-rate`
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
