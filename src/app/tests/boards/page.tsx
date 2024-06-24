"use client";
import React, { useState, useEffect } from "react";
import ErrorMessage from "@/app/organizations/ErrorMessage";
import { Boards, Organizations, Users, Images } from "@prisma/client";

const Page: React.FC = () => {
  // Get all the boards
  const [organizations, setOrganizations] = useState<Organizations[] | null>(
    null,
  );
  const [backgrounds, setBackgrounds] = useState<Images[] | null>(null);
  const [icons, setIcons] = useState<Images[] | null>(null);
  const [users, setUsers] = useState<Users[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [boards, setBoards] = useState<Boards[]>([]);

  const [updatedBoard, setUpdatedBoard] = useState<Boards | null>(boards[0]);
  const [newBoard, setNewBoard] = useState({
    name: "",
    organization_id: 0,
    icon_id: 0,
    background_id: 0,
  });

  useEffect(() => {
    fetch("/api/boards")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch the boards (status: ${res.status}, message: ${res.body?.toString()})`,
          );
        }
        return res.json();
      })
      .then(setBoards)
      .catch((error) => setError(error.toString()));
    fetch("/api/organizations")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch the organizations (status: ${res.status}, message: ${res.body?.toString()}})`,
          );
        }
        return res.json();
      })
      .then(setOrganizations)
      .catch((error) => setError(error.toString()));
    fetch("/api/images")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch the images (status: ${res.status}, message: ${res.body?.toString()})`,
          );
        }
        return res.json();
      })
      .then((images) => {
        setBackgrounds(images);
        setIcons(images);
      })
      .catch((error) => setError(error.toString()));
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch the users (status: ${res.status}, message: ${res.body?.toString()})`,
          );
        }
        return res.json();
      })
      .then(setUsers)
      .catch((error) => setError(error.toString()));
  }, []);

  const handleCRUD = (event: string) => {
    switch (event) {
      case "create":
        const createBoardForm = document.getElementById(
          "create-board-form",
        ) as HTMLFormElement;
        if (!createBoardForm) {
          setError("Failed to get the form");
          return;
        }
        const formData = new FormData(createBoardForm);
        const newBoard = {
          name: formData.get("name") as string,
          organization_id: +formData.get("organization_id")!,
          icon_id: +formData.get("icon_id")!,
          background_id: +formData.get("background_id")!,
        };
        console.log(newBoard);
        // Make a POST request to create a new board
        fetch("/api/boards", {
          method: "POST",
          body: JSON.stringify({
            name: newBoard?.name,
            organization_id: newBoard?.organization_id,
            icon_id: newBoard?.icon_id,
            background_id: newBoard?.background_id,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to create the board (status: ${res.status}, message: ${res.body?.toString()})`,
              );
            }
            return res.json();
          })
          .then((newBoard) => setBoards([...boards, newBoard]))
          .catch((error) => setError(error.toString()));
        break;
      case "update":
        const updateBoardForm = document.getElementById(
          "update-board-form",
        ) as HTMLFormElement;
        if (!updateBoardForm) {
          setError("Failed to get the form");
          return;
        }
        const updateFormData = new FormData(updateBoardForm);
        const updateId = +updateFormData.get("id")!;
        const updatedBoard = {
          name: updateFormData.get("name") as string,
          icon_id: +updateFormData.get("icon_id")!,
          background_id: +updateFormData.get("background_id")!,
        };
        console.log(updatedBoard);
        // Make a PUT request to update the board
        fetch(`/api/boards/${updateId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: updatedBoard?.name,
            icon_id: updatedBoard?.icon_id,
            background_id: updatedBoard?.background_id,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to update the board (status: ${res.status}, message: ${res.body?.toString()})`,
              );
            }
            return res.json();
          })
          .then((updatedBoard) =>
            setBoards(
              boards.map((board) =>
                board.id === updateId ? { ...board, ...updatedBoard } : board,
              ),
            ),
          )
          .catch((error) => setError(error.toString()));
        break;
      case "delete":
        const deleteBoardForm = document.getElementById(
          "delete-board-form",
        ) as HTMLFormElement;
        if (!deleteBoardForm) {
          setError("Failed to get the form");
          return;
        }
        const deleteFormData = new FormData(deleteBoardForm);
        const deleteId = +deleteFormData.get("id")!;
        // Make a DELETE request to delete the board
        fetch(`/api/boards/${deleteId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to delete the board (status: ${res.status}, message: ${res.body?.toString()})`,
              );
            }
            return res.json();
          })
          .then(() => {
            setBoards(boards.filter((board) => board.id !== deleteId));
          })
          .catch((error) => setError(error.toString()));
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex flex-col items-center h-4/5">
      {error && <ErrorMessage message={error} />}

      <h1 className="text-2xl font-bold">Test Page for the boards</h1>

      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {/* Create */}
        <div className="flex flex-col items-center bg-blue-200 p-4">
          <h2 className="text-xl">Create</h2>
          {/* Creation form */}
          <form
            id="create-board-form"
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCRUD("create");
            }}
          >
            <label htmlFor="name">Name</label>
            <input
              onChange={(e) =>
                setNewBoard({ ...newBoard, name: e.target.value })
              }
              type="text"
              id="name"
              name="name"
              placeholder="Board name"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            />

            <label htmlFor="organization_id">Organization ID</label>
            <select
              onChange={(e) =>
                setNewBoard({ ...newBoard, organization_id: +e.target.value })
              }
              id="organization_id"
              name="organization_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {organizations ? (
                organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.id}: {organization.name}
                  </option>
                ))
              ) : (
                <option value="0">No organizations found</option>
              )}
            </select>

            <label htmlFor="icon_id">Icon ID</label>
            <select
              onChange={(e) =>
                setNewBoard({ ...newBoard, icon_id: +e.target.value })
              }
              id="icon_id"
              name="icon_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {icons ? (
                icons.map((icon) => (
                  <option key={icon.id} value={icon.id}>
                    {icon.id}
                  </option>
                ))
              ) : (
                <option value="0">No icons found</option>
              )}
            </select>

            <label htmlFor="background_id">Background ID</label>
            <select
              onChange={(e) =>
                setNewBoard({ ...newBoard, background_id: +e.target.value })
              }
              id="background_id"
              name="background_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {backgrounds ? (
                backgrounds.map((background) => (
                  <option key={background.id} value={background.id}>
                    {background.id}
                  </option>
                ))
              ) : (
                <option value="0">No backgrounds found</option>
              )}
            </select>

            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
            >
              Create
            </button>
          </form>
        </div>

        {/* Read */}
        <div className="flex flex-col items-center bg-green-200 p-4">
          <h2 className="text-xl">Read</h2>
          {/* Table containing all the boards */}
          <table
            className="border-collapse border border-green-800 text-black w-full"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th className="border border-green-600">ID</th>
                <th className="border border-green-600">Organization</th>
                <th className="border border-green-600">Name</th>
              </tr>
            </thead>
            <tbody>
              {boards.map((board) => (
                <tr key={board.id}>
                  <td className="border border-green-600 p-2 text-center">
                    {board.id}
                  </td>
                  <td className="border border-green-600 p-2 text-center">
                    {
                      organizations?.filter(
                        (organization) =>
                          organization.id === board.organization_id,
                      )[0].name
                    }
                  </td>
                  <td className="border border-green-600 p-2 text-center">
                    {board.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Update */}
        <div className="flex flex-col items-center bg-yellow-200 p-4">
          <h2 className="text-xl">Update</h2>
          <form
            id="update-board-form"
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCRUD("update");
            }}
          >
            <label htmlFor="id">ID</label>
            <select
              onChange={(e) => {
                const id = +e.target.value;
                setUpdatedBoard(boards.filter((board) => board.id === id)[0]);
              }}
              id="id"
              name="id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.id}: {board.name}
                </option>
              ))}
            </select>

            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder={updatedBoard?.name}
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            />

            <label htmlFor="icon_id">Icon ID</label>
            <select
              id="icon_id"
              name="icon_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {icons ? (
                icons.map((icon) => (
                  <option
                    key={icon.id}
                    value={icon.id}
                    selected={icon.id === updatedBoard?.icon_id}
                  >
                    {icon.id}
                  </option>
                ))
              ) : (
                <option value="0">No icons found</option>
              )}
            </select>

            <label htmlFor="background_id">Background ID</label>
            <select
              id="background_id"
              name="background_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {backgrounds ? (
                backgrounds.map((background) => (
                  <option
                    key={background.id}
                    value={background.id}
                    selected={background.id === updatedBoard?.background_id}
                  >
                    {background.id}
                  </option>
                ))
              ) : (
                <option value="0">No backgrounds found</option>
              )}
            </select>

            <button
              type="submit"
              className="bg-yellow-500 text-white font-bold py-2 px-4 rounded"
            >
              Update
            </button>
          </form>
        </div>

        {/* Delete */}
        <div className="flex flex-col items-center bg-red-200 p-4">
          <h2 className="text-xl">Delete</h2>
          <form
            id="delete-board-form"
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCRUD("delete");
            }}
          >
            <label htmlFor="id">ID</label>
            <select
              id="id"
              name="id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.id}: {board.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-red-500 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
