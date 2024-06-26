import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const taskGroup = await prisma.taskGroups.findMany({
    where: {
      board_id: parseInt(params.id),
    },
    select: {
      id: true,
      name: true,
      Tasks: true,
    },
  });
  return NextResponse.json(JSON.stringify(taskGroup));
};
const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const data = await req.json();
  console.log(params.id);
  const taskgroup = await prisma.taskGroups.create({
    data: {
      name: data.name,
      board: {
        connect: {
          id: parseInt(params.id),
        },
      },
    },
  });
  return NextResponse.json(taskgroup);
};

export { GET, POST };
