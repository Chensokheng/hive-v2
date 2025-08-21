import React from "react";

export default function CheckCircleIcon({ fill }: { fill?: string }) {
  return (
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.1929 1.31437C15.8475 1.91375 15.8923 2.93035 15.2929 3.58501L7.05281 12.585C6.74662 12.9194 6.31342 13.109 5.86 13.1069C5.40658 13.1048 4.97515 12.9112 4.67208 12.574L0.697917 8.15168C0.104631 7.49149 0.158864 6.47535 0.81905 5.88206C1.47924 5.28878 2.49538 5.34301 3.08866 6.0032L5.87854 9.10767L12.9222 1.41445C13.5216 0.759796 14.5382 0.714988 15.1929 1.31437Z"
        fill={fill}
      />
    </svg>
  );
}
