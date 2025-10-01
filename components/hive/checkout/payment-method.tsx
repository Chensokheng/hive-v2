import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

export default function PaymentMethod() {
  return (
    <div className="bg-white border-t-4 border-primary-bg py-5 px-4 space-y-4">
      <h1 className="font-bold text-[#161F2F]">Payment Method</h1>

      <div className="bg-primary/10 py-2 px-4 rounded-md  gap-4 flex items-center justify-between border-primary border">
        <div className="relative aspect-square w-8">
          <Image
            src="/assets/tm-logo.png"
            alt="Example"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <div className="flex-1 w-full">
          <h1 className="text-[#161F2F] font-bold">TrueMoney Wallet</h1>
          <h2 className="text-sm text-[#EC0000]">KHQR</h2>
        </div>
        <div className="h-5 w-5 rounded-full bg-primary text-white grid place-content-center">
          <Check className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
