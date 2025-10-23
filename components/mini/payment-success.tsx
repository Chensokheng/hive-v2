"use client";

import React from "react";
import { useGlobalState } from "@/store";

import PaymentSuccess from "@/components/hive/payment/payment-success";

export default function PaymentSuccessContent() {
  const paymentSuccessData = useGlobalState(
    (state) => state.paymentSuccessData
  );

  // If no payment data is available, show a fallback or redirect
  if (!paymentSuccessData) {
    return <></>;
  }

  return (
    <PaymentSuccess
      merchantName={paymentSuccessData.merchantName}
      transactionId={paymentSuccessData.transactionId}
      amount={paymentSuccessData.amount}
      currency={paymentSuccessData.currency}
      date={paymentSuccessData.date}
      orderId={paymentSuccessData.orderId}
      merchant={paymentSuccessData.merchant}
      outlet={paymentSuccessData.outlet}
    />
  );
}
