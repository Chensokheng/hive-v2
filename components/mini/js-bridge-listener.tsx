"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { miniAppAuth } from "@/services/auth/signin-mini-app";
import { generateMmsToken } from "@/services/tm/generate-mms-token";
import { useGlobalState } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
  const checkPaymentStatus = async (transactionId: string) => {
    const { token, client_id } = await generateMmsToken();
    toast.info("trigger getpayment");

    JSBridge.call(
      "getPaymentStatus",
      JSON.stringify({
        miniAppAccessToken: token.access_token,
        miniAppClientId: client_id,
        orderId: transactionId,
      })
    );
  };

  const checkPendingPayment = async () => {
    toast.info("running this 1");
    const pendingTransactionId = localStorage.getItem("pendingTransactionId");
    const checkoutTimestamp = localStorage.getItem("checkoutTimestamp");

    if (pendingTransactionId && checkoutTimestamp) {
      const timeSinceCheckout = Date.now() - parseInt(checkoutTimestamp);
      // Only check if checkout was initiated within the last 30 minutes
      if (timeSinceCheckout < 30 * 60 * 1000) {
        toast.info("running hey");

        await checkPaymentStatus(pendingTransactionId);
      } else {
        toast.info("running he jsh");
        // Clear old pending transaction
        localStorage.removeItem("pendingTransactionId");
        localStorage.removeItem("checkoutTimestamp");
      }
    }
  };

  const queryClient = useQueryClient();

  const handleVerfiyPayment = async (params: {
    merchantRef: string;
    transactionId: string;
    currency: string;
    totalAmount: number;
    transactionDate: string;
  }) => {
    toast.info("hey...", {
      duration: Infinity,
    });
    if (user?.token) {
      toast.info("Verifying payment...", {
        duration: Infinity,
      });
      // const res = await verifyPamyent(params.merchantRef, user.token);
      // If status is 2 (success), navigate to success page
      // if (res.status === 2) {
      //   const merchant = localStorage.getItem("lastSelectedMerchant");
      //   const outlet = localStorage.getItem("lastSelectedOutletName");
      //   const merchantName =
      //     localStorage.getItem("lastSelectedMerchantName") || "Merchant";

      //   const successUrl = `/payment-success?merchantName=${encodeURIComponent(merchantName)}&transactionId=${params.transactionId}&amount=${params.totalAmount}&currency=${params.currency}&date=${encodeURIComponent(params.transactionDate)}&orderId=${res.orderId}&merchant=${merchant}&outlet=${outlet}`;
      //   router.push(successUrl);
      // }
    }
  };

  useEffect(() => {
    initFetchUser().then(() => {});

    // Check for pending payments when app becomes visible/focused
    const handleAppFocus = () => {
      checkPendingPayment();
    };

    // Listen for app focus/visibility changes
    window.addEventListener("focus", handleAppFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        handleAppFocus();
      }
    });

    // Check for pending payments on initial load
    checkPendingPayment();

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
          const paymentCheckout = response as {
            merchantRef: string;
            status: string;
            transactionId: string;
            currency: string;
            totalAmount: number;
            transactionDate: string;
          };

          await checkPendingPayment();
          // Store transaction ID for later payment status check
          if (paymentCheckout.transactionId) {
            // Store transaction ID in localStorage for later use
            localStorage.setItem(
              "pendingTransactionId",
              paymentCheckout.transactionId
            );

            // Store timestamp to track when checkout was initiated
            localStorage.setItem("checkoutTimestamp", Date.now().toString());
          }
          break;
        case "getPaymentStatus":
          const paymentStatus = response as {
            merchantRef: string;
            status: string;
            transactionId: string;
            currency: string;
            totalAmount: number;
            transactionDate: string;
          };
          toast.info(JSON.stringify(paymentStatus));

          if (paymentStatus?.status === "EXECUTED") {
            // Clear the stored transaction ID and timestamp since payment is successful
            localStorage.removeItem("pendingTransactionId");
            localStorage.removeItem("checkoutTimestamp");

            await handleVerfiyPayment({
              merchantRef: paymentStatus.merchantRef,
              transactionId: paymentStatus.transactionId,
              currency: paymentStatus.currency,
              totalAmount: paymentStatus.totalAmount,
              transactionDate: paymentStatus.transactionDate,
            });
          }
          break;
        default:
          break;
      }
    };

    // Cleanup event listeners
    return () => {
      window.removeEventListener("focus", handleAppFocus);
      document.removeEventListener("visibilitychange", handleAppFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  return <></>;
}
