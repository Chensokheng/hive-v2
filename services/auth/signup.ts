"use server";

import { cookies } from "next/headers";
import { UserResponse } from "@/types-v2";

export default async function Signup(
  userName: string,
  phoneNumber: string,
  otp: string
) {
  if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.substring(1);
  }

  try {
    const resVerifyOtp = await fetch(
      process.env.NEXT_PUBLIC_HIVE_BASE_API + "/api/v2/web/user/verify-otp",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          otp,
          phone: {
            number_phone: phoneNumber,
            country_code: 855,
          },
        }),
      }
    );

    const dataVerifyOtp = (await resVerifyOtp.json()) as {
      status: true;
      data: {
        verificationKey: string;
        error_message: string;
      };
    };

    if (!dataVerifyOtp.status) {
      return {
        status: false,
        message: dataVerifyOtp.data.error_message,
      };
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_HIVE_BASE_API + "/api/auth/hive/sign-up",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          verificationKey: dataVerifyOtp.data.verificationKey,
          phone: {
            number_phone: phoneNumber,
            country_code: 855,
          },
          fullName: userName,
        }),
      }
    );

    const response = (await res.json()) as UserResponse;

    const cookieStore = await cookies();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (response.status && response.data._token) {
      cookieStore.set("token", response.data._token, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: "lax",
        path: "/",
      });
    }

    return {
      status: response.status,
      message: response.status ? "" : response.error_message,
    };
  } catch (e) {
    return {
      status: false,
      message: "",
    };
  }
}
