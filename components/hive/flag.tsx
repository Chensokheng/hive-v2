import React from "react";
import Image from "next/image";


export default function Flag({
  src,
  text,
  className,
}: {
  src: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Image src={src} alt="en-flag" width={30} height={30} />
      <span>{text}</span>
    </div>
  );
}
