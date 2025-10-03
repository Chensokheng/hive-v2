"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/navigation";
import { useGlobalState } from "@/store";
import { ChevronLeft, X } from "lucide-react";

import { JSBridge } from "@/lib/js-bridge";

export default function MiniNavbar() {
  const jsBridgeStatus = useGlobalState((state) => state.jsBridgeStatus);
  const patname = usePathname();

  const renderPaths = ["/", "/stores"];

  const isHistory = patname === "/history";

  const handleCloseApp = () => {
    JSBridge.call("closeMiniApp", "{}");
  };

  if (!renderPaths.includes(patname)) {
    return (
      <>
        {jsBridgeStatus === "success" && (
          <>
            <nav
              className="fixed -top-16 w-full bg-white  h-28 flex items-center justify-between "
              style={{
                zIndex: "40",
              }}
            ></nav>

            {isHistory && <div className="h-10 w-full"></div>}
          </>
        )}
      </>
    );
  }

  return (
    <>
      {jsBridgeStatus === "success" && (
        <>
          <nav
            className="fixed -top-16 w-full bg-white  h-28 flex items-center justify-between "
            style={{
              zIndex: "100",
            }}
          ></nav>
          <div
            className=" fixed top-0 right-0 w-full flex items-center justify-between px-5"
            style={{
              zIndex: 1000,
            }}
          >
            <ChevronLeft onClick={handleCloseApp} />

            <Image
              src={"/assets/logo.png"}
              alt="logo"
              width={44}
              height={74}
              priority
            />
            <X />
          </div>
          <div className="h-10 w-full"></div>
        </>
      )}
    </>
  );
}
