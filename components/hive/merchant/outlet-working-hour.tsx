import React, { useEffect } from "react";
import { useOutletStore } from "@/store/outlet";
import { useTranslations } from "next-intl";

import useGetOutletInfo from "@/hooks/use-get-outlet-info";
import useGetUserInfo from "@/hooks/use-get-user-info";
import { Skeleton } from "@/components/ui/skeleton";
import ClockIcon from "@/components/icon/clock";

type WorkingHours = {
  [key: string]: {
    order: number;
    close: boolean;
    time_interval: string;
  };
};

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// Utility function to parse time string (e.g., "09:30" -> { hours: 9, minutes: 30 })
const parseTime = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return { hours, minutes };
};

// Convert time to minutes for easier comparison
const timeToMinutes = (hours: number, minutes: number) => {
  return hours * 60 + minutes;
};

// Check if outlet is currently open
const isOutletOpen = (workingHours: WorkingHours) => {
  const now = new Date();
  const currentDay = dayKeys[now.getDay()];
  const currentTime = timeToMinutes(now.getHours(), now.getMinutes());

  const todayHours = workingHours[currentDay];

  if (!todayHours || todayHours.close) {
    return { isOpen: false, nextOpenTime: null, closingTime: null };
  }

  // Parse time interval (e.g., "09:30 - 22:00")
  const timeInterval = todayHours.time_interval.split(" - ");
  if (timeInterval.length !== 2) {
    return { isOpen: false, nextOpenTime: null, closingTime: null };
  }

  const openTime = parseTime(timeInterval[0]);
  const closeTime = parseTime(timeInterval[1]);

  const openMinutes = timeToMinutes(openTime.hours, openTime.minutes);
  const closeMinutes = timeToMinutes(closeTime.hours, closeTime.minutes);

  // Handle case where closing time is next day (e.g., 00:30 - 24:00)
  if (closeTime.hours === 24 || (closeTime.hours === 0 && openTime.hours > 0)) {
    // Special case for 24:00 or overnight operations
    const adjustedCloseMinutes =
      closeTime.hours === 24 ? 24 * 60 : closeMinutes;
    const isOpen =
      currentTime >= openMinutes ||
      (closeTime.hours === 0 && currentTime <= closeMinutes);

    if (closeTime.hours === 24) {
      // Open until midnight
      const isOpen = currentTime >= openMinutes;
      return {
        isOpen,
        nextOpenTime: isOpen ? null : timeInterval[0],
        closingTime: isOpen
          ? closeTime.hours === 24
            ? "24:00"
            : timeInterval[1]
          : null,
      };
    } else {
      return {
        isOpen,
        nextOpenTime: isOpen ? null : timeInterval[0],
        closingTime: isOpen ? timeInterval[1] : null,
      };
    }
  } else if (closeMinutes < openMinutes) {
    // Outlet is open overnight (crosses midnight)
    const isOpen = currentTime >= openMinutes || currentTime <= closeMinutes;
    return {
      isOpen,
      nextOpenTime: isOpen ? null : timeInterval[0],
      closingTime: isOpen ? timeInterval[1] : null,
    };
  } else {
    // Normal hours within the same day
    const isOpen = currentTime >= openMinutes && currentTime <= closeMinutes;
    return {
      isOpen,
      nextOpenTime: isOpen ? null : timeInterval[0],
      closingTime: isOpen ? timeInterval[1] : null,
    };
  }
};

// Get next opening time if currently closed
const getNextOpenTime = (workingHours: WorkingHours, t: any) => {
  const now = new Date();
  const currentDayIndex = now.getDay();

  // Check remaining days in the week
  for (let i = 0; i < 7; i++) {
    const dayIndex = (currentDayIndex + i) % 7;
    const dayKey = dayKeys[dayIndex];
    const dayHours = workingHours[dayKey];

    if (dayHours && !dayHours.close) {
      const timeInterval = dayHours.time_interval.split(" - ");
      if (timeInterval.length === 2) {
        const openTime = timeInterval[0];

        if (i === 0) {
          // Same day - check if opening time is later
          const currentTime = timeToMinutes(now.getHours(), now.getMinutes());
          const [openHours, openMinutes] = timeInterval[0]
            .split(":")
            .map(Number);
          const openTimeMinutes = timeToMinutes(openHours, openMinutes);

          if (openTimeMinutes > currentTime) {
            return { day: getDayName(dayKey, t), time: openTime };
          }
        } else {
          // Next day
          return { day: getDayName(dayKey, t), time: openTime };
        }
      }
    }
  }

  return null;
};

// Convert day key to readable name using translations
const getDayName = (dayKey: string, t: any) => {
  const dayMap: { [key: string]: string } = {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
  };
  return t(`workingHours.days.${dayMap[dayKey]}`);
};

// Format time for display (convert 24:00 to 12:00 AM, etc.)
const formatTime = (timeStr: string) => {
  if (timeStr === "24:00") return "12:00 AM";

  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export default function OutletWorkingHour({
  merchantName,
  outletName,
}: {
  merchantName: string;
  outletName: string;
}) {
  const { data: user } = useGetUserInfo();
  const { setIsClosed } = useOutletStore();

  const getSessionStorageValue = (key: string): number | null => {
    if (typeof window !== "undefined") {
      const value = sessionStorage.getItem(key);
      return value ? Number(value) : null;
    }
    return null;
  };
  const { data, isLoading } = useGetOutletInfo(
    merchantName,
    outletName,
    user?.latitude || getSessionStorageValue("lat") || 0,
    user?.longtitude || getSessionStorageValue("lng") || 0
  );
  const t = useTranslations();
  const workingHours = data?.data.working_hours;

  const { isOpen, closingTime } = isOutletOpen(workingHours || {});

  // Update the store with the current closed/open state
  useEffect(() => {
    setIsClosed(!isOpen);
     
  }, [isOpen, setIsClosed]);

  if (isLoading) {
    return <Skeleton className="w-[200px] h-5 bg-gray-300" />;
  }

  if (!workingHours) {
    return null;
  }

  const nextOpen = !isOpen ? getNextOpenTime(workingHours, t) : null;
  const currentDayName = getDayName(dayKeys[new Date().getDay()], t);

  return (
    <div className="flex items-center gap-2 flex-wrap text-sm">
      <ClockIcon />
      {isOpen ? (
        <>
          <span className="text-[#33CA55] font-medium">
            {t("workingHours.open")}
          </span>
          {closingTime && (
            <>
              <span className="text-[#303D5599]">-</span>
              <span className="text-[#303D5599]">
                {t("workingHours.closes")} {formatTime(closingTime)}
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <span className="text-[#FF6B6B] font-medium">
            {t("workingHours.closed")}
          </span>
          {nextOpen && (
            <>
              <span className="text-[#303D5599]">-</span>
              <span className="text-[#303D5599]">
                {t("workingHours.opens")}{" "}
                {nextOpen.day === currentDayName
                  ? t("workingHours.today")
                  : nextOpen.day}{" "}
                {formatTime(nextOpen.time)}
              </span>
            </>
          )}
        </>
      )}
    </div>
  );
}
