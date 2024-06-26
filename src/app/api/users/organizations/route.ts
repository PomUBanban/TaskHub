//route file api

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

const GET = async (res: NextResponse) => {
  // Check if user have the access to the boards
  const session = await getServerSession(options);
  if (!session) return Response.json("Unauthorized", { status: 401 });

  const users = await prisma.users.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      organizationsMemberships: {
        include: {
          organization: {
            include: {
              Boards: true,
            },
          },
        },
      },
    },
  });
  return Response.json(users);
};

export { GET };
