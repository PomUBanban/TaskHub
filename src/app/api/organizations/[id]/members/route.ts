// route.tsx

import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

type Params = {
  params: {
    id: string;
  };
};

// Add member to organization
export async function POST(request: Request, { params }: Params) {
  const { id } = params;

  const requestData = await request.json();
  const user_id = requestData.user_id;

  const user = await prisma.organizationsMemberships.findFirst({
    where: {
      organizationId: parseInt(id),
      userId: parseInt(user_id),
    }
  });

  if (user) {
    return new Response("User is already a member of this organization", {
      status: 400,
    });
  }

  const org = await prisma.organizationsMemberships.create({
    data: {
      user: {
        connect: {
          id: parseInt(user_id),
        },
      },
      organization: {
        connect: {
          id: parseInt(id),
        },
      },
    },
  });

  return new Response(JSON.stringify(org), {
    headers: { "content-type": "application/json" },
  });
}

// Remove member from organization
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;

  const requestData = await request.json();
  const user_id = requestData.user_id;

  const user = await prisma.organizationsMemberships.findFirst({
    where: {
      organizationId: parseInt(id),
      userId: parseInt(user_id),
    }
  });

  if (!user) {
    return new Response("User is not a member of this organization", {
      status: 400,
    });
  }

  await prisma.organizationsMemberships.delete({
    where: {
      id: user.id,
    },
  });

  return new Response("User removed from organization", {
    status: 200,
  });
}
