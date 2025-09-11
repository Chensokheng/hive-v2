import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";

export default function OtpCountDown() {
  const authInfo = useAuthStore((state) => state.authInfo);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const setIsResendOtp = useAuthStore((state) => state.setIsResendOtp);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const nextAvailableTime = authInfo.authNextAvailableOtpAt;
      const remaining = Math.max(0, nextAvailableTime - now);
      if (remaining <= 0) {
        setIsResendOtp(true);
      }
      setTimeRemaining(remaining);
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [authInfo.authNextAvailableOtpAt]);

  // Format time as MM:SS
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Don't show countdown if time has expired
  if (timeRemaining <= 0) {
    return null;
  }

  return (
    <div>
      <h1 className="text-[#303D5599]">
        Resend OTP {formatTime(timeRemaining)}
      </h1>
    </div>
  );
}
