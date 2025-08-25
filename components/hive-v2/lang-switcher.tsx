import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LangSwitcher({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("language");
  const pathname = usePathname();
  const params = useParams();
  const { locale } = params;
  const locales = ["kh", "en"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className=" cursor-pointer outline-none">
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((value, index) => {
          return (
            <DropdownMenuItem
              className={cn("locale-item hover:rounded-full", {
                "bg-[#EBEFF7] rounded-full": locale === value,
              })}
              key={index}
            >
              <Link
                href={`/${value}` + pathname}
                className="flex items-center gap-2"
              >
                <Image
                  src={t(`flag${value.toUpperCase()}`)}
                  alt="english flag"
                  width={20}
                  height={20}
                />
                {t(`${value}`)}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
