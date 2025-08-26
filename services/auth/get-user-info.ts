"use server";

import { cookies } from "next/headers";

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
  const user = await res.json();

  console.log(user);

  return {
    userId: user.data.user_id,
  };
}
