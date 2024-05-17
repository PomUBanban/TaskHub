import { Organizations } from "@prisma/client";
import React from "react";

type props = {
  organisation: Organizations;
};

export default function Boards({ organisation }: props) {
  /* TODO: change boards name */
  return (
    <>
      <h1 className="text-3xl">{organisation.name}</h1>
      <div className="bg-[#4D8DC4] flex w-full rounded-lg p-4">
        <div className="flex flex-col w-[20%] items-center text-xl">
          <div className="flex bg-gray-500 aspect-[16/9] w-full rounded-lg justify-center items-center">
            {organisation.logo_id}
          </div>
          <div>{organisation.name}</div>
        </div>
      </div>
    </>
  );
}
