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
