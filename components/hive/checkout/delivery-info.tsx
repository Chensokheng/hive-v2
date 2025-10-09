import React, { useEffect } from "react";
import { updateCartFee } from "@/services/outlet/update-cart-fee";
import { useAddresStore } from "@/store/address";
import { useOutletStore } from "@/store/outlet";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import useGetUserInfo from "@/hooks/use-get-user-info";
import MapPin from "@/components/icon/map-pin";

import UserTemInfo from "./user-tem-info";

export default function DeliveryInfo({
  cartId,
  outletId,
}: {
  cartId: number;
  outletId: number;
}) {
  const { data: user } = useGetUserInfo();

  const setOpenAddresSheet = useAddresStore(
    (state) => state.setOpenAddressSheet
  );

  const setCheckoutUserTemInfo = useOutletStore(
    (state) => state.setCheckoutUserTemInfo
  );
  const checkoutUserTemInfo = useOutletStore(
    (state) => state.checkoutUserTemInfo
  );
  const setUpdateFeeError = useOutletStore((state) => state.setUpdateFeeError);
  const queryClient = useQueryClient();

  const updateFee = async () => {
    const res = await updateCartFee({
      cartId,
      userId: Number(user?.userId),
      token: user?.token!,
    });
    if (!res.status) {
      setUpdateFeeError(res.message);
      toast.error(res.message);
      return;
    }

    setUpdateFeeError(null);
    queryClient.invalidateQueries({
      queryKey: ["outlet-unpaid-item", user?.userId, outletId],
    });
  };

  useEffect(() => {
    if (user?.userId) {
      updateFee();
    }
  }, [user?.placeAddress]);

  return (
    <div className="space-y-5 bg-white p-4">
      <div className="space-y-3">
        <h1 className="font-bold">Delivery to:</h1>
        <button
          className="flex items-center gap-2 justify-between w-full cursor-pointer outline-none"
          onClick={() => setOpenAddresSheet(true)}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#FF66CC]/10 grid place-content-center">
              <MapPin color="#FF66CC" />
            </div>
            <p className=" font-medium flex-1 text-left">
              {user?.placeAddress || "Please select location"}
            </p>
          </div>

          <div className="">
            <ChevronRight />
          </div>
        </button>
      </div>

      <div className="space-y-2">
        <h1 className="font-bold">Receiver Information</h1>
        <UserTemInfo>
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-all rounded-full pr-5"
            onClick={() => {
              setCheckoutUserTemInfo({
                name: checkoutUserTemInfo?.name || user?.userName || "",
                phoneNumber:
                  checkoutUserTemInfo?.phoneNumber || user?.phone || "",
              });
            }}
          >
            <div className="w-10 h-10 rounded-full bg-primary grid place-content-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#fff"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">
                {checkoutUserTemInfo?.name || user?.userName}
              </span>
              <span className="text-gray-600">
                +855 {checkoutUserTemInfo?.phoneNumber || user?.phone}
              </span>
            </div>
          </div>
        </UserTemInfo>
      </div>
    </div>
  );
}
