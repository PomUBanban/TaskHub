"use client";
import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage";
import { Organizations, Users, Images } from "@prisma/client"; // Component to display errors

interface Org extends Organizations {
  owner: Users;
  logo: Images;
  members: Users[];
}

const Page = () => {
  const [organizations, setOrganizations] = useState<Org[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<null | Org>(null);
  const [users, setUsers] = useState<Users[]>([]);
  const [newOrgData, setNewOrgData] = useState({
    name: "",
    owner_id: "",
    logo_id: "",
    logo: "",
  });
  const [updatedOrgData, setUpdatedOrgData] = useState<Org | null>(null);
  const [newMember, setNewMember] = useState({
    user_id: "",
  });
  const [error, setError] = useState<null | string>(null); // New state to handle errors

  // Fetch organizations data on page load
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations");
        const data = await response.json();
        setOrganizations(data);

        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();
        setUsers(usersData);
      } catch (error) {
        setError("Erreur lors de la récupération des organisations"); // Handle data fetching errors
      }
    };

    fetchOrganizations();
  }, []);

  const handleCRUD = async (action: string) => {
    try {
      switch (action) {
        case "create":
          // Parse owner_id and logo_id to integers
          const newOrgDataWithIntegers = {
            ...newOrgData,
            owner_id: parseInt(newOrgData.owner_id),
            logo_id: parseInt(newOrgData.logo_id),
          };

          // Perform POST request using newOrgDataWithIntegers
          await fetch("/api/organizations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newOrgDataWithIntegers),
          });
          // Fetch updated organizations data after creating a new organization
          const response = await fetch("/api/organizations");
          const data = await response.json();
          setOrganizations(data);
          // Reset newOrgData after creating a new organization
          setNewOrgData({
            name: "",
            owner_id: "",
            logo_id: "",
            logo: "",
          });
          break;

        case "create-member":
          // Perform POST request using newMember and selectedOrg
          await fetch(`/api/organizations/${selectedOrg?.id}/members`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newMember),
          });
          // Fetch updated organizations data after adding a new member
          const memberResponse = await fetch("/api/organizations");
          const memberData = await memberResponse.json();
          setOrganizations(memberData);
          // Reset newMember after adding a new member
          setNewMember({
            user_id: "",
          });
          break;

        case "read":
          // No action needed for reading
          break;

        case "update":
          if (selectedOrg) {
            // Parse owner_id and logo_id to integers
            const updatedOrgDataWithIntegers = {
              ...updatedOrgData,
              owner_id: updatedOrgData?.owner_id,
              logo_id: updatedOrgData?.logo_id,
            };

            // Perform PUT request using selectedOrg and updatedOrgDataWithIntegers
            await fetch(`/api/organizations/${selectedOrg.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedOrgDataWithIntegers),
            });
            // Fetch updated organizations data after updating an organization
            const updatedResponse = await fetch("/api/organizations");
            const updatedData = await updatedResponse.json();
            setOrganizations(updatedData);
            // Reset updatedOrgData after updated organization
            setUpdatedOrgData(null);
          }
          break;

        case "delete":
          if (selectedOrg) {
            // Perform DELETE request using selectedOrg
            await fetch(`/api/organizations/${selectedOrg.id}`, {
              method: "DELETE",
            });
            // Fetch updated organizations data after deleting an organization
            const deletedResponse = await fetch("/api/organizations");
            const deletedData = await deletedResponse.json();
            setOrganizations(deletedData);
            // Clear selectedOrg after deletion
            setSelectedOrg(null);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      setError("Erreur lors de l'opération CRUD"); // Handle CRUD operation errors
    }
  };

  return (
    <div className="page-container">
      {/* Display an error message if any */}
      {error && <ErrorMessage message={error} />}
      <div className="grid-container">
        {/* Create a 2x2 grid with the 4 parts (CRUD) */}
        <div className="grid-item">
          <div>
            <h2>Liste des Organisations :</h2>
            <ul>
              {organizations.map((org) => (
                <li key={org.id}>
                  {org.name} <br />- Propriétaire :{" "}
                  {org.owner.first_name ?? org.owner.name} <br />- Logo :
                  {org.logo.raw_image ?? org.logo.id} <br />
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="grid-item">
          <div>
            <h2>Créer une Organisation :</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCRUD("create");
              }}
            >
              <div className="row">
                <label>Nom de l'organisation :</label>
                <input
                  type="text"
                  placeholder="Nom de l'organisation"
                  value={newOrgData.name}
                  onChange={(e) =>
                    setNewOrgData({ ...newOrgData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="row">
                <label>ID du propriétaire :</label>
                <input
                  type="text"
                  placeholder="ID du propriétaire"
                  value={newOrgData.owner_id}
                  onChange={(e) =>
                    setNewOrgData({ ...newOrgData, owner_id: e.target.value })
                  }
                  required
                />
              </div>
              <div className="row">
                <label>Logo :</label>
                <input
                  type="file"
                  value={newOrgData.logo}
                  onChange={(e) =>
                    setNewOrgData({ ...newOrgData, logo: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit">Créer</button>
            </form>
          </div>
        </div>
        <div className="grid-item">
          <div>
            <h2>Mettre à Jour une Organisation :</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCRUD("update");
              }}
            >
              <select
                value={selectedOrg ? selectedOrg.id : ""}
                onChange={(e) => {
                  const orgId = e.target.value;
                  const org = organizations.find(
                    (org) => org.id === parseInt(orgId),
                  );
                  if (org) setSelectedOrg(org);
                }}
              >
                <option value="">Sélectionner une Organisation</option>
                {organizations.map((org: Organizations) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>

              <div className="row">
                <label>Nouveau Nom de l'organisation :</label>
                <input
                  type="text"
                  placeholder="Nouveau Nom de l'organisation"
                  value={updatedOrgData?.name}
                  onChange={(e) =>
                    setUpdatedOrgData(
                      updatedOrgData
                        ? { ...updatedOrgData, name: e.target.value }
                        : null,
                    )
                  }
                />
              </div>
              <div className="row">
                <label>Nouvel ID du propriétaire :</label>
                <input
                  type="text"
                  placeholder="ID du nouveau propriétaire"
                  value={updatedOrgData?.owner_id}
                  onChange={(e) =>
                    setUpdatedOrgData(
                      updatedOrgData
                        ? {
                            ...updatedOrgData,
                            owner_id: parseInt(e.target.value),
                          }
                        : null,
                    )
                  }
                />
              </div>
              <div className="row">
                <label>Nouveau logo :</label>
                <input
                  type="file"
                  value={updatedOrgData?.logo_id}
                  onChange={(e) =>
                    setUpdatedOrgData(
                      updatedOrgData
                        ? {
                            ...updatedOrgData,
                            logo_id: parseInt(e.target.value),
                          }
                        : null,
                    )
                  }
                />
              </div>
              <button type="submit" disabled={!selectedOrg}>
                Mettre à Jour
              </button>
            </form>

            {/* Transfer ownership form, with a selector on the org members*/}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCRUD("update");
              }}
            >
              <br />
              <hr />
              <br />

              <div className="row">
                <h2>Transférer la propriété :</h2>

                <select
                  value={selectedOrg ? selectedOrg.id : ""}
                  onChange={(e) => {
                    const orgId = e.target.value;
                    const org = organizations.find(
                      (org) => org.id === parseInt(orgId),
                    );
                    if (org) setSelectedOrg(org);
                  }}
                >
                  <option value="">Sélectionner une Organisation</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row">
                <select
                  value={selectedOrg ? selectedOrg.owner_id : ""}
                  onChange={(e) =>
                    setUpdatedOrgData(
                      updatedOrgData
                        ? {
                            ...updatedOrgData,
                            owner_id: parseInt(e.target.value),
                          }
                        : null,
                    )
                  }
                >
                  <option value="">Sélectionner un nouveau propriétaire</option>
                  {selectedOrg &&
                    selectedOrg.members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.first_name ?? member.name}
                      </option>
                    ))}
                </select>
                <button type="submit" disabled={!selectedOrg}>
                  Transférer la propriété
                </button>
              </div>
            </form>

            <br />
            <hr />
            <br />

            {/* Add a new member form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCRUD("create-member");
              }}
            >
              {/* Add membars to an organization (POST /api/organization/[id]/members) */}
              <div className="row">
                <h2>Ajouter un membre :</h2>
                <select
                  value={selectedOrg ? selectedOrg.id : ""}
                  onChange={(e) => {
                    const orgId = e.target.value;
                    const org = organizations.find(
                      (org) => org.id === parseInt(orgId),
                    );
                    if (org) setSelectedOrg(org);
                  }}
                >
                  <option value="">Sélectionner une Organisation</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="row">
                <select
                  value={newMember.user_id}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      user_id: e.target.value,
                    })
                  }
                >
                  <option value="">Sélectionner un nouveau membre</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name ?? user.name}
                    </option>
                  ))}
                </select>
                <button type="submit" disabled={!selectedOrg}>
                  Ajouter un membre
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="grid-item">
          <div>
            <h2>Supprimer une Organisation :</h2>
            <select
              value={selectedOrg ? selectedOrg.id : ""}
              onChange={(e) => {
                const orgId = e.target.value;
                const org = organizations.find(
                  (org) => org.id === parseInt(orgId),
                );
                if (org) setSelectedOrg(org);
              }}
            >
              <option value="">Sélectionner une Organisation</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleCRUD("delete")}
              disabled={!selectedOrg}
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>

      {/* Show organizations json */}
      <h2>Organizations and Users JSON :</h2>
      <pre>{JSON.stringify(organizations, null, 2)}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre>

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
