"use client";
import React, { use, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const Page = ({ params }: { params: { id: string } }) => {
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [organization_id, setOrganization_id] = React.useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/boards", {
      method: "POST",
      body: JSON.stringify({
        name,
        organization_id: parseInt(organization_id),
        //@ts-ignore
        owner_id: data?.user?.id,
        logo_id: "",
        logo: "",
      }),
    });
    router.push("/boards");
  };

  useEffect(() => {
    setOrganization_id(
      //@ts-ignore
      document.getElementById("organization_id").value,
    );
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-black p-6 m-9 rounded-lg shadow-lg"
    >
      <div className="flex flex-col w-full mb-4">
        <label htmlFor="name" className="mb-2 font-semibold text-gray-700">
          Board name
        </label>
        {/* hidden_input containing organization_id */}
        <input type="hidden" value={params.id} id="organization_id" />
        <input
          className="p-3 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          name="name"
          id="name"
        />
      </div>
      <button
        type="submit"
        className="w-full p-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Submit
      </button>
    </form>
  );
};

export default Page;
