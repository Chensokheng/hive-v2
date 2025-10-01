import React from "react";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import CheckCircleIcon from "@/components/icon/check-circle";
import HourGlassIcon from "@/components/icon/hour-glass";
import PaymentIcon from "@/components/icon/payment";
import TruckIcon from "@/components/icon/truck";

export default function OrderProgress({
  status,
  cancelReason,
}: {
  status: string;
  cancelReason: string;
}) {
  // Map status to display text
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "new":
        return "Processing";
      case "processing":
      case "assigning_driver":
        return "Preparing";
      case "picked_up":
        return "Delivery in progress";
      case "completed":
        return "Delivered";
      case "canceled":
        return "Merchant Canceled";
      default:
        return status;
    }
  };

  // Define the order flow
  const statusOrder = ["new", "processing", "picked_up", "completed"];

  // Normalize status for flow tracking
  const normalizedStatus =
    status === "assigning_driver" ? "processing" : status;
  const currentStatusIndex = statusOrder.indexOf(normalizedStatus);
  const isCanceled = status === "canceled";

  const progressSteps = [
    {
      icon: PaymentIcon,
      status: "new",
      active: isCanceled ? true : currentStatusIndex >= 0,
      completed: isCanceled ? false : currentStatusIndex > 0,
      canceled: isCanceled,
    },
    {
      icon: HourGlassIcon,
      status: "processing",
      active: isCanceled ? false : currentStatusIndex >= 1,
      completed: isCanceled ? false : currentStatusIndex > 1,
      canceled: false,
    },
    {
      icon: TruckIcon,
      status: "picked_up",
      active: isCanceled ? false : currentStatusIndex >= 2,
      completed: isCanceled ? false : currentStatusIndex > 2,
      canceled: false,
    },
    {
      icon: CheckCircleIcon,
      status: "completed",
      active: isCanceled ? false : currentStatusIndex >= 3,
      completed: isCanceled ? false : currentStatusIndex >= 3,
      canceled: false,
    },
  ];
  return (
    <>
      <p
        className={cn("text-[1.25rem] font-semibold mb-6 h-5", {
          "text-red-500": isCanceled,
          "text-primary": !isCanceled,
        })}
      >
        {getStatusDisplay(status)}
      </p>
      {cancelReason && <p className="text-sm">{cancelReason}</p>}
      <div className="flex items-center justify-between px-4 pb-4">
        {progressSteps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div>
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center relative",
                      {
                        "bg-primary/10": step.active && !step.canceled,
                        "bg-red-100": step.canceled,
                        "bg-gray-100": !step.active && !step.canceled,
                      }
                    )}
                  >
                    <IconComponent
                      fill={
                        step.canceled
                          ? "#ef4444"
                          : step.active
                            ? "#0055dd"
                            : "#BDC5DB"
                      }
                    />
                    {step.completed && !step.canceled && (
                      <div className="w-3 h-3 rounded-full bg-[#FF66CC] absolute bottom-2 right-2 grid place-content-center text-white">
                        <Check className="w-2 h-2" />
                      </div>
                    )}
                    {step.canceled && (
                      <div className="w-3 h-3 rounded-full bg-red-500 absolute bottom-2 right-2 grid place-content-center text-white">
                        <X className="w-2 h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {index < progressSteps.length - 1 && (
                <div
                  className={cn("flex-1 h-1 bg-gray-200", {
                    "bg-primary": step.completed && !isCanceled,
                    "bg-red-200": isCanceled && index === 0,
                    "animate-pulse bg-primary/80":
                      step.active && !step.completed && !step.canceled,
                  })}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
}
