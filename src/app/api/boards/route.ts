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

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

const GET = async (res: NextResponse) => {
  // Check if user have the access to the boards
  const session = await getServerSession(options);
  if (!session) return Response.json("Unauthorized", { status: 401 });

  const boards = await prisma.boards.findMany({
    include: {
      organization: true,
      icon: true,
      background: true,
    },
  });

  if (!boards) return new Response("No boards found", { status: 404 });
  return Response.json(boards);
};

const POST = async (res: NextResponse) => {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  // name, orgaID, icon, background
  const requestData = await res.json();
  console.log(requestData.organization_id);
  const newBoard = await prisma.boards.create({
    data: {
      name: requestData.name,
      organization: {
        connect: { id: requestData.organization_id },
      },
      icon: requestData.icon_id
        ? { connect: { id: requestData.icon_id } }
        : { create: { raw_image: requestData.icon ?? "" } },
      background: requestData.background_id
        ? { connect: { id: requestData.background_id } }
        : { create: { raw_image: requestData.background ?? "" } },
    },
  });
  console.log(newBoard);
  return NextResponse.json(JSON.stringify(newBoard));
};

export { GET, POST };
