"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { miniAppAuth } from "@/services/auth/signin-mini-app";
import { verifyPamyent } from "@/services/mini-app/verify-payment";
import { generateMmsToken } from "@/services/tm/generate-mms-token";
import { useQueryClient } from "@tanstack/react-query";

import { JSBridge } from "@/lib/js-bridge";
import useGetUserInfo from "@/hooks/use-get-user-info";

export default function JsBridgeListener() {
  const { data: user, isLoading } = useGetUserInfo();

  const router = useRouter();

  const asText = (value: unknown) =>
    typeof value === "string" ? value : JSON.stringify(value);

  const initFetchUser = async () => {
    const { token, client_id } = await generateMmsToken();
    JSBridge.call(
      "getUserInfo",
      JSON.stringify({
        miniAppAccessToken: token.access_token,
        miniAppClientId: client_id,
      })
    );
  };

  const queryClient = useQueryClient();

  const handleVerfiyPayment = async (merchantRef: string) => {
    if (user?.token) {
      let res = await verifyPamyent(merchantRef, user.token);

      res = await verifyPamyent(merchantRef, user.token);

      // If status is 2 (success), navigate to order page
      if (res.status === 2) {
        const redirectUrl = `/${localStorage.getItem("lastSelectedMerchant")}/${localStorage.getItem("lastSelectedOutletName")}/order/${res.orderId}`;
        router.push(redirectUrl);
      }
    }
  };

  useEffect(() => {
    initFetchUser().then(() => {});

    (window as any).handleNativeResponse = async function (
      methodName: string,
      response: any
    ) {
      switch (methodName) {
        case "getUserInfo":
          const userRes = response as any;

          // Check if userRes is a string and parse JSON if needed, otherwise use as is
          const parsedUser =
            typeof userRes === "string" ? JSON.parse(userRes) : userRes;

          await miniAppAuth({
            phoneNumber: parsedUser?.phoneNumber,
            fullName: parsedUser?.fullName || parsedUser.username,
          });
          queryClient.invalidateQueries({ queryKey: ["user-info"] });

          break;
        case "closeMiniApp":
          JSBridge.call("closeMiniApp", "{}");
        case "checkout":
          const paymentSuccess = response as {
            merchantRef: string;
            status: string;
          };

          if (paymentSuccess.status === "EXECUTED") {
            await handleVerfiyPayment(paymentSuccess.merchantRef);
          }
          break;
        case "getPaymentStatus":
          break;
        default:
          break;
      }
    };
  }, []);

  return <></>;
}
