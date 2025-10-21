"use server";

import crypto from "crypto";
import { cookies } from "next/headers";
import { UserResponse } from "@/types-v2";

interface MiniAppAuthParams {
  phoneNumber: string;
  fullName: string;
}

export const miniAppAuth = async (params: MiniAppAuthParams) => {
  try {
    // Read private key from file
    const apiKey = process.env.MINI_APP_SING_IN_KEY!.replace(/\\n/g, "\n");
    const privateKey = crypto.createPrivateKey({
      key: apiKey,
      format: "pem",
    });

    const timeStamp = Date.now();

    const phoneNumber = params.phoneNumber.startsWith("0")
      ? params.phoneNumber.substring(1)
      : params.phoneNumber;

    const payload = {
      phone: {
        number_phone: phoneNumber,
        country_code: 855,
      },
      fullName: params.fullName,
    };

    // Create signature
    const signer = crypto.createSign("SHA256");
    signer.update(`${timeStamp}${JSON.stringify(payload)}`, "utf8");
    const signature = signer.sign(privateKey, "base64");

    // // Headers to send with the request
    const headers = {
      Signature: signature,
      Timestamp: timeStamp,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      process.env.NEXT_PUBLIC_HIVE_BASE_API + "/api/auth/hive/mini-app",
      requestOptions as any
    );

    const result = await response.text();
    const user = JSON.parse(result) as UserResponse;

    const cookieStore = await cookies();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (user.status && user.data._token) {
      cookieStore.set("token", user.data._token, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: "lax",
        path: "/",
      });
    }
    return user;
  } catch (error) {
    // TODO handle error
    console.error("Mini app authentication error:", error);
    throw error;
  }
};
