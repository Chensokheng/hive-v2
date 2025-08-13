"use client";

import React, { useTransition } from "react";
import { useParams } from "next/navigation";
import { LOCALE } from "@/constants";
import { usePathname, useRouter } from "@/i18n/navigation";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";
import Flag from "./flag";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { locale } = params;

  const handleLangChange = (locale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: locale }
      );
    });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <RenderFlag
          className="flex gap-2 items-center bg-[#EBEFF7] px-2 py-2 rounded-full cursor-pointer"
          locale={locale as string}
        />
      </PopoverTrigger>
      <PopoverContent className="rounded-xl w-42 p-2 space-y-2">
        {LOCALE.map((value, index) => {
          return (
            <Button
              variant={"ghost"}
              key={index}
              onClick={() => handleLangChange(value)}
              className="rounded-full w-full p-1 cursor-pointer"
            >
              <RenderFlag
                className={cn(
                  "flex items-center gap-2 bg-transparent w-full p-1",
                  {
                    "bg-[#EBEFF7] rounded-full": value === locale,
                  }
                )}
                locale={value}
              />
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

const RenderFlag = ({
  locale,
  className,
}: {
  locale: string;
  className?: string;
}) => {
  switch (locale) {
    case "en":
      return (
        <Flag className={className} src="/assets/en-flag.png" text="English" />
      );
    case "kh":
      return (
        <Flag className={className} src="/assets/en-flag.png" text="Khmer" />
      );
  }
};
