"use server";

import { cookies } from "next/headers";

export const signOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};
