import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const POST = async (
  req: NextRequest,
  { params }: { params: { id: string } },
) => {
  const data = await req.json();
  const task = await prisma.tasks.create({
    data: {
      name: data.name,
      task_group: {
        connect: {
          id: parseInt(data.taskGroupId),
        },
      },
    },
  });
  return NextResponse.json(task);
};

export { POST };
