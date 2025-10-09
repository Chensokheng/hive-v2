import React from "react";
import { AsyncImage } from "loadable-image";
import { Blur } from "transitions-kit";

import useGetUserInfo from "@/hooks/use-get-user-info";

export default function ProfileImage({ className }: { className: string }) {
  const { data } = useGetUserInfo();

  return (
    <div className={className}>
      <AsyncImage
        src={data?.image || ""}
        Transition={Blur}
        style={{
          width: "100%",
          height: "100%",
        }}
        className="object-center object-cover rounded-full"
        loader={<div className="bg-gray-300" />}
        alt={"proifle"}
      />
    </div>
  );
}
