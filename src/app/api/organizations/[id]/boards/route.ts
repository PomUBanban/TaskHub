import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GET = async (
  res: NextResponse,
  { params }: { params: { id: string } },
) => {
  // Check if user have the access to the boards
  const session = await getServerSession(options);
  if (!session) return Response.json("Unauthorized", { status: 401 });

  const boards = await prisma.boards.findMany({
    where: {
      organization_id: parseInt(params.id),
    },
  });

  return Response.json(boards);
};

export { GET };
