"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AuthForm from "./auth-form";

export default function AuthDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger id="auth-trigger-dialog">{children}</DialogTrigger>
      <DialogContent
        className=" max-w-full lg:max-w-[894px] p-0 rounded-none lg:rounded-xl border-none overflow-hidden shadow-none"
        showCloseButton={false}
      >
        <DialogHeader className="hidden">
          <DialogTitle>Create HIVE account</DialogTitle>
          <DialogDescription>Create HIVE account</DialogDescription>
        </DialogHeader>
        <AuthForm />
      </DialogContent>
    </Dialog>
  );
}
