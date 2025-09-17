import React from "react";

export default function OrderAddonDetail({ text }: { text: string }) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const combined = [];
  let currentLabel = "";

  for (const line of lines) {
    if (line.startsWith("-")) {
      // It's a label line
      currentLabel = line.replace("-", "").replace(":", "").trim();
    } else {
      // It's a value line, combine it
      const value = line.replace("•", "").replace("1x", "").trim();
      combined.push(`${currentLabel}: ${value}`);
    }
  }

  return (
    <div className="">
      <div className="s text-gray-700 font-sans flex flex-col lg:flex-row lg:divide-x lg:gap-2">
        {combined.map((line, i) => (
          <p key={i} className="pr-2">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
