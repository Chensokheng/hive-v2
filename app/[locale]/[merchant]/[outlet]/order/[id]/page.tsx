"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import { getImageUrl } from "@/lib/utils";
import useGetOrderDetail from "@/hooks/use-get-order-detail";
import OrderAddonDetail from "@/components/hive/checkout/order-addon-detail";
import RefreshIcon from "@/components/icon/refresh";

import OrderProgress from "./_component/order-progress";

export default function OrderDetailsPage() {
  const { merchant, outlet, id } = useParams() as {
    merchant: string;
    outlet: string;
    id: string;
  };

  const { data, isLoading } = useGetOrderDetail(id, merchant, outlet);

  return (
    <div className=" bg-primary-bg">
      <div className=" min-h-screen max-w-5xl mx-auto bg-white pb-50">
        {/* Header */}
        <div className="bg-white px-4 py-4 flex items-center justify-between border-b">
          <h1 className=" text-xl sm:text-3xl font-bold text-[#161F2F] flex-1 text-center">
            Order Details
          </h1>
          <RefreshIcon />
        </div>

        {/* Status */}
        <div className="bg-white text-center py-6">
          {/* Progress Indicator */}
          <OrderProgress
            status={data?.data.status || ""}
            cancelReason={data?.data.cancel_reason || ""}
          />

          {/* Order Information */}
          <div className="bg-white p-4 border-t-8 border-primary-bg">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <span className="text-gray-600 font-medium">Order ID</span>
              <span className="text-blue-600 font-bold">{data?.data.id}</span>
            </div>

            <h3 className="font-bold text-[#161F2F] mb-4">
              Receiver Information
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#303D55]/60">Name:</span>
                <span className="text-[#161F2F] ">{data?.data.fullname}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#303D55]/60">Phone Number:</span>
                <span className="text-[#161F2F]">{data?.data.phone}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-[#303D55]/60">Address:</span>
                <span className="text-[#161F2F] text-right ">
                  {data?.data.location.address}
                </span>
              </div>
            </div>
          </div>

          {/* Restaurant Information */}
          <div className="bg-white  p-4 border-t-8 border-primary-bg space-y-3">
            <div className="flex items-center space-x-3">
              <AsyncImage
                src={getImageUrl(data?.data.outlet.merchant.logo_image!)}
                Transition={Blur}
                style={{
                  width: "48px",
                  height: "48px",
                }}
                className="object-center object-cover rounded-full"
                loader={<div className="bg-gray-300" />}
                alt={data?.data.outlet.name}
              />
              <h3 className=" font-semibold text-[#161F2F]">
                {data?.data.outlet.name}
              </h3>
            </div>
            <h3 className="font-bold text-[#161F2F] mb-4 border-b pb-3 text-left">
              Your Order
            </h3>

            {data?.data.items.map((item) => (
              <div key={item.id} className="flex items-start space-x-4">
                <AsyncImage
                  src={getImageUrl(item.menuItem.thumbnail_image_name)}
                  Transition={Blur}
                  style={{
                    width: "64px",
                    height: "64px",
                  }}
                  className="object-center object-cover rounded-full"
                  loader={<div className="bg-gray-300" />}
                  alt={data?.data.outlet.name}
                />

                <div className="flex-1">
                  <h4 className="font-semibold text-[#161F2F] mb-1 text-left">
                    {item.menuItem.name}
                  </h4>
                  <OrderAddonDetail text={item.formated_addon_items} />
                  {item.note && (
                    <p className="text-sm text-[#303D55]/60 mb-2">
                      {"Note: " + item.note}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm text-gray-600">(×{item.qty})</span>
                    <span className="font-bold text-[#161F2F]">
                      ${item.final_price}
                    </span>
                  </div>
                  <p className="text-sm text-[#303D55]/60">
                    ≈{(item.final_price * 4000).toFixed(2)}៛
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Cancel Button */}
          <div className="p-4 bg-white pt-10 fixed bottom-25 w-full lg:bottom-0 lg:w-5xl">
            <Link
              href={"tel:" + data?.data.outlet.phone}
              className="bg-primary/10 text-primary text-lg py-2 rounded-full w-full font-semibold cursor-pointer block"
            >
              Contact Merchant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
