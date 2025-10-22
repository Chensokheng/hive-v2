import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (image: string) => {
  return process.env.NEXT_PUBLIC_IMAGE_URL + image;
};

export const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);

  // Options for formatting
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Phnom_Penh", // your local timezone
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  // Format the date
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const finalDate = formattedDate.replace(",", "");
  return finalDate;
};

export const renderStatus = (status: string) => {
  switch (status) {
    case "new":
      return "waiting for merchant to confo";
    case "completed":
      return "completed";
    case "canceled":
      return "canceled";
    default:
      return status;
  }
};

export const getGoogleMapLocation = (lat: number, long: number) => {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${long}`;
};

// Format phone number into groups separated by spaces.
// Expected behavior (Cambodia local style):
// - Input digits only (other chars stripped)
// - Keep leading 0 if user types it
// - Group as 3-3-3 or 3-3-4 as user types: e.g. 096422111 -> "096 422 111", 0964221111 -> "096 422 1111"
export const formatPhoneWithSpaces = (raw: string) => {
  // Keep only digits
  const digitsOnly = (raw || "").replace(/\D+/g, "");

  if (!digitsOnly) return "";

  // Build groups of 3,3,rest (rest can be 0-4)
  const part1 = digitsOnly.slice(0, 3);
  const part2 = digitsOnly.slice(3, 6);
  const part3 = digitsOnly.slice(6, 10); // allow up to 4 digits in the last group

  const parts = [part1, part2, part3].filter(Boolean);
  return parts.join(" ");
};
