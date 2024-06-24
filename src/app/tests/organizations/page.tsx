"use client";
import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { Organizations, Users, Images } from "@prisma/client";

const Page: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organizations[]>([]);

  // Get all the organizations
  const [logos, setLogos] = useState<Images[] | null>(null);
  const [users, setUsers] = useState<Users[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [updatedOrganization, setUpdatedOrganization] =
    useState<Organizations | null>(organizations[0]);
  const [newOrganization, setNewOrganization] = useState({
    name: "",
    owner_id: 0,
    logo_id: 0,
  });

  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch the organizations (status: ${res.status}, message: ${res.body?.toString()})`,
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
        setLogos(images);
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
        const createOrganizationForm = document.getElementById(
          "create-organization-form",
        ) as HTMLFormElement;
        if (!createOrganizationForm) {
          setError("Failed to get the form");
          return;
        }
        const formData = new FormData(createOrganizationForm);
        const newOrganization = {
          name: formData.get("name") as string,
          owner_id: +formData.get("owner_id")!,
          logo_id: +formData.get("logo_id")!,
        };
        console.log(newOrganization);
        // Make a POST request to create a new organization
        fetch("/api/organizations", {
          method: "POST",
          body: JSON.stringify({
            name: newOrganization?.name,
            owner_id: newOrganization?.owner_id,
            logo_id: newOrganization?.logo_id,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to create the organization (status: ${res.status}, message: ${res.body?.toString()})`,
              );
            }
            return res.json();
          })
          .then((newOrganization) =>
            setOrganizations([...organizations, newOrganization]),
          )
          .catch((error) => setError(error.toString()));
        break;
      case "update":
        const updateOrganizationForm = document.getElementById(
          "update-organization-form",
        ) as HTMLFormElement;
        if (!updateOrganizationForm) {
          setError("Failed to get the form");
          return;
        }
        const updateFormData = new FormData(updateOrganizationForm);
        const updateId = +updateFormData.get("id")!;
        const updatedOrganization = {
          name: updateFormData.get("name") as string,
          owner_id: +updateFormData.get("owner_id")!,
          logo_id: +updateFormData.get("logo_id")!,
        };
        console.log(updatedOrganization);
        // Make a PUT request to update the organization
        fetch(`/api/organizations/${updateId}`, {
          method: "PUT",
          body: JSON.stringify({
            name: updatedOrganization?.name,
            owner_id: updatedOrganization?.owner_id,
            logo_id: updatedOrganization?.logo_id,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to update the organization (status: ${res.status}, message: ${res.body?.toString()})`,
              );
            }
            return res.json();
          })
          .then((updatedOrganization) =>
            setOrganizations(
              organizations.map((organization) =>
                organization.id === updateId
                  ? { ...organization, ...updatedOrganization }
                  : organization,
              ),
            ),
          )
          .catch((error) => setError(error.toString()));
        break;
      case "delete":
        const deleteOrganizationForm = document.getElementById(
          "delete-organization-form",
        ) as HTMLFormElement;
        if (!deleteOrganizationForm) {
          setError("Failed to get the form");
          return;
        }
        const deleteFormData = new FormData(deleteOrganizationForm);
        const deleteId = +deleteFormData.get("id")!;
        // Make a DELETE request to delete the organization
        fetch(`/api/organizations/${deleteId}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to delete the organization (status: ${res.status}, message: ${res.body?.toString()})`,
              );
            }
            return res.json();
          })
          .then(() => {
            setOrganizations(
              organizations.filter(
                (organization) => organization.id !== deleteId,
              ),
            );
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

      <h1 className="text-2xl font-bold">Test Page for the organizations</h1>

      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {/* Create */}
        <div className="flex flex-col items-center bg-blue-200 p-4">
          <h2 className="text-xl">Create</h2>
          {/* Creation form */}
          <form
            id="create-organization-form"
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCRUD("create");
            }}
          >
            <label htmlFor="name">Name</label>
            <input
              onChange={(e) =>
                setNewOrganization({ ...newOrganization, name: e.target.value })
              }
              type="text"
              id="name"
              name="name"
              placeholder="Organization name"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            />

            <label htmlFor="owner_id">Owner</label>
            <select
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  owner_id: +e.target.value,
                })
              }
              id="owner_id"
              name="owner_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {users ? (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.id}: {user.first_name}
                  </option>
                ))
              ) : (
                <option value="0">No users found</option>
              )}
            </select>

            <label htmlFor="logo_id">Logo ID</label>
            <select
              onChange={(e) =>
                setNewOrganization({
                  ...newOrganization,
                  logo_id: +e.target.value,
                })
              }
              id="logo_id"
              name="logo_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {logos ? (
                logos.map((logo) => (
                  <option key={logo.id} value={logo.id}>
                    {logo.id}
                  </option>
                ))
              ) : (
                <option value="0">No logos found</option>
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
          {/* Table containing all the organizations */}
          <table
            className="border-collapse border border-green-800 text-black w-full"
            style={{ width: "100%" }}
          >
            <thead>
              <tr>
                <th className="border border-green-600">ID</th>
                <th className="border border-green-600">Name</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((organization) => (
                <tr key={organization.id}>
                  <td className="border border-green-600 p-2 text-center">
                    {organization.id}
                  </td>
                  <td className="border border-green-600 p-2 text-center">
                    {organization.name}
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
            id="update-organization-form"
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
                setUpdatedOrganization(
                  organizations.filter(
                    (organization) => organization.id === id,
                  )[0],
                );
              }}
              id="id"
              name="id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.id}: {organization.name}
                </option>
              ))}
            </select>

            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              placeholder={updatedOrganization?.name}
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            />

            <label htmlFor="owner_id">Owner</label>
            <select
              id="owner_id"
              name="owner_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {users ? (
                users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                    selected={user.id === updatedOrganization?.owner_id}
                  >
                    {user.id}: {user.first_name}
                  </option>
                ))
              ) : (
                <option value="0">No users found</option>
              )}
            </select>

            <label htmlFor="logo_id">Logo ID</label>
            <select
              id="logo_id"
              name="logo_id"
              className="text-black border border-gray-400 w-full p-1 rounded color-gray-800"
            >
              {logos ? (
                logos.map((logo) => (
                  <option
                    key={logo.id}
                    value={logo.id}
                    selected={logo.id === updatedOrganization?.logo_id}
                  >
                    {logo.id}
                  </option>
                ))
              ) : (
                <option value="0">No logos found</option>
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
            id="delete-organization-form"
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
              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.id}: {organization.name}
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
