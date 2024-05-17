"use client";
import React, { useState, useEffect } from "react";
import { Organizations, Users, Images } from "@prisma/client"; // Component to display errors
import { Boards } from "@/types";

interface Org extends Organizations {
  owner: Users;
  logo: Images;
  members: Users[];
}

const Page = () => {
  const [boards, setBoards] = useState<Boards[]>([]);
  const [organizations, setOrganizations] = useState<Org[]>([]);
  const [icon, setIcon] = useState<Images[]>([]);
  const [background, setBackground] = useState<Images[]>([]);
  const [newBoard, setNewBoard] = useState({
    name: "",
    organization_id: "",
    organization: "",
    icon_id: "",
    icon: "",
    background_id: "",
    background: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/boards");
      const data = await response.json();
      setBoards(data);
    };

    const fetchOrgData = async () => {
      const response = await fetch("/api/organizations");
      const data = await response.json();
      setOrganizations(data);
    };

    fetchData();
    fetchOrgData();
  });

  const handleCRUD = async (action: string) => {
    switch (action) {
      case "create":
        const newBoardDataWithInt = {
          ...newBoard,
          organization_id: parseInt(newBoard.organization_id),
          icon_id: parseInt(newBoard.icon_id),
          background_id: parseInt(newBoard.background_id),
        };

        await fetch("/api/boards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBoardDataWithInt),
        });

        const response = await fetch("/api/boards");
        const data = await response.json();

        setBoards(data);
        setNewBoard({
          name: "",
          organization_id: "",
          organization: "",
          icon_id: "",
          icon: "",
          background_id: "",
          background: "",
        });
        break;

      case "read":
        break;
      case "update":
        break;
      case "delete":
        break;
      default:
        break;
    }
  };

  return (
    <div className="page-container">
      <div className="grid-container">
        <div className="grid-item">
          <h1>GET</h1>
          <div>
            {boards.map((board) => (
              <div key={board.id}>
                <h3>{board.name}</h3>
                <p>Org : {board.organization.name}</p>
                <p>Icon : {board.icon.raw_image}</p>
                <p>Background : {board.background.raw_image}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid-item">
          <h1>POST</h1>
          <input
            type="text"
            placeholder="Name"
            value={newBoard.name}
            onChange={(e) => setNewBoard({ ...newBoard, name: e.target.value })}
          />
          <select
            value={newBoard.organization_id}
            onChange={(e) =>
              setNewBoard({ ...newBoard, organization_id: e.target.value })
            }
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Add some styles */}
      <style jsx>{`
        .page-container {
          padding: 20px;
        }

        .grid-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 20px;
        }

        .grid-item {
          background-color: orange;
          padding: 20px;
          border-radius: 10px;
        }

        .row {
          margin-bottom: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }

        input,
        select {
          display: block;
          margin-bottom: 10px;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default Page;
