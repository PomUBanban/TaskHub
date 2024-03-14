"use client";
import React, { useState, useEffect } from "react";
import ErrorMessage from "./ErrorMessage"; // Component to display errors

const Page = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [newOrgData, setNewOrgData] = useState({
    name: "",
    owner_id: "",
    logo_id: "",
  });
  const [updatedOrgData, setUpdatedOrgData] = useState({
    name: "",
    owner_id: "",
    logo_id: "",
  });
  const [error, setError] = useState(null); // New state to handle errors

  // Fetch organizations data on page load
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch("/api/organizations");
        const data = await response.json();
        setOrganizations(data);
      } catch (error) {
        setError("Erreur lors de la récupération des organisations"); // Handle data fetching errors
      }
    };

    fetchOrganizations();
  }, []);

  const handleCRUD = async (action) => {
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
          });
          break;

        case "read":
          // Fetch organizations data (already done on page load)
          break;

        case "update":
          if (selectedOrg) {
            // Parse owner_id and logo_id to integers
            const updatedOrgDataWithIntegers = {
              ...updatedOrgData,
              owner_id: parseInt(updatedOrgData.owner_id),
              logo_id: parseInt(updatedOrgData.logo_id),
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
            setUpdatedOrgData({
              name: "",
              owner_id: "",
              logo_id: "",
            });

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
                  {org.name} - Propriétaire : {org.owner_id} - Logo : {org.logo_id}
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
              <label>ID du logo :</label>
              <input
                type="text"
                placeholder="ID du logo"
                value={newOrgData.logo_id}
                onChange={(e) =>
                  setNewOrgData({ ...newOrgData, logo_id: e.target.value })
                }
                required
              />
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
                    (org) => org.id === parseInt(orgId)
                  );
                  setSelectedOrg(org);
                }}
              >
                <option value="">Sélectionner une Organisation à Mettre à Jour</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              <label>Nouveau Nom de l'organisation :</label>
              <input
                type="text"
                placeholder="Nouveau Nom de l'organisation"
                value={updatedOrgData.name}
                onChange={(e) =>
                  setUpdatedOrgData({ ...updatedOrgData, name: e.target.value })
                }
              />
              <label>Nouvel ID du propriétaire :</label>
              <input
                type="text"
                placeholder="Nouvel ID du propriétaire"
                value={updatedOrgData.owner_id}
                onChange={(e) =>
                  setUpdatedOrgData({
                    ...updatedOrgData,
                    owner_id: e.target.value,
                  })
                }
              />
              <label>Nouvel ID du logo :</label>
              <input
                type="text"
                placeholder="Nouvel ID du logo"
                value={updatedOrgData.logo_id}
                onChange={(e) =>
                  setUpdatedOrgData({
                    ...updatedOrgData,
                    logo_id: e.target.value,
                  })
                }
              />
              <button type="submit" disabled={!selectedOrg}>
                Mettre à Jour
              </button>
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
                setSelectedOrg(org);
              }}
            >
              <option value="">Sélectionner une Organisation à Supprimer</option>
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
        input {
          display: block;
          margin-bottom: 10px;
          color: black;
        }
      `}</style>
    </div>
  );
};

export default Page;
