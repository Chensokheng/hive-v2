import React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletMenu from "@/hooks/use-get-outlet-menu";

export default function Menus({
  merchantName,
  outletName,
}: {
  merchantName: string;
  outletName: string;
}) {
  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchantName);

  const foundOutlet = merchantInfo?.find(
    (item) => item.shortName === outletName
  );

  const { data: menus } = useGetOutletMenu(foundOutlet?.id!);
  const { data: rate } = useGetExchangeRate();

  if (isLoading) {
    return <h1>Hello</h1>;
  }

  return (
    <div>
      {menus?.map((menu, index) => {
        return (
          <div key={index}>
            <h1 className="font-bold text-black text-lg px-2 my-5">
              {menu.name}
            </h1>
            <div className="grid grid-cols-2 sm:flex flex-wrap gap-2  sm:gap-5 px-2">
              {menu.items?.map((item, index) => (
                <div className="bg-white inline-block rounded-xl" key={index}>
                  <div className="h-40 w-full   sm:h-70 sm:w-70 relative">
                    <Image
                      src={item.image || "/fake/promotions.png"}
                      alt=""
                      className="object-cover object-center rounded-t-xl"
                      fill
                    />
                    <div className=" absolute top-3 right-3 h-9 w-9 rounded-full bg-[#F7F7F7] grid place-content-center border border-white cursor-pointer">
                      <Plus className="text-primary" />
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <h1 className="text-[#161F2F] font-semibold">
                      {item.name}
                    </h1>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-primary">
                          ${item.price}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-[#363F4F]/60">
                        ≈{rate ? rate * item.price : 0}៛
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
