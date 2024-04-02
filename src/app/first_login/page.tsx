"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { Session } from "@/types";

const Page: React.FC = () => {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });
  const session = data as unknown as Session;
  // TODO: finish first login page
  if (session.user.first_connection) return "Loading or not authenticated...";
  return (window.location.href = "/");
};

export default Page;
