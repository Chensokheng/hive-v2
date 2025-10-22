"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

import PaymentSuccess from "@/components/hive/payment/payment-success";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const transactionId = searchParams.get("transactionId") || "";
  const amount = parseFloat(searchParams.get("amount") || "0");
  const currency = searchParams.get("currency") || "៛";
  const date = searchParams.get("date") || "";
  const orderId = searchParams.get("orderId") || "";
  const merchant = searchParams.get("merchant") || "";
  const outlet = searchParams.get("outlet") || "";

  return (
    <>
      <PaymentSuccess
        merchantName={outlet}
        transactionId={transactionId}
        amount={amount}
        currency={currency}
        date={date}
        orderId={orderId}
        merchant={merchant}
        outlet={outlet}
      />
    </>
  );
}
