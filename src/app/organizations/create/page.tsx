"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

const Page: React.FC = () => {
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });
  const router = useRouter();

  const [name, setName] = React.useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/organizations", {
      method: "POST",
      body: JSON.stringify({
        name,
        //@ts-ignore
        owner_id: data?.user?.id,
        logo_id: "",
        logo: "",
      }),
    });
    router.push("/boards");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col w-[20%]">
        <label htmlFor="name">Name</label>
        <input
          className="text-black"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          name="name"
          id="name"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Page;
