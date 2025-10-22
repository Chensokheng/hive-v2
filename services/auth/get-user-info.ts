"use server";

import { cookies } from "next/headers";
import { UserProfile } from "@/types-v2";

export default async function getUserInfo() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      userId: "",
    };
  }

  const res = await fetch(
    process.env.NEXT_PUBLIC_HIVE_BASE_API +
      "/api/web/consumer/giaodoan/profile",
    {
      headers: {
        Authorization: "Bearer " + token,
      },
      method: "GET",
    }
  );
  const user = (await res.json()) as UserProfile;

  return {
    userId: user.data?.id,
    userName: user.data?.fullName,
    voucher: user.data?.totalVouchers,
    stamps: user.data?.totalStamps,
    tmRewardBalance: user.data?.savyu_balance,
    token,
    latitude: user.data?.user_infos[0]?.place_lat,
    longtitude: user.data?.user_infos[0]?.place_long,
    hasPassword: user.data?.hasPassword,
    placeAddress: user.data?.user_infos[0]?.place_address,
    phone: user.data?.phone,
    image: user.data.user_infos?.[0].image_name || null,
    birthDate: user.data?.birthdate,
  };
}
