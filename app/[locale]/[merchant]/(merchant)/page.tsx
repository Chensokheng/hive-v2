import React, { use } from "react";
import { getAllMerchants } from "@/services/get-all-merchants";

import MerchantPage from "./_components/merchant-page";

export async function generateStaticParams() {
  const allMerchants = await getAllMerchants(
    undefined,
    undefined,
    undefined,
    2
  );
  return allMerchants.merchants.map((merchant) => ({
    merchant: merchant.href,
  }));
}

export default function Page({
  params,
}: {
  params: Promise<{ merchant: string }>;
}) {
  const { merchant } = use(params);
  return (
    <div>
      <MerchantPage merchantName={merchant} />
    </div>
  );
}
