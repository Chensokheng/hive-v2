"use client";

import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const { locale } = useParams();
  const searchParams = useSearchParams();

  // Get error details from URL params
  const errorCode = searchParams.get("error_code");
  const errorMessage = searchParams.get("error_message");
  const orderId = searchParams.get("order_id");
  const amount = searchParams.get("amount");

  const handleGoHome = () => {
    window.location.href = `/${locale}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[800px] mx-auto min-h-screen lg:bg-white">
        {/* Header */}
        <div className="flex items-center gap-2 py-6 lg:px-10 border-b px-2 bg-white">
          <Link href={`/${locale}`}>
            <ChevronLeft className="text-primary" />
          </Link>
          <h1 className="text-lg lg:text-3xl font-bold text-[#161F2F] text-center flex-1">
            Payment Failed
          </h1>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 space-y-8">
          {/* Error Icon and Message */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-500"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M15 9l-6 6M9 9l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#161F2F]">
                Payment Failed
              </h2>
              <p className="text-gray-600 text-lg">
                {
                  "We couldn't process your payment. Please try again or contact support."
                }
              </p>
            </div>
          </div>

          {/* Error Details */}
          {(errorCode || errorMessage || orderId) && (
            <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
              <h3 className="font-semibold text-[#161F2F] text-lg">
                Error Details
              </h3>

              {orderId && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm text-[#161F2F]">
                    {orderId}
                  </span>
                </div>
              )}

              {amount && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-[#161F2F]">
                    ${amount}
                  </span>
                </div>
              )}

              {errorCode && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Error Code:</span>
                  <span className="font-mono text-sm text-red-600">
                    {errorCode}
                  </span>
                </div>
              )}

              {errorMessage && (
                <div className="py-2">
                  <span className="text-gray-600 block mb-2">
                    Error Message:
                  </span>
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {errorMessage}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Common Reasons */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-[#161F2F] text-lg mb-4">
              Common Reasons for Payment Failure
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Incorrect card details or expired card</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Network connectivity issues</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Bank security restrictions</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleGoHome}
              variant="ghost"
              className="w-full h-12 text-base font-semibold text-gray-600 hover:text-[#161F2F] hover:bg-gray-100"
            >
              Back to Home
            </Button>
          </div>

          {/* Help Section */}
        </div>
      </div>
    </div>
  );
}
