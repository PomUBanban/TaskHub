import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(options);
  return <pre>{JSON.stringify(session, null, 2)}</pre>;
}
