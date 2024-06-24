import prisma from "@/lib/prisma";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

/**
 * Récupère la liste des organisations dans la base de données.
 * @returns Réponse HTTP avec la liste des organisations
 */
export async function GET() {
  // Fetch organizations with owner, members and logo
  const organizations = await prisma.organizations.findMany({
    include: {
      owner: {
        select: {
          id: true,
          first_name: true,
          name: true,
          email_address: true,
          phone_number: true,
          profile_picture: {
            select: {
              raw_image: true,
            },
          },
        },
      },
      OrganizationsMemberships: {
        include: {
          user: {
            select: {
              id: true,
              first_name: true,
              name: true,
              email_address: true,
              phone_number: true,
              profile_picture: {
                select: {
                  raw_image: true,
                },
              },
            },
          },
        },
      },
      logo: {
        select: {
          raw_image: true,
        },
      },
    },
  });

  // Rename all organizationsMemberships to members
  organizations.forEach((org) => {
    org.members = [];
    org.OrganizationsMemberships.forEach((membership) => {
      org.members.push(membership.user);
    });
    delete org.OrganizationsMemberships;
    delete org.owner.password;
    delete org.owner_id;
    delete org.logo_id;
  });

  return new Response(JSON.stringify(organizations), {
    headers: { "content-type": "application/json" },
  });
}

/**
 * Crée une nouvelle organisation dans la base de données.
 * @param request Requête HTTP
 * @returns Réponse HTTP avec les données de la nouvelle organisation
 */
export async function POST(request: Request) {
  const session = await getServerSession(options);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { name, logo_id, logo, owner_id, owner } = await request.json();

  // Create organization
  const organization = await prisma.organizations.create({
    data: {
      name: name,
      logo: logo_id
        ? {
            connect: {
              id: logo_id,
            },
          }
        : {
            create: {
              raw_image: logo,
            },
          },
      owner: {
        connect: {
          id: owner_id ?? session.user.id,
        },
      },
    },
  });

  // Create membership for owner
  await prisma.organizationsMemberships.create({
    data: {
      user: {
        connect: {
          id: owner ?? session.user.id,
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
