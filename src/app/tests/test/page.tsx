"use client";
import React from "react";

const Page: React.FC = () => {
  return (
    <div className="flex flex-col items-center h-4/5">
      <h1 className="text-2xl font-bold">Test Page</h1>

      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {/* Create */}
        <div className="flex flex-col items-center bg-blue-200 p-4">
          <h2 className="text-xl">Create</h2>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
            Create
          </button>
        </div>

        {/* Read */}
        <div className="flex flex-col items-center bg-green-200 p-4">
          <h2 className="text-xl">Read</h2>
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded">
            Read
          </button>
        </div>

        {/* Update */}
        <div className="flex flex-col items-center bg-yellow-200 p-4">
          <h2 className="text-xl">Update</h2>
          <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </div>

        {/* Delete */}
        <div className="flex flex-col items-center bg-red-200 p-4">
          <h2 className="text-xl">Delete</h2>
          <button className="bg-red-500 text-white font-bold py-2 px-4 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
