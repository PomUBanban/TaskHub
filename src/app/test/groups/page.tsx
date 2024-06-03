// Check the crud page for the group entity

// Path: src/app/test/groups/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import { Groups } from "@/types";
import { text } from "stream/consumers";

const Page: React.FC = () => {

    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/api/auth/signin");
        },
    });
    if (status === "loading") {
        return "Loading or not authenticated...";
    }

    const [groups, setGroups] = useState<Groups[]>([]);
    useEffect(() => {
        fetch("/api/groups", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setGroups(data);
            });
    }, []);

    return (
        <div>
            <br />
            <h1>Groups</h1>
            <br />
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>{group.name} / Org:{group.organization.name} / Chief:{group.chief.first_name} {group.chief.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default Page;