"use client";

import React from "react";
import Image from "next/image";
import { signOut } from "@/services/auth/signout";
import { useGlobalState } from "@/store";

import { JSBridge } from "@/lib/js-bridge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "../ui/button";

export default function CloseDialog() {
  const isCloseMiniApp = useGlobalState((state) => state.isCloseMiniApp);
  const setIsCloseMiniApp = useGlobalState((state) => state.setIsCloseMiniApp);

  const handleClose = async () => {
    await signOut();
    JSBridge.call("closeMiniApp", "{}");
  };

  return (
    <Dialog open={isCloseMiniApp}>
      <DialogContent
        className="max-w-full w-96 rounded-3xl"
        showCloseButton={true}
      >
        <DialogHeader className="hidden">
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="h-10 w-[5.875rem] relative mx-auto">
            <Image
              src={"/assets/logo.png"}
              alt="logo"
              fill
              sizes="94px"
              priority
            />
          </div>
          <h1 className="text-center">Are you sure you want to close HIVE?</h1>
          <div className="space-y-2">
            <Button
              className="block w-full rounded-full h-14 text-lg"
              onClick={() => {
                handleClose();
              }}
            >
              Close
            </Button>
            <Button
              className="block w-full rounded-full h-14 text-lg text-primary bg-[#0055DD1A]"
              variant={"outline"}
              onClick={() => setIsCloseMiniApp(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
