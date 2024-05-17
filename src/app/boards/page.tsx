import Boards from "@/components/Boards";
import React from "react";

const Page: React.FC = () => {
  /* Replace hard coded name by variable */
  return (
    <div className="flex min-w-screen items-center justify-center">
      <div className="flex w-[90vw] m-5 p-5 flex-col">
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
  );
};

export default Page;
