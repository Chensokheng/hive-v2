"use client";

import React, { useEffect } from "react";
import { miniAppAuth } from "@/services/auth/signin-mini-app";
import { generateMmsToken } from "@/services/tm/generate-mms-token";
import { TMiniUserInfo } from "@/types-v2";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { JSBridge } from "@/lib/js-bridge";

export default function JsBridgeListener() {
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

  useEffect(() => {
    initFetchUser().then(() => {});

    (window as any).handleNativeResponse = async function (
      methodName: string,
      response: any
    ) {
      switch (methodName) {
        case "getUserInfo":
          const user = response as TMiniUserInfo;
          await miniAppAuth({
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
          });

          queryClient.invalidateQueries({ queryKey: ["user-info"] });

          break;
        case "closeMiniApp":
          JSBridge.call("closeMiniApp", "{}");
        case "checkout":
          toast.success(response);
          break;
        case "getPaymentStatus":
          toast.success("hello");
          break;
        default:
          break;
      }
    };
  }, []);

  return <></>;
}
