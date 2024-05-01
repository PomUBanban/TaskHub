"use client";
import React, { useState, useEffect } from "react";
import ErrorMessage from "../ErrorMessage";
import { Organizations, Users, Images } from "@prisma/client"; // Component to display errors

type Props = {
  organization: Organizations;
};

const MembersPage: React.FC<Props> = ({ organization }) => {
  const [members, setMembers] = useState<Users[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/organizations/${organization.id}/members`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch members");
        }
        return res.json();
      })
      .then(setMembers)
      .catch((err) => setError(err.message));
  }, [organization.id]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <h1>Members</h1>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <img src={`/api/images/${member.profile_picture_id}`} alt={member.name||""} />
            {member.name}
          </li>
        ))}
      </ul>
    </div>
  );
};