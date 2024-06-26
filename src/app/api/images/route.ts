import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

const GET = async (req: NextRequest) => {
  // Check if user have the access to the images
  const session = await getServerSession(options);
  if (!session) return Response.json("Unauthorized", { status: 401 });

  const images = await prisma.images.findMany();
  if (!images) return new Response("No images found", { status: 404 });
  return Response.json(images);
};

export { GET };
