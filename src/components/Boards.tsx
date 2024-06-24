import { Boards as BoardsType } from "../types";
import React from "react";

type props = {
  board: BoardsType;
};

export default function Boards({ board }: props) {
  return (
    <>
      <h1 className="text-3xl">{board.name}</h1>
      <div className="bg-[#4D8DC4] flex w-full rounded-lg p-4">
        <div className="flex flex-col w-[20%] items-center text-xl">
          {/* Include board icon if exists */}
          {board.icon_id ? (
            <img
              src={board.icon.raw_image}
              alt={board.icon.raw_image}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full text-4xl text-white">
              <span>📋</span>
            </div>
          )}
          <div>{board.name}</div>
        </div>
      </div>
    </>
  );
}
