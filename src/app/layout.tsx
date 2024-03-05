import { options } from "@/app/api/auth/[...nextauth]/option";
import SessionProvider from "@/components/SessionProvider";
import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import React from "react";

export const metadata: Metadata = {
  title: "TaskHub",
  description: "TaskHub is a task management app.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(options);
  return (
    <html lang="fr">
      <body className="w-screen min-h-screen h-fit flex">
        <SessionProvider session={session}>
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
