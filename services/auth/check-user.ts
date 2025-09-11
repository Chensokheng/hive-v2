export const checkUser = async (phoneNumber: string) => {
  if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.substring(1);
  }

  const endpoint =
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
    `/api/v2/mcms/user/check-exist?platform=3&phone=${phoneNumber}&country_code=855`;

  const res = await fetch(endpoint);

  const data = (await res.json()) as {
    status: boolean;
    data: boolean;
  };
  return data;
};
