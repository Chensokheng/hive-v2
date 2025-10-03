import { AvailableTimeResponse } from "@/types-v2";

export const getHappyHourAvailable = async ({
  outletId,
}: {
  outletId: number;
}) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/consumer/promotions/happy-hours/available-times?outletId=${outletId}`
  );
  const data = (await res.json()) as AvailableTimeResponse;
  return data;
};
