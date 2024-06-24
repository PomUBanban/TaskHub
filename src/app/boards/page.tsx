"use client";
import Boards from "@/components/Boards";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
  const [boards, setBoards] = React.useState([]);
  const router = useRouter();
  useEffect(() => {
    fetch("/api/boards", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, []);
  //TODO chercher dans quel organisation apparait l'utilisateur connecter et lui afficher les boards de cette organisation
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
        <div>

          <Boards
            organisation={{
              name: "Organisation name",
              logo_id: 1,
              id: 1,
              owner_id: 1,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
