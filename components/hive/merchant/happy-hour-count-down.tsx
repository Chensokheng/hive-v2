import React, { useEffect, useState } from "react";

function parseTimeStringToToday(timeString: string): number {
  // Supports "HH:mm". Falls back to Date parsing for ISO strings.
  const hhmmMatch = /^\d{1,2}:\d{2}$/.test(timeString);
  if (hhmmMatch) {
    const [hoursStr, minutesStr] = timeString.split(":");
    const hours = Number(hoursStr);
    const minutes = Number(minutesStr);
    const now = new Date();
    const candidate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0,
      0
    );
    return candidate.getTime();
  }

  const parsed = new Date(timeString);
  return parsed.getTime();
}

export default function HappyHourCountDown({
  startTime,
  endTime,
}: {
  startTime: string;
  endTime: string;
}) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [status, setStatus] = useState<"start" | "end" | "expired">("start");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const start = parseTimeStringToToday(startTime);
      const end = parseTimeStringToToday(endTime);

      let targetTime: number;
      let newStatus: "start" | "end" | "expired";

      if (now < start) {
        // Before start time - countdown to start
        targetTime = start;
        newStatus = "start";
      } else if (now < end) {
        // Between start and end - countdown to end
        targetTime = end;
        newStatus = "end";
      } else {
        // After end time - expired
        newStatus = "expired";
        setTimeLeft("Expired");
        setStatus(newStatus);
        return;
      }

      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft("0d 0h 0m 0s");
        setStatus(newStatus);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      setStatus(newStatus);
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (status === "expired") {
    return <div className="text-[#EC0000] font-medium">Expired</div>;
  }

  const prefix = status === "start" ? "Start In:" : "End In:";

  return (
    <div className="text-[#EC0000] font-medium">
      {prefix} {timeLeft}
    </div>
  );
}
