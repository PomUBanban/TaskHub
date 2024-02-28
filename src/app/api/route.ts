import prisma from "@/lib/prisma";

export async function GET(request: Request) {
 const data = await prisma.users.findFirst();
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}
