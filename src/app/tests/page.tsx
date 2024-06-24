"use client";
import React from "react";

const Page: React.FC = () => {
  const testPages = [
    {
      name: "Boards",
      path: "/tests/boards",
    },
    {
      name: "Organizations",
      path: "/tests/organizations",
    },
  ];

  // Show a list of test pages sorted by name and displayed as buttons in a grid
  return (
    //  center the buttons
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Test Pages</h1>
      <div>
        {testPages.map((page) => (
          <button
            key={page.path}
            onClick={() => window.location.assign(page.path)}
          >
            {page.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Page;
