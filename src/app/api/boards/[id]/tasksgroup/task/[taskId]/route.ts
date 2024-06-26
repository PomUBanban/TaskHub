import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string; taskId: string } },
) => {
  const data = await req.json();
  const task = await prisma.tasks.update({
    where: {
      id: parseInt(params.taskId),
    },
    data: {
      task_group: {
        connect: {
          id: parseInt(data.taskGroupId),
        },
      },
    },
  });
  return NextResponse.json(task);
};

const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string; taskId: string } },
) => {
  await prisma.tasks.delete({
    where: {
      id: parseInt(params.taskId),
    },
  });
  return NextResponse.json({ success: true });
};

export { PUT, DELETE };
