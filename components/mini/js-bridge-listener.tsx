"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";

import { JSBridge } from "@/lib/js-bridge";

export default function JsBridgeListener() {
  const initBridge = async () => {
    const params = { title: "Hive Mini App" };
    JSBridge.call("setTitle", JSON.stringify(params));
  };

  useEffect(() => {
    initBridge();

    (window as any).handleNativeResponse = function (
      methodName: string,
      response: any
    ) {
      switch (methodName) {
        case "getUserInfo":
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
