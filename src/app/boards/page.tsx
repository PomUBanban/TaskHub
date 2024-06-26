"use client";
import Boards from "@/components/Boards";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const [boards, setBoards] = React.useState([]);
  const router = useRouter();
  const [organizations, setOrganizations] = React.useState([]);
  useEffect(() => {
    fetch("/api/users/organizations", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrganizations(
          //@ts-ignore
          data.organizationsMemberships.map((org) => org.organization),
        );
      });
  }, []);

  return (
    <div className="flex min-w-screen items-center justify-center">
      <div className="flex w-[90vw] m-5 p-5 flex-col ">
        <div className="mb-10">
          <button
            className="p-4 bg-blue-300 rounded-xl"
            onClick={() => router.push("/organizations/create")}
          >
            Creer une organisation
          </button>
        </div>
        <div className="flex flex-col gap-10">
          {organizations.map((org: any) => (
            <Boards key={org.id} organisation={org} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
