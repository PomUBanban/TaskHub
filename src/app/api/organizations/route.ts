import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import { Session, Organizations, PublicOrganizations } from "@/types";

/**
 * Récupère la liste des organisations dans la base de données.
 * @returns Réponse HTTP avec la liste des organisations
 */
export async function GET() {
  // Fetch organizations with owner, members and logo
  const organizations: Organizations[] = (await prisma.organizations.findMany({
    include: {
      owner: {
        select: {
          id: true,
          first_name: true,
          name: true,
          email_address: true,
          profile_picture: true,
        },
      },
      // @ts-ignore
      // Include OrganizationsMemberships as 'members'
      OrganizationsMemberships: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              name: true,
              email_address: true,
              profile_picture: true,
            },
          },
        },
      },
      logo: true,
    },
  })) as unknown as Organizations[];

  const publicOrganizations: PublicOrganizations[] = organizations.map((org: Organizations) => {
    const membres = org?.OrganizationsMemberships?.map((member) => {
      return {
        id: member.id,
        first_name: member.first_name,
        name: member.name,
        email_address: member.email_address,
        phone_number: member.phone_number,
        profile_picture: {
          raw_image: member.profile_picture.raw_image,
        },
      };
    });

    return {
      id: org.id,
      name: org.name,
      logo: org.logo,
      owner: org.owner,
      members: membres ?? [],
    };
  });

  return new Response(JSON.stringify(publicOrganizations), {
    headers: { "content-type": "application/json" },
  });
}

/**
 * Crée une nouvelle organisation dans la base de données.
 * @param request Requête HTTP
 * @returns Réponse HTTP avec les données de la nouvelle organisation
 */
export async function POST(request: Request) {
  const session = (await getServerSession(options)) as unknown as Session;
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const requestData = await request.json();

  // Create organization
  const organization = await prisma.organizations.create({
    data: {
      name: requestData.name,
      logo: requestData.logo_id
        ? {
            connect: {
              id: requestData.logo_id,
            },
          }
        : {
            create: {
              raw_image: requestData.logo,
            },
          },
      owner: {
        connect: {
          id: requestData.owner_id ?? session.user?.id,
        },
      },
    },
  });

  // Create membership for owner
  await prisma.organizationsMemberships.create({
    data: {
      user: {
        connect: {
          id: requestData.owner_id ?? session.user?.id,
        },
      },
      organization: {
        connect: {
          id: organization.id,
        },
      },
    },
  });

  return new Response(JSON.stringify(organization), {
    headers: { "content-type": "application/json" },
  });
}
