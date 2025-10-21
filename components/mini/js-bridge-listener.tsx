"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { miniAppAuth } from "@/services/auth/signin-mini-app";
import { verifyPamyent } from "@/services/mini-app/verify-payment";
import { generateMmsToken } from "@/services/tm/generate-mms-token";
import { TMiniUserInfo } from "@/types-v2";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    toast.info(user?.token || "no token");

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
    if (isLoading) {
      return;
    }
    if (!user?.token) {
      initFetchUser().then(() => {});
    }
    (window as any).handleNativeResponse = async function (
      methodName: string,
      response: any
    ) {
      switch (methodName) {
        case "getUserInfo":
          const user = response as TMiniUserInfo;
          toast.info(JSON.stringify(user));
          await miniAppAuth({
            phoneNumber: user?.phoneNumber,
            fullName: user?.fullName,
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
          // toast.info(JSON.stringify(paymentSuccess));

          if (paymentSuccess.status === "EXECUTED") {
            toast.info("verify payment");
            await handleVerfiyPayment(paymentSuccess.merchantRef);
          }
          break;
        case "getPaymentStatus":
          toast.success("hello");
          break;
        default:
          break;
      }
    };
  }, [user]);

  return <></>;
}
