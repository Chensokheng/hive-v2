"use client";

import { useEffect } from "react";
import { useOutletStore } from "@/store/outlet";

import useGetUserInfo from "@/hooks/use-get-user-info";

export default function PendingActionHandler() {
  const { data: user, isLoading } = useGetUserInfo();
  const executePendingMenuAction = useOutletStore(
    (state) => state.executePendingMenuAction
  );
  const pendingMenuAction = useOutletStore((state) => state.pendingMenuAction);

  useEffect(() => {
    // Execute pending action when user becomes logged in and there's a pending action
    if (user?.userId && pendingMenuAction && !isLoading) {
      // Add a small delay to ensure the auth dialog is closed
      const timer = setTimeout(() => {
        executePendingMenuAction();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user?.userId, pendingMenuAction, isLoading, executePendingMenuAction]);

  return null;
}
