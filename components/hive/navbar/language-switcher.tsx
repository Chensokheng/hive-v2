"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LOCALE } from "@/constants";
import { usePathname } from "@/i18n/navigation";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Flag from "./flag";

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const { locale } = params;

  return (
    <Popover>
      <PopoverTrigger>
        <RenderFlag
          alwaysDisplay={false}
          className="flex gap-2 items-center bg-[#EBEFF7] px-2 py-2 md:py-1 rounded-full cursor-pointer"
          locale={locale as string}
        />
      </PopoverTrigger>
      <PopoverContent className="rounded-xl w-42 p-2 space-y-2">
        {LOCALE.map((value, index) => {
          return (
            <Link
              href={`/${value}` + pathname}
              key={index}
              className="rounded-full w-full p-1 cursor-pointer"
            >
              <RenderFlag
                alwaysDisplay={true}
                className={cn(
                  "flex items-center gap-2 bg-transparent w-full p-1",
                  {
                    "bg-[#EBEFF7] rounded-full": value === locale,
                  }
                )}
                locale={value}
              />
            </Link>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

const RenderFlag = ({
  locale,
  className,
  alwaysDisplay,
}: {
  locale: string;
  className?: string;
  alwaysDisplay: boolean;
}) => {
  switch (locale) {
    case "en":
      return (
        <Flag
          alwaysDisplay={alwaysDisplay}
          className={className}
          src="/assets/en-flag.png"
          text="English"
        />
      );
    case "kh":
      return (
        <Flag
          alwaysDisplay={alwaysDisplay}
          className={className}
          src="/assets/kh-flag.png"
          text="Khmer"
        />
      );
  }
};
