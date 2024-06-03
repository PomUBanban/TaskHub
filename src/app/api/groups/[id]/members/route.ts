// route.tsx

import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

type Params = {
  params: {
    id: string;
  };
};

// Add member to group
export async function POST(request: Request, { params }: Params) {
  const { id } = params;

  const requestData = await request.json();
  const user_id = requestData.user_id;

  const user = await prisma.groupsMemberships.findFirst({
    where: {
      groupId: parseInt(id),
      userId: parseInt(user_id),
    }
  });

  if (user) {
    return new Response("User is already a member of this group", {
      status: 400,
    });
  }

  const userMemeberOfOrg = await prisma.organizationsMemberships.findFirst({
    where: {
      organizationId: parseInt(id),
      userId: parseInt(user_id),
    }
  });

  if (!userMemeberOfOrg) {
    return new Response("User is not a member of the organization", {
      status: 400,
    });
  }

  const grp = await prisma.groupsMemberships.create({
    data: {
      user: {
        connect: {
          id: parseInt(user_id),
        },
      },
      group: {
        connect: {
          id: parseInt(id),
        },
      },
    },
  });

  return new Response(JSON.stringify(grp), {
    headers: { "content-type": "application/json" },
  });
}

// Remove member from group
export async function DELETE(request: Request, { params }: Params) {
  const { id } = params;

  const requestData = await request.json();
  const user_id = requestData.user_id;

  const user = await prisma.groupsMemberships.findFirst({
    where: {
      groupId: parseInt(id),
      userId: parseInt(user_id),
    }
  });

  if (!user) {
    return new Response("User is not a member of this group", {
      status: 400,
    });
  }

  await prisma.groupsMemberships.delete({
    where: {
      id: user.id,
    },
  });

  return new Response("User removed from group", {
    status: 200,
  });
}
