"use server";

import { cookies } from "next/headers";
import { UserResponse } from "@/types-v2";

export default async function signin(phoneNumber: string) {
  const res = await fetch(process.env.BASE_API + "/sign-in", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      phone: {
        number_phone: phoneNumber,
        country_code: 855,
      },
      password: "111111",
    }),
  });

  const response = (await res.json()) as UserResponse;
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (response.status && response.data.data._token) {
    cookieStore.set("token", response.data.data._token, {
      httpOnly: true,
      secure: true,
      expires: expires,
      sameSite: "lax",
      path: "/",
    });
  }

  return {
    status: response.status,
    errorMessage: response.status ? "" : response.error_message,
  };
}
