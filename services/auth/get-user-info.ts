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

  const res = await fetch(process.env.BASE_API + "/profile", {
    headers: {
      Authorization: "Bearer " + token,
    },
    method: "GET",
  });
  const user = (await res.json()) as UserProfile;

  console.log(user.data.user_infos[0]);

  return {
    userId: user.data.id,
    userName: user.data.fullName,
    voucher: user.data.totalVouchers,
    stamps: user.data.totalVouchers,
    tmRewardBalance: user.data.savyu_balance,
    token,
    latitude: user.data?.user_infos[0]?.place_lat,
    longtitude: user.data?.user_infos[0]?.place_long,
  };
}
