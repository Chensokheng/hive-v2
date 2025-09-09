import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import CheckCircleIcon from "@/components/icon/check-circle";
import HourGlassIcon from "@/components/icon/hour-glass";
import PaymentIcon from "@/components/icon/payment";
import RefreshIcon from "@/components/icon/refresh";
import TruckIcon from "@/components/icon/truck";

export default function OrderDetailsPage() {
  // Mock data based on the screenshot
  const orderData = {
    orderId: "1234",
    status: "Processing",
    receiver: {
      name: "Ubol",
      phone: "+855 10 111 222",
      address:
        "Key stone Building, Norodom Blvd, Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh",
    },
    restaurant: {
      name: "Burger King BKK",
      logo: "/fake/merchant-logo.png",
    },
    orderItems: [
      {
        id: 1,
        name: "Sample Menu Title",
        image: "/fake/menu-popup.png",
        quantity: 1,
        price: 6,
        localPrice: 24000,
        addons: "Extra Chicken",
        note: "Keep it hot",
      },
    ],
  };

  const progressSteps = [
    { icon: PaymentIcon, active: true, completed: true },
    { icon: HourGlassIcon, active: true, completed: false },
    { icon: TruckIcon, active: false, completed: false },
    { icon: CheckCircleIcon, active: false, completed: false },
  ];

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
          <p className="text-primary text-[1.25rem] font-semibold mb-6">
            {orderData.status}
          </p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between px-4">
            {progressSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div>
                      <div
                        className={cn(
                          "w-10 h-10  rounded-full flex items-center justify-center relative",
                          {
                            "bg-primary/10":
                              step.active || index === progressSteps.length - 1,
                          }
                        )}
                      >
                        <IconComponent
                          fill={step.active ? "#0055dd" : "#BDC5DB"}
                        />
                        {step.active &&
                          step.completed &&
                          index !== progressSteps.length - 1 && (
                            <div className=" w-3 h-3 rounded-full bg-[#FF66CC] absolute bottom-2 right-2 grid place-content-center text-white">
                              <Check className="w-2 h-2" />
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={cn("flex-1 h-1 bg-primary/10 ", {
                        "bg-primary": step.completed,
                        " animate-pulse bg-primary/80":
                          step.active && !step.completed,
                      })}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-white p-4 border-t-8 border-primary-bg">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <span className="text-gray-600 font-medium">Order ID</span>
            <span className="text-blue-600 font-bold">{orderData.orderId}</span>
          </div>

          <h3 className="font-bold text-[#161F2F] mb-4">
            Receiver Information
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#303D55]/60">Name:</span>
              <span className="text-[#161F2F] ">{orderData.receiver.name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#303D55]/60">Phone Number:</span>
              <span className="text-[#161F2F]">{orderData.receiver.phone}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-[#303D55]/60">Address:</span>
              <span className="text-[#161F2F] text-right ">
                {orderData.receiver.address}
              </span>
            </div>
          </div>
        </div>

        {/* Restaurant Information */}
        <div className="bg-white  p-4 border-t-8 border-primary-bg space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden">
              <Image
                src={orderData.restaurant.logo}
                alt={orderData.restaurant.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <h3 className=" font-semibold text-[#161F2F]">
              {orderData.restaurant.name}
            </h3>
          </div>
          <h3 className="font-bold text-[#161F2F] mb-4 border-b pb-3">
            Your Order
          </h3>

          {orderData.orderItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-4">
              <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-pink-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-[#161F2F] mb-1">
                  {item.name}
                </h4>
                <p className="text-sm text-[#303D55]/60 mb-2">{item.addons}</p>
                <p className="text-sm text-[#303D55]/60 mb-2">
                  {"Note: " + item.note}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600">
                    (×{item.quantity})
                  </span>
                  <span className="font-bold text-[#161F2F]">
                    ${item.price}
                  </span>
                </div>
                <p className="text-sm text-[#303D55]/60">
                  ≈{item.localPrice.toLocaleString()}៛
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="p-4 bg-white pt-10 fixed bottom-0 w-5xl">
          <button className="bg-primary/10 text-primary text-lg py-2 rounded-full w-full font-semibold cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
