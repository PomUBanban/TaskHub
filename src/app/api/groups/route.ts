import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";
import { Session, Groups, PublicGroups } from "@/types";

/**
 * Récupère la liste des organisations dans la base de données.
 * @returns Réponse HTTP avec la liste des organisations
 */
export async function GET() {
  // Fetch groups with owner, members and logo
  const groups: Groups[] = (await prisma.groups.findMany({
    include: {
      chief: {
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
      GroupsMemberships: {
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
      organization: true,
    },
  })) as unknown as Groups[];

  const publicGroups: PublicGroups[] = groups.map((org: Groups) => {
    const membres = org?.GroupsMemberships?.map((member) => {
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
      organization: org.organization,
      chief: org.chief,
      members: membres ?? [],
    };
  });

  return new Response(JSON.stringify(publicGroups), {
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
  const organization = await prisma.groups.create({
    data: {
      name: requestData.name,
      organization: {
            connect: {
              id: requestData.organization_id,
            },
          },
      chief: {
        connect: {
          id: requestData.chief_id ?? session.user?.id,
        },
      },
    },
  });

  // Create membership for chief
  await prisma.organizationsMemberships.create({
    data: {
      user: {
        connect: {
          id: requestData.chief_id ?? session.user?.id,
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
