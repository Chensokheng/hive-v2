import React from "react";
import getUserInfo from "@/services/auth/get-user-info";
import { getMerchantOutlets } from "@/services/get-merchant-outlets";

import Breadcrumb from "@/components/hive/merchant/breadcrumb";
import ListOutlets from "@/components/hive/merchant/list-outlets";

export default async function page({
  params,
}: {
  params: Promise<{ locale: string; merchant: string }>;
}) {
  const { locale, merchant } = await params;

  const user = await getUserInfo();

  // Try to get merchant info for proper display name
  let merchantDisplayName = merchant;

  const merchantData = await getMerchantOutlets(
    merchant,
    user.userId ? user.latitude : undefined,
    user.userId ? user.longtitude : undefined
  );
  if (merchantData.marchantName) {
    merchantDisplayName = merchantData.marchantName;
  }

  const breadcrumbItems = [
    {
      label: "Home",
      href: `/${locale}`,
      active: false,
    },
    {
      label: merchantDisplayName,
      active: true,
    },
  ];

  return (
    <div className="min-h-[90vh]">
      <div className="max-w-[1200px] mx-auto py-5 p-5">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className=" text-2xl font-bold mb-6">{merchantDisplayName}</h1>
        <ListOutlets data={merchantData?.outlets || []} merchant={merchant} />
      </div>
    </div>
  );
}
