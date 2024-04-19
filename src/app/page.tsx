"use client";

import React from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Session } from "@/types";

export default function Page() {
  const { data } = useSession();
  const session = data as Session | null;
  if (session)
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/*
      <pre>{JSON.stringify(session, null, 2)}</pre>
        */}

        <div className="aspect-[4/4] object-cover relative w-72">
          <Image alt={"image"} src={session?.user.image_url} fill />
        </div>
      </div>
    );
  return <>Il faut etre connecte</>;
}
