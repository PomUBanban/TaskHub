import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const data = await prisma.organizations.findMany();
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}

export async function POST(request: Request) {
  const requestData = await request.json()

  const data = await prisma.organizations.create({
    data: {
      name: requestData.name,
      logo: {
        connect: {
          id: requestData.owner_id
        }
      },
      owner: {
        connect: {
          id: requestData.logo_id
        }
      }
    }
  });
  return new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
}