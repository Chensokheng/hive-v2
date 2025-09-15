import React, { use } from "react";

import ListOutlets from "@/components/hive/merchant/list-outlets";

import BreadCrumMerchnat from "./_components/bread-crum";

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
      <div className="min-h-[90vh] pb-20">
        <div className="max-w-[1200px] mx-auto py-5 p-5">
          <BreadCrumMerchnat />
          <h1 className=" text-2xl font-bold mb-6 capitalize">{merchant}</h1>
          <ListOutlets />
        </div>
      </div>
    </div>
  );
}
