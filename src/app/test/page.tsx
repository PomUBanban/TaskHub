"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const Page: React.FC = () => {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });
  if (status === "loading") {
    return "Loading or not authenticated...";
  }

  return "User is logged in";
};

export default Page;
