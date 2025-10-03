import { HappyHourResponse } from "@/types-v2";

export const getHappyHour = async ({
  outletId,
  availableTimeId,
}: {
  outletId: number;
  availableTimeId: number;
}) => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      `/api/consumer/promotions/happy-hours/promotions?outletId=${outletId}&availableTimeId=${availableTimeId}`
  );
  const data = (await res.json()) as HappyHourResponse;
  return data;
};
