'use client';

import { useEffect, useState } from "react";

export default function Home() {
  interface User {
    first_name: string;
    // add other properties
  }
  const [data , setData] = useState<User | null>(null);
  const serverSideProps = async () => {
    const res = await fetch("/api");
    const data = await res.json();
    setData(data);
  }
  useEffect(() => {
    serverSideProps();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-white"><p>{data?.first_name}</p></main>
  );
}
