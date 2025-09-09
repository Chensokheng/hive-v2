import React, { use } from "react";

import MerchantPage from "./_components/merchant-page";

export async function generateStaticParams() {
  return [];
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
