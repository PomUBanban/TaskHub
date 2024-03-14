import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession(options);

  // The user can only see organizations where they are a member (the users with the role ADMIN can see everything)
  const data = await prisma.organizations.findMany({
    where: {
          owner: {
            id: session?.user.id,
          },
        },
  });
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request) {
  const requestData = await request.json()

  const data = await prisma.organizations.create({
    data: {
      name: requestData.name,
      logo: {
        connect: {
          id: requestData.owner_id
        }
      },
      owner: {
        connect: {
          id: requestData.logo_id
        }
      }
    }
  });
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}