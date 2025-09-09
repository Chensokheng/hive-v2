import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

import { cn } from "@/lib/utils";

interface BlurImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  containerClassName?: string;
  aspectRatio?: string;
}

export default function BlurImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = "aspect-w-1 aspect-h-1",
  ...props
}: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={src}
      alt={alt}
      className={cn(
        "duration-700 ease-in-out group-hover:opacity-75",
        isLoading
          ? "scale-105 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0",
        className
      )}
      onLoad={() => setLoading(false)}
      {...props}
    />
  );
}
