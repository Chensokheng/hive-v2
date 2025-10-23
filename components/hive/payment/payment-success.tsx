"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/store";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaymentSuccessProps {
  merchantName: string;
  transactionId: string;
  amount: number;
  currency: string;
  date: string;
  orderId: string;
  merchant: string;
  outlet: string;
}

export default function PaymentSuccess({
  merchantName,
  transactionId,
  amount,
  currency,
  date,
  orderId,
  merchant,
  outlet,
}: PaymentSuccessProps) {
  const [isAnimate, setAnimate] = useState(false);
  const router = useRouter();

  const openSuccessDialog = useGlobalState((state) => state.openSuccessDialog);
  const setOpenSuccessDialog = useGlobalState(
    (state) => state.setOpenSuccessDialog
  );
  const handleViewOrder = () => {
    const redirectUrl = `/${merchant}/${outlet}/order/${orderId}`;
    router.push(redirectUrl);
    setOpenSuccessDialog(false);
  };

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <Dialog open={openSuccessDialog}>
      <DialogContent className="w-full max-w-full p-0">
        <DialogHeader className="hidden">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-[90vh] bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 grid place-content-center w-full ">
          <div className="-translate-y-10">
            <div className="text-center">
              <div
                className={cn(
                  "bg-pink-500 rounded-full w-[56px] h-[56px] mx-auto grid place-content-center  transition-all duration-500 ",
                  isAnimate
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                )}
              >
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2
                className={cn(
                  "text-white text-xl font-semibold mb-8 transition-all duration-700",
                  isAnimate
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0"
                )}
              >
                Success
              </h2>
            </div>

            <div
              className={cn(
                "bg-white rounded-lg p-6 w-full max-w-sm shadow-lg transition-all  duration-1000",
                isAnimate
                  ? "translate-y-0 opacity-100"
                  : "translate-y-5 opacity-0"
              )}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold uppercase">
                    {merchantName.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">You paid to</p>
                  <p className="text-black font-bold">{merchantName}</p>
                </div>
              </div>

              <div className="border-t border-dashed border-blue-300 my-4"></div>

              <div className=" mb-4">
                <p className="text-blue-600 text-3xl font-bold">
                  -{amount.toLocaleString()}
                  <span className="text-pink-500 ml-1">{currency}</span>
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-10">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="text-black font-medium">
                    {transactionId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="text-black font-medium">{date}</span>
                </div>
              </div>

              <button
                onClick={handleViewOrder}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mt-6 hover:bg-blue-700 transition-colors"
              >
                View Order Details
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
