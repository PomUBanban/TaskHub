// model Boards {
//   id              Int    @id @default(autoincrement())
//   organization_id Int    @unique
//   name            String
//   icon_id         Int    @unique
//   background_id   Int    @unique

//   organization Organizations @relation(fields: [organization_id], references: [id])
//   icon         Images        @relation(fields: [icon_id], references: [id], name: "BoardsIcon")
//   background   Images        @relation(fields: [background_id], references: [id], name: "BoardsBg")

//   TaskGroups TaskGroups[]
// }

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

const GET = async (res: NextResponse, { params }: Params) => {
  const { id } = params;
  const board = await prisma.boards.findUnique({
    where: {
      id: parseInt(id as string),
    },
    include: {
      organization: true,
      icon: true,
      background: true,
    },
  });

  if (!board) return new Response("Board not found", { status: 404 });
  return Response.json(board);
};

const DELETE = async (res: NextResponse, { params }: Params) => {
  const { id } = params;
  const board = await prisma.boards.delete({
    where: {
      id: parseInt(id as string),
    },
  });

  return Response.json(board);
};

const PUT = async (res: NextResponse, { params }: Params) => {
  const { id } = params;
  const requestData = await res.json();

  const updatedBoard = await prisma.boards.update({
    where: {
      id: parseInt(id as string),
    },
    data: {
      name: requestData.name,
      icon: requestData.icon_id
        ? { connect: { id: requestData.icon_id } }
        : { create: { raw_image: requestData.icon } },
      background: requestData.background_id
        ? { connect: { id: requestData.background_id } }
        : { create: { raw_image: requestData.background } },
    },
  });

  return Response.json(updatedBoard);
};

export { GET, DELETE, PUT };
