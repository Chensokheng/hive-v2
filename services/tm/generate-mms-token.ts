"use server";

import { TMmsToken } from "@/types-v2";
import fetch from "node-fetch";

export const generateMmsToken = async () => {
  const url =
    "https://local-channel-gateway-staging.dev.truemoney.com.kh/mms-api-gateway/merchants/token";

  const formData = new URLSearchParams();
  formData.append("grant_type", "client_credentials");
  formData.append("client_id", process.env.MINI_APP_ID || "");
  formData.append("client_secret", process.env.MINI_APP_SECRET || "");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const token = await response.json();

    return {
      token,
      client_id: process.env.MMS_CLIENT_ID,
      secret: process.env.MMS_CLIENT_SECRET,
    } as {
      token: TMmsToken;
      client_id: string;
      secret: string;
    };
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
};
