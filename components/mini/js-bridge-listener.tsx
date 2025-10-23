"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { miniAppAuth } from "@/services/auth/signin-mini-app";
import { verifyPamyent } from "@/services/mini-app/verify-payment";
import { generateMmsToken } from "@/services/tm/generate-mms-token";
import { useGlobalState } from "@/store";
import { useQueryClient } from "@tanstack/react-query";

import { JSBridge } from "@/lib/js-bridge";
import useGetUserInfo from "@/hooks/use-get-user-info";

export default function JsBridgeListener() {
  const { data: user } = useGetUserInfo();
  const setCloseMiniApp = useGlobalState((state) => state.setIsCloseMiniApp);

  const router = useRouter();

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

  const handleVerfiyPayment = async (params: {
    merchantRef: string;
    transactionId: string;
    currency: string;
    totalAmount: number;
    transactionDate: string;
  }) => {
    if (user?.token) {
      const res = await verifyPamyent(params.merchantRef, user.token);
      // If status is 2 (success), navigate to success page
      if (res.status === 2) {
        const merchant = localStorage.getItem("lastSelectedMerchant");
        const outlet = localStorage.getItem("lastSelectedOutletName");
        const merchantName =
          localStorage.getItem("lastSelectedMerchantName") || "Merchant";

        const successUrl = `/payment-success?merchantName=${encodeURIComponent(merchantName)}&transactionId=${params.transactionId}&amount=${params.totalAmount}&currency=${params.currency}&date=${encodeURIComponent(params.transactionDate)}&orderId=${res.orderId}&merchant=${merchant}&outlet=${outlet}`;
        router.push(successUrl);
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
            fullName: parsedUser?.fullName || parsedUser?.username,
          });
          queryClient.invalidateQueries({ queryKey: ["user-info"] });

          break;
        case "closeMiniApp":
          setCloseMiniApp(true);
          break;
        case "checkout":
          const paymentSuccess = response as {
            merchantRef: string;
            status: string;
            transactionId: string;
            currency: string;
            totalAmount: number;
            transactionDate: string;
          };

          if (paymentSuccess.status === "EXECUTED") {
            await handleVerfiyPayment({
              merchantRef: paymentSuccess.merchantRef,
              transactionId: paymentSuccess.transactionId,
              currency: paymentSuccess.currency,
              totalAmount: paymentSuccess.totalAmount,
              transactionDate: paymentSuccess.transactionDate,
            });
          }
          break;
        case "getPaymentStatus":
          break;
        default:
          break;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  return <></>;
}
