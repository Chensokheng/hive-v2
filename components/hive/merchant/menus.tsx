import React from "react";

import useGetExchangeRate from "@/hooks/use-get-exchange-rate";
import useGetMerchantInfo from "@/hooks/use-get-merchant-info";
import useGetOutletMenu from "@/hooks/use-get-outlet-menu";
import useGetOutletUnpaidItem from "@/hooks/use-get-outlet-unpaid-item";
import useGetUserInfo from "@/hooks/use-get-user-info";

import MenuCard from "./menu-card";

export default function Menus({
  merchantName,
  outletName,
}: {
  merchantName: string;
  outletName: string;
}) {
  const { data: merchantInfo, isLoading } = useGetMerchantInfo(merchantName);
  const { data: user } = useGetUserInfo();

  const foundOutlet = merchantInfo?.find(
    (item) => item.shortName === outletName
  );

  const { data: menus } = useGetOutletMenu(foundOutlet?.id!);
  const { data: rate } = useGetExchangeRate();

  const { data: unpaidItem, isLoading: isLoadingCartItems } =
    useGetOutletUnpaidItem(Number(user?.userId!), foundOutlet?.id!);

  if (isLoading) {
    return <h1>loading...</h1>;
  }

  return (
    <div>
      {menus?.map((menu, index) => {
        return (
          <div key={index}>
            <h1 className="font-bold text-black text-lg px-2 my-5">
              {menu.name}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-5">
              {menu.items?.map((item, index) => {
                const menuInCart = unpaidItem?.items?.find(
                  (value) => value.menuItemId === item.id
                );

                const menuQuantity = menuInCart?.quantity || 0;

                if (isLoadingCartItems) {
                  return <div key={index}></div>;
                }

                return (
                  <MenuCard
                    key={index}
                    img={item.image}
                    price={item.price}
                    rate={rate!}
                    userId={Number(user?.userId!)}
                    outletId={foundOutlet?.id!}
                    name={item.name}
                    menuQuantity={menuQuantity}
                    menuItemId={item.id}
                    hasAddOn={item.hasAddOn}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
