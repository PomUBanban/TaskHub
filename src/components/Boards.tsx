import { Organizations } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type props = {
  organisation: Organizations;
};

export default function Boards({ organisation }: props) {
  /* TODO: change boards name */
  const [isInputShown, setIsInputShown] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [boards, setBoards] = useState([]);
  const [needToRefresh, setNeedToRefresh] = useState(true);

  useEffect(() => {
    if (needToRefresh)
      fetch("/api/organizations/" + organisation.id + "/boards", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          setBoards(data);
          setNeedToRefresh(false);
        });
  }, [boards, needToRefresh]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <h1 className="text-3xl">{organisation.name}</h1>
        <div>
          {isInputShown && (
            <input
              onChange={(e) => setNewBoardName(e.target.value)}
              value={newBoardName}
              type="text"
              placeholder="Enter name"
              className="text-black p-4 rounded-xl"
            />
          )}
          <button
            className="text-xl p-4 bg-blue-500 rounded-xl"
            onClick={() => {
              setIsInputShown(!isInputShown);
              if (newBoardName != "") {
                console.log(newBoardName);
                setNewBoardName("");
                fetch("/api/boards", {
                  method: "POST",
                  body: JSON.stringify({
                    name: newBoardName,
                    organization_id: organisation.id,
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    // @ts-ignore
                    setBoards([...boards, data]);
                    setNeedToRefresh(true);
                  })
                  .catch((err) => console.log(err));
              }
            }}
          >
            Creer une board
          </button>
        </div>
      </div>
      <div className="bg-[#4D8DC4] min-h-[20vh] h-[20vh] flex w-full rounded-lg p-4 gap-5">
        {boards.length > 0 ? (
          boards.map((board: any) => (
            <Link
              key={board.id}
              className="flex flex-col w-[15%] items-center text-xl"
              href={"/boards/" + board.id}
            >
              <div className="flex bg-gray-500 aspect-[16/9] w-full rounded-lg justify-center items-center">
                Image
              </div>
              <div>{board.name}</div>
            </Link>
          ))
        ) : (
          <div className="flex h-full w-full justify-center text-center items-center">
            Il n'y a pas de board
          </div>
        )}
      </div>
    </div>
  );
}
